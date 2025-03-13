// src/utils/flashcardUtils.js

/**
 * 카테고리와 해당 카테고리의 아이템을 포함한 플래시카드 데이터를 로드합니다.
 * @returns {Promise<Object>} 로드된 플래시카드 데이터
 */
export const loadFlashcardData = async () => {
    try {
      const response = await fetch('/flashcardsInfo.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('플래시카드 데이터를 로드하는 중 오류 발생:', error);
      throw error;
    }
  };
  
  /**
   * 플래시카드 데이터를 처리하여 셔플된 카드 배열로 변환합니다.
   * @param {Object} data - JSON에서 로드된 플래시카드 데이터
   * @param {string} categoryPath - 필터링할 카테고리 경로 (전체 카드를 원하면 null)
   * @returns {Array} 셔플된 카드 배열
   */
  export const processFlashcardData = (data, categoryPath = null) => {
    if (!data || !data.categories) return [];
  
    let allItems = [];
  
    data.categories.forEach(category => {
      // 특정 카테고리만 필터링하거나 모든 카테고리 포함
      if (!categoryPath || category.path === categoryPath) {
        // 각 아이템에 카테고리 정보 추가
        const itemsWithCategory = category.items.map(item => ({
          ...item,
          category: {
            path: category.path,
            korName: category.korName,
            engName: category.engName
          }
        }));
        
        allItems = [...allItems, ...itemsWithCategory];
      }
    });
  
    // 아이템 순서를 섞기
    return shuffleArray(allItems);
  };
  
  /**
   * 배열을 무작위로 섞는 함수 (Fisher-Yates 알고리즘)
   * @param {Array} array - 섞을 배열
   * @returns {Array} 섞인 배열
   */
  export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  /**
   * 단어로 특정 카드 아이템을 찾는 함수
   * @param {Object} data - 플래시카드 데이터
   * @param {string} word - 찾을 단어
   * @param {string} language - 언어 (kor 또는 eng)
   * @returns {Object|null} 찾은 아이템 또는 null
   */
  export const findItemByWord = (data, word, language = 'kor') => {
    if (!data || !data.categories) return null;
  
    for (const category of data.categories) {
      const foundItem = category.items.find(
        item => item[`${language}_word`]?.toLowerCase() === word
      );
      
      if (foundItem) {
        return {
          ...foundItem,
          category: {
            path: category.path,
            korName: category.korName,
            engName: category.engName
          }
        };
      }
    }
    
    return null;
  };