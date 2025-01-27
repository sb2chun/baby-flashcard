
// src/components/FlashcardApp/CategorySidebar.jsx
const CategorySidebar = ({
    categories,
    selectedCategory,
    setSelectedCategory,
    language,
    flashcardData,
    setCurrentIndex
  }) => {
    // 카테고리 변경 핸들러
    const handleCategoryChange = (categoryPath) => {
      setSelectedCategory(categoryPath);
      setCurrentIndex(0);  // 카테고리 변경 시 인덱스 리셋
    };
  
    return (
      <div className="w-[15vw] mt-[10vh] bg-white shadow-lg">
        <div className="p-4 h-[80vh] overflow-y-auto"> {/* 높이와 스크롤 추가 */}
          <h2 className="text-xl font-bold mb-4">카테고리</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.path}
                onClick={() => handleCategoryChange(category.path)}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedCategory === category.path
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {/* 카테고리 이름 (언어에 따라) */}
                {language === "kor" ? category.korName : category.engName}
                
                {/* 카드 수량 표시 (통합 카테고리 제외) */}
                {category.path !== "통합" && (
                  <span className="ml-2 text-sm">
                    (
                    {
                      flashcardData.filter(
                        (item) => item.category.path === category.path
                      ).length
                    }
                    )
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default CategorySidebar;
  