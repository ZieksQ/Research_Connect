import { useState } from 'react';
import Sidebar from '../../components/home/main/Sidebar';
// import MobileSidebar from '../../components/home/main/MobileSidebar';
import MainContent from '../../components/home/main/MainContent';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Sidebar activeTab={activeTab} onTabChange={setActiveTab}>
      <MainContent />
    </Sidebar>
  );
}