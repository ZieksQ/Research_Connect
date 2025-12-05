import React, { useState } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import AccountSettings from './AccountSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <section className="page-margin lg:mx-auto lg:max-w-6xl">
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-base-200 rounded-lg p-4 h-fit">
          <h3 className="font-bold text-lg mb-4 px-2">Settings</h3>
          <ul className="menu p-0">
            <li>
              <button
                className={`flex items-center gap-3 ${activeTab === 'account' ? 'bg-custom-blue text-white hover:bg-blue-700' : 'hover:bg-blue-50 hover:text-custom-blue'}`}
                onClick={() => setActiveTab('account')}
              >
                <MdAccountCircle className="text-xl" />
                Account Settings
              </button>
            </li>
            {/* Add more menu items here as needed */}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-base-100 rounded-lg p-6 border border-base-200 shadow-sm">
          {activeTab === 'account' && <AccountSettings />}
          {/* Add more tab content here as needed */}
        </div>
      </div>
    </section>
  );
};

export default Settings;
