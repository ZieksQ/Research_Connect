import { MdHome, MdPersonOutline, MdSettings, MdMenu } from 'react-icons/md';
import UserProfile from './UserProfile';

export default function Sidebar({ activeTab, onTabChange, children }) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: MdHome },
    { id: 'foryou', label: 'For you', icon: MdPersonOutline },
    { id: 'settings', label: 'Settings', icon: MdSettings }
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <label 
            htmlFor="sidebar-drawer" 
            className="btn btn-circle btn-sm drawer-button shadow-lg"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--color-shade-primary)',
              color: 'var(--color-primary-color)'
            }}
          >
            <MdMenu 
              style={{ 
                fontSize: 'clamp(1.125rem, 1.75vw, 1.25rem)'
              }} 
            />
          </label>
        </div>
        
        {/* Page content */}
        {children}
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div 
          className="h-full flex flex-col"
          style={{
            width: 'clamp(200px, 20vw, 280px)',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Navigation Menu */}
          <div 
            className="flex-1"
            style={{
              padding: 'clamp(1.5rem, 2vw, 2rem) clamp(1rem, 1.5vw, 1.5rem)',
              paddingBottom: 0
            }}
          >
            <ul className="menu menu-lg">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <li key={item.id}>
                    <a
                      onClick={() => onTabChange(item.id)}
                      className={isActive ? 'active' : ''}
                      style={{
                        // display: 'flex',
                        // alignItems: 'center',
                        // gap: 'clamp(0.75rem, 1.25vw, 1rem)',
                        // padding: 'clamp(0.75rem, 1.2vw, 1rem) clamp(1rem, 1.5vw, 1.25rem)',
                        // marginBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
                        // backgroundColor: isActive ? 'var(--color-accent-100)' : 'transparent',
                        // color: isActive ? '#ffffff' : 'var(--color-primary-color)',
                        // fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                        // fontWeight: isActive ? '600' : '400',
                        // borderRadius: '0.5rem',
                        // cursor: 'pointer'
                      }}
                    >
                      <Icon 
                        style={{ 
                          fontSize: 'clamp(1.25rem, 2vw, 1.5rem)'
                        }} 
                      />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* User Profile at Bottom */}
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
