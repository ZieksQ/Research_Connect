import { MdSearch } from 'react-icons/md';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div 
      className="form-control"
      style={{
        marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
      }}
    >
      <div className="input-group">
        <span 
          className="bg-white border-r-0"
          style={{
            borderColor: 'var(--color-shade-primary)',
            padding: 'clamp(0.625rem, 1.2vw, 0.875rem)'
          }}
        >
          <MdSearch 
            style={{ 
              fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
              color: 'var(--color-text-secondary)'
            }} 
          />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Filter Surveys"}
          className="input input-bordered w-full border-l-0"
          style={{
            backgroundColor: '#ffffff',
            borderColor: 'var(--color-shade-primary)',
            color: 'var(--color-primary-color)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            padding: 'clamp(0.625rem, 1.2vw, 0.875rem)'
          }}
        />
      </div>
    </div>
  );
}
