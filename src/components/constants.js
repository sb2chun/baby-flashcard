// constants.js
export const REPO_OWNER = "sb2chun";
export const REPO_NAME = "baby-flashcard";

export const GITHUB_PAGES_URL = `https://${REPO_OWNER}.github.io/${REPO_NAME}/flashcards.json`;
export const CACHE_KEY = "flashcards_data";
export const CACHE_DURATION = 60 * 60 * 1000; // 1시간

export const generateRandomColor = () => {
  const colors = [
    "#FFB6C1",
    "#FFEB3B",
    "#9C27B0",
    "#FF9800",
    "#795548",
    "#607D8B",
    "#E91E63",
    "#2196F3",
    "#4CAF50",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};