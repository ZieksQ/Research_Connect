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
    <div 
      className="mb-6"
      style={{
        marginBottom: 'clamp(1.5rem, 2.5vw, 2rem)'
      }}
    >
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.id && !isCustomActive;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`btn btn-sm ${isActive ? 'btn-active' : ''}`}
              style={{
                backgroundColor: isActive ? 'var(--color-primary-color)' : '#ffffff',
                borderColor: 'var(--color-shade-primary)',
                color: isActive ? '#ffffff' : 'var(--color-primary-color)',
                fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
                padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(0.875rem, 1.5vw, 1.25rem)',
                fontWeight: isActive ? '600' : '400',
                height: 'auto',
                minHeight: 'clamp(2rem, 3vw, 2.5rem)',
                borderRadius: 'clamp(0.375rem, 0.75vw, 0.5rem)'
              }}
            >
              {category.name}
            </button>
          );
        })}

        {/* Custom Filter Button - Icon Only */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`btn btn-sm btn-square ${isCustomActive ? 'btn-active' : ''}`}
          style={{
            backgroundColor: isCustomActive ? 'var(--color-accent-100)' : '#ffffff',
            borderColor: 'var(--color-shade-primary)',
            color: isCustomActive ? '#ffffff' : 'var(--color-primary-color)',
            minHeight: 'clamp(2rem, 3vw, 2.5rem)',
            width: 'clamp(2rem, 3vw, 2.5rem)',
            height: 'clamp(2rem, 3vw, 2.5rem)',
            borderRadius: 'clamp(0.375rem, 0.75vw, 0.5rem)'
          }}
          title={isCustomActive ? `Custom: ${customFilter}` : 'Custom filter'}
        >
          <FaFilter size={14} />
        </button>

        {/* Show custom filter tag when active */}
        {isCustomActive && (
          <div 
            className="flex items-center gap-1 px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'var(--color-accent-100)',
              color: '#ffffff',
              fontSize: 'clamp(0.7rem, 1.1vw, 0.8rem)',
            }}
          >
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
        <div className="modal-box" style={{ maxWidth: '400px' }}>
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsModalOpen(false)}
          >
            <FaTimes />
          </button>
          
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaFilter className="text-primary" />
            Custom Filter
          </h3>
          
          <p className="text-base-content/70 text-sm mb-4">
            Enter a custom tag or category to filter surveys.
          </p>

          <div className="form-control">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter custom filter (e.g., research, survey)"
                className="input input-bordered w-full pr-10"
                value={customFilter}
                onChange={(e) => setCustomFilter(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            </div>
          </div>

          <div className="modal-action">
            <button 
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
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
