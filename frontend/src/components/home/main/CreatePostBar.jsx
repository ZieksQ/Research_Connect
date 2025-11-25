import { MdAdd } from 'react-icons/md';

export default function CreatePostBar({ onCreateClick }) {
  return (
    <div 
      className="rounded-xl shadow-sm flex items-center justify-between"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-shade-primary)',
        padding: 'clamp(0.875rem, 1.5vw, 1.25rem)',
        marginBottom: 'clamp(1rem, 2vw, 1.5rem)'
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="avatar">
          <div 
            className="rounded-full"
            style={{
              width: 'clamp(2.5rem, 4vw, 3rem)',
              height: 'clamp(2.5rem, 4vw, 3rem)',
              backgroundColor: 'var(--color-secondary-background)'
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" 
              alt="User" 
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Start a new research study..."
          className="input input-ghost w-full border-0 focus:outline-none"
          onClick={onCreateClick}
          readOnly
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            padding: 0
          }}
        />
      </div>
      <button
        onClick={onCreateClick}
        className="btn btn-circle btn-sm"
        style={{
          backgroundColor: '#22c55e',
          borderColor: '#22c55e',
          color: '#ffffff',
          width: 'clamp(2rem, 3vw, 2.5rem)',
          height: 'clamp(2rem, 3vw, 2.5rem)',
          minHeight: 'auto'
        }}
      >
        <MdAdd 
          style={{ 
            fontSize: 'clamp(1.25rem, 2vw, 1.5rem)'
          }} 
        />
      </button>
    </div>
  );
}
