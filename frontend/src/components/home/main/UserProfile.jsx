import { MdExpandMore } from 'react-icons/md';

export default function UserProfile({ user }) {
  const defaultUser = user || {
    name: "Andy Sorne",
    email: "Inquira Beta Tester",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  };

  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all"
      style={{
        backgroundColor: 'var(--color-secondary-background)',
        margin: 'clamp(1rem, 1.5vw, 1.5rem)',
        marginTop: 'auto'
      }}
    >
      {/* Avatar */}
      <div className="avatar">
        <div 
          className="rounded-full"
          style={{
            width: 'clamp(2.5rem, 3.5vw, 3rem)',
            height: 'clamp(2.5rem, 3.5vw, 3rem)'
          }}
        >
          <img src={defaultUser.avatar} alt={defaultUser.name} />
        </div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <p 
          className="truncate"
          style={{ 
            color: 'var(--color-primary-color)',
            fontSize: 'clamp(0.8125rem, 1.35vw, 0.9375rem)',
            fontWeight: '600',
            marginBottom: '0.125rem'
          }}
        >
          {defaultUser.name}
        </p>
        <p 
          className="truncate"
          style={{ 
            color: 'var(--color-text-secondary)',
            fontSize: 'clamp(0.6875rem, 1.15vw, 0.8125rem)'
          }}
        >
          {defaultUser.email}
        </p>
      </div>

      {/* Dropdown Icon */}
      <MdExpandMore 
        style={{ 
          fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
          color: 'var(--color-text-secondary)',
          flexShrink: 0
        }} 
      />
    </div>
  );
}
