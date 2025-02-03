const fs = require('fs');
const path = require('path');

const generateJson = () => {
  console.log('Starting script execution');
  
  const baseDir = path.join('public', 'images');
  
  // 디렉토리 존재 확인
  if (!fs.existsSync(baseDir)) {
    console.error(`Directory ${baseDir} does not exist`);
    process.exit(1);
  }

  try {
    // 카테고리 폴더 찾기
    const dirs = fs.readdirSync(baseDir)
      .filter(f => {
        const fullPath = path.join(baseDir, f);
        return fs.statSync(fullPath).isDirectory() &&
               f.includes('_') &&
               !f.startsWith('.');
      });

    console.log('Found categories:', dirs);

    const categories = dirs.map(dir => {
      const [korName, engName] = dir.split('_');
      if (!korName || !engName) {
        throw new Error(`Invalid directory name format: ${dir}`);
      }

      const categoryPath = path.join(baseDir, dir);
      const images = fs.readdirSync(categoryPath)
        .filter(f => f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'))
        .sort(); // 파일 이름 기준으로 정렬

      console.log(`Processing category ${dir}, found ${images.length} images`);

      const items = images.map((img, index) => {
        const nameParts = path.basename(img, path.extname(img)).split('_');

        let order, korWord, engWord;

        // 첫 번째 값이 숫자인지 확인
        if (!isNaN(nameParts[0])) {
          // 형식: 순서_한국어_영어
          order = parseInt(nameParts[0], 10);
          korWord = nameParts[1];
          engWord = nameParts[2];
        } else {
          // 형식: 한국어_영어 (순서 자동 부여)
          order = index + 1;
          korWord = nameParts[0];
          engWord = nameParts[1];
        }

        // 유효성 검사
        if (!korWord || !engWord) {
          throw new Error(`Invalid image name format in ${dir}: ${img}`);
        }

        return {
          order,
          kor_word: korWord,
          eng_word: engWord,
          image: `https://raw.githubusercontent.com/sb2chun/baby-flashcard/main/public/images/${dir}/${img}`,
          category: {
            path: engName,
            kor: korName,
            eng: engName
          }
        };
      });

      return {
        path: engName,
        korName,
        engName,
        items
      };
    });

    // docs 폴더 생성
    if (!fs.existsSync('docs')) {
      fs.mkdirSync('docs', { recursive: true });
    }

    // JSON 파일 생성
    const jsonPath = 'docs/flashcards.json';
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({ categories }, null, 2)
    );

    console.log(`Successfully generated ${jsonPath}`);
  } catch (error) {
    console.error('Error generating JSON:', error);
    process.exit(1);
  }
};

generateJson();
