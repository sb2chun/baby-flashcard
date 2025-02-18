import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';


// src/components/FlashcardApp/CategorySidebar.jsx
const CategorySidebar = ({
  controlPanelRef,
  categories,
  selectedCategories,
  setSelectedCategories,
  language,
  flashcardData,
  setCurrentIndex,
}) => {
  const [controlPanelHeight, setControlPanelHeight] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      if (controlPanelRef.current) {
        setControlPanelHeight(controlPanelRef.current.offsetHeight);
      }
    };

    handleResize(); // 초기 호출
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [controlPanelRef]);

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
    <div 
      className="w-[30vw] md:w-[20vw] text-[15px] md:text-base border-l overflow-y-auto bg-white backdrop-blur-md"
      style={{
        height: `calc(100vh - ${controlPanelHeight}px)`,
        marginTop: `${controlPanelHeight}px`,
      }}
    >
      <div className="p-4 border-b">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">
          {language === "kor" ? "카테고리" : "Categories"}
        </h2>
      </div>
      <div className="">
        <div className="">
          {categories.map((category) => (
            <button
              key={category.path}
              onClick={() => handleCategoryChange(category.path)}
              className={`min-w-full w-full text-nowrap px-4 py-3 flex items-center gap-3 transition
                ${selectedCategories.has(category.path) 
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                  : "hover:bg-gray-50"
                }`}
            >
              <input
                type="checkbox"
                checked={selectedCategories.has(category.path)}
                onChange={(e) => e.stopPropagation()}
                className="w-4 h-4 rounded border-gray-300"
              />
              <div className="flex items-center text-left">
                <p className="block font-medium">
                  {language === "kor" ? category.korName : category.engName}
                </p>
                {category.path !== "통합" && (
                  <p className="text-sm px-1 text-gray-500">
                    ({flashcardData.filter(item => item.category.path === category.path).length})
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategorySidebar;
