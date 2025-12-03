import React, { useState, useEffect, useRef } from "react";
import InquiraIcon from "../../assets/icons/Inquira.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp, IoSearchOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { useSearch } from "../../context/SearchProvider";
import { searchSurvey } from "../../services/survey/survey.service";

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const [localQuery, setLocalQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedQuery = useDebounce(localQuery, 500);
  const { setSearchResults, setIsSearching, setSearchQuery, clearSearch } = useSearch();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim() === '') {
        clearSearch();
        return;
      }

      setIsSearching(true);
      setSearchQuery(debouncedQuery);
      
      try {
        const results = await searchSurvey(debouncedQuery, 'asc');
        setSearchResults(results?.message || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    // Focus input when search opens on mobile
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleClearSearch = () => {
    setLocalQuery('');
    clearSearch();
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    handleClearSearch();
  };

  return (
    <header className="navbar bg-base-100 shadow-md border-b border-base-300 px-2 sm:px-4 min-h-16">
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-white z-50 flex items-center px-3 gap-2 md:hidden">
          <button
            onClick={handleCloseSearch}
            className="btn btn-ghost btn-circle flex-shrink-0"
          >
            <MdClose size={24} />
          </button>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
              <IoSearchOutline className="text-gray-500" size={20} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search surveys..."
              className="w-full h-11 pl-12 pr-10 text-base rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {localQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 hover:opacity-70 transition-opacity z-10"
              >
                <MdClose className="text-gray-500 hover:text-gray-700" size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Regular Navbar Content */}
      <div className="navbar-start">
        <button
          onClick={toggleSidebar}
          className="btn btn-square btn-ghost"
        >
          {sidebarOpen ? (
            <IoCloseSharp size={24} />
          ) : (
            <GiHamburgerMenu size={22} />
          )}
        </button>

        <Link to="/home" className="btn btn-ghost normal-case text-xl ml-2">
          <img src={InquiraIcon} alt="Inquira"/>
        </Link>
      </div>

      {/* Spacer for centering */}
      <div className="navbar-center hidden md:flex"></div>

      {/* Desktop Search Bar - Right side */}
      <div className="navbar-end flex items-center gap-2">
        {/* Desktop Search */}
        <div className="hidden md:flex relative w-80 lg:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
            <IoSearchOutline className="text-gray-500" size={20} />
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search surveys..."
            className="w-full h-11 pl-12 pr-10 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {localQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 hover:opacity-70 transition-opacity z-10"
            >
              <MdClose className="text-gray-500 hover:text-gray-700" size={20} />
            </button>
          )}
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="btn btn-ghost btn-circle md:hidden"
        >
          <IoSearchOutline size={24} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
