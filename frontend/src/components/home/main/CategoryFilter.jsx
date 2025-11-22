import { categories } from '../../../static/postsData.js';

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div 
      className="flex flex-wrap gap-2"
      style={{
        marginBottom: 'clamp(1.5rem, 2.5vw, 2rem)'
      }}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className="btn btn-sm gap-2"
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
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
