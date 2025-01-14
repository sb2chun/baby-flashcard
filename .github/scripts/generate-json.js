const fs = require('fs');
const path = require('path');

const generateJson = () => {
  // 카테고리 폴더 찾기 (언더스코어가 있는 폴더)
  const baseDir = path.join('public', 'images');
  const dirs = fs.readdirSync(baseDir)
    .filter(f =>
      fs.statSync(path.join(baseDir, f)).isDirectory() &&
      f.includes('_') &&
      !f.startsWith('.')
    );

  const categories = dirs.map(dir => {
    const [engName, korName] = dir.split('_');

    // 폴더 내 PNG 파일 찾기
    const images = fs.readdirSync(path.join(baseDir, dir))
      .filter(f => f.toLowerCase().endsWith('.png'));

    // 각 이미지에 대한 항목 생성
    const items = images.map(img => {
      const [engWord, korWord] = path.basename(img, '.png').split('_');
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

  // docs 폴더 생성 (없는 경우)
  if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs');
  }

  // JSON 파일 생성
  fs.writeFileSync(
    'docs/flashcards.json',
    JSON.stringify({ categories }, null, 2)
  );
};

generateJson();