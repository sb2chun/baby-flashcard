// src/components/common/Navbar.jsx
import { Link } from "react-router-dom";

const Navigation = ({ }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">FlashCard Master</Link>
            <div className="ml-10 flex space-x-4">
              <Link to="/study" className="px-3 py-2 rounded-md hover:bg-gray-100">학습하기</Link>
              <Link to="/statistics" className="px-3 py-2 rounded-md hover:bg-gray-100">통계</Link>
              <Link to="/about" className="px-3 py-2 rounded-md hover:bg-gray-100">소개</Link>
              <Link to="/help" className="px-3 py-2 rounded-md hover:bg-gray-100">도움말</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
