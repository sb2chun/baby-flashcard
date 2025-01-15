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
        .filter(f => f.toLowerCase().endsWith('.png'));

      console.log(`Processing category ${dir}, found ${images.length} images`);

      const items = images.map(img => {
        const [korWord, engWord] = path.basename(img, '.png').split('_');
        if (!korWord || !engWord) {
          throw new Error(`Invalid image name format in ${dir}: ${img}`);
        }

        return {
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
