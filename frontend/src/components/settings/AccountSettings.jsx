import React from 'react';
import EditUserInfo from '../profile/EditUserInfo';
import EmailSettings from './EmailSettings';
import ChangePassword from './ChangePassword';
import { useAuth } from '../../hooks/useAuth';

const AccountSettings = () => {
  const { userInfo } = useAuth();

  const email = userInfo?.message?.user_info?.email || null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
        <p className="text-sm text-text-secondary">Manage your account information</p>
      </div>

      <div className="divider"></div>

      {/* Profile Information Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <EditUserInfo userData={userInfo} />
        </div>

        <div className="space-y-3">
          <div className="flex flex-col">
            <span className="text-sm text-text-secondary">Username</span>
            <span className="text-base font-medium">{userInfo?.message?.user_info?.username || 'Not set'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-text-secondary">Program</span>
            <span className="text-base font-medium">{userInfo?.message?.user_info?.program || 'Not set'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-text-secondary">School</span>
            <span className="text-base font-medium">{userInfo?.message?.user_info?.school || 'Not set'}</span>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* Email Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Email Address</h3>
            <p className="text-sm text-text-secondary">
              {email ? email : 'No email linked to your account'}
            </p>
          </div>
          {!email && <EmailSettings />}
        </div>
      </div>

      <div className="divider"></div>

      {/* Password Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Password</h3>
            <p className="text-sm text-text-secondary">
              {email 
                ? 'Change your account password' 
                : 'Add an email first to change your password'}
            </p>
          </div>
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
