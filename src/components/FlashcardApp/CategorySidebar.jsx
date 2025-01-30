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
    <div className="w-[15vw] mt-[10vh] bg-white shadow-lg">
      <div className="p-4 h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">카테고리</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.path}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer ${
                selectedCategories.has(category.path) ? "bg-blue-100" : ""
              }`}
              onClick={() => handleCategoryChange(category.path)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-10"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.has(category.path)}
                  onChange={(e) => handleCheckboxClick(e, category.path)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
              <span className="flex-1">
                {language === "kor" ? category.korName : category.engName}
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
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
