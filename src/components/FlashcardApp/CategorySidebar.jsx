// src/components/FlashcardApp/CategorySidebar.jsx
const CategorySidebar = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  language,
  flashcardData,
  setCurrentIndex,
}) => {
  const handleCategoryChange = (categoryPath) => {
    setSelectedCategories((prev) => {
      const newCategories = new Set(prev);

      if (categoryPath === "통합") {
        return new Set(["통합"]);
      } else {
        newCategories.delete("통합");

        if (newCategories.has(categoryPath)) {
          newCategories.delete(categoryPath);
          if (newCategories.size === 0) {
            newCategories.add("통합");
          }
        } else {
          newCategories.add(categoryPath);
        }
      }

      return newCategories;
    });
    setCurrentIndex(0);
  };

  // 이벤트 버블링으로 인하여 체크박스 클릭 이벤트를 별도로 처리
  const handleCheckboxClick = (e, categoryPath) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    handleCategoryChange(categoryPath);
  };

  
  
  return (
    <div className="w-[30vw] md:w-[15vw] mt-[8vh] bg-white shadow-lg text-[10px] md:text-base">
      <div className="pt-6 md:pt-4 h-[80vh] overflow-y-auto">
        <h2 className="text-[11px] md:text-xl font-bold mb-2 md:mb-4 mt-4 md:mt-5">
          {language === "kor" ? "카테고리" : "Categories"}
        </h2>
        <div className="space-y-1 md:space-y-2">
          {categories.map((category) => (
            <div
              key={category.path}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded hover:bg-gray-100 cursor-pointer ${
                selectedCategories.has(category.path) ? "bg-blue-100" : ""
              }`}
              onClick={() => handleCategoryChange(category.path)}
            >
              {/* 체크박스 (클릭 시 이벤트 버블링 방지) */}
              <div onClick={(e) => e.stopPropagation()} className="relative z-10">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(category.path)}
                  onChange={(e) => handleCheckboxClick(e, category.path)}
                  className="w-3 h-3 md:w-4 md:h-4 rounded cursor-pointer"
                />
              </div>

              {/* 카테고리 이름 및 플래시카드 개수 */}
              <span className="flex-1 truncate">
                {language === "kor" ? category.korName : category.engName}
                {category.path !== "통합" && (
                  <span className="ml-1 md:ml-2 text-[9px] md:text-sm text-gray-500">
                    (
                    {
                      flashcardData.filter(
                        (item) => item.category.path === category.path
                      ).length
                    }
                    )
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
