import { useState, useRef, useEffect } from 'react';
import { categories } from '../../../static/postsData.js';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customFilter, setCustomFilter] = useState('');
  const [isCustomActive, setIsCustomActive] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  const handleCustomFilterApply = () => {
    if (customFilter.trim()) {
      onCategoryChange(customFilter.trim().toLowerCase());
      setIsCustomActive(true);
      setIsModalOpen(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
    setIsCustomActive(false);
    setCustomFilter('');
  };

  const handleClearCustom = () => {
    setCustomFilter('');
    setIsCustomActive(false);
    onCategoryChange('all');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCustomFilterApply();
    } else if (e.key === 'Escape') {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="mb-8">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.id && !isCustomActive;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`btn btn-sm h-auto min-h-[2rem] lg:min-h-[2.5rem] px-3 lg:px-5 rounded-lg text-xs lg:text-sm font-normal ${
                isActive 
                  ? 'bg-custom-blue border-custom-blue text-white hover:bg-blue-800 hover:border-blue-800 font-semibold' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {category.name}
            </button>
          );
        })}

        {/* Custom Filter Button - Icon Only */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`btn btn-sm btn-square h-8 w-8 lg:h-10 lg:w-10 min-h-0 rounded-lg ${
            isCustomActive 
              ? 'bg-custom-blue border-custom-blue text-white hover:bg-blue-800' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title={isCustomActive ? `Custom: ${customFilter}` : 'Custom filter'}
        >
          <FaFilter size={14} />
        </button>

        {/* Show custom filter tag when active */}
        {isCustomActive && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-custom-blue text-white text-xs lg:text-sm">
            <span>{customFilter}</span>
            <button
              onClick={handleClearCustom}
              className="hover:opacity-70 transition-opacity ml-1"
              title="Clear custom filter"
            >
              <FaTimes size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Custom Filter Modal */}
      <dialog 
        ref={modalRef}
        className={`modal ${isModalOpen ? 'modal-open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
      >
        <div className="modal-box max-w-sm bg-white">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsModalOpen(false)}
          >
            <FaTimes />
          </button>
          
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-custom-blue">
            <FaFilter />
            Custom Filter
          </h3>
          
          <p className="text-gray-600 text-sm mb-4">
            Enter a custom tag or category to filter surveys.
          </p>

          <div className="form-control">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter custom filter (e.g., research, survey)"
                className="input input-bordered w-full pr-10 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue"
                value={customFilter}
                onChange={(e) => setCustomFilter(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="modal-action">
            <button 
              className="btn btn-ghost hover:bg-gray-100"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn bg-custom-blue text-white hover:bg-blue-800 border-none"
              onClick={handleCustomFilterApply}
              disabled={!customFilter.trim()}
            >
              Apply Filter
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
