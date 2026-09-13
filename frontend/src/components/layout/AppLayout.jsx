import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import LevelUpModal from '../ui/LevelUpModal';
import QuestCompleteToast from '../ui/QuestCompleteToast';
import QuestModal from '../quest/QuestModal';
import { useGame } from '../../hooks/useGame';

export default function AppLayout() {
  const {
    levelUpData,
    closeLevelUpModal,
    completionFeedback,
    clearCompletionFeedback,
    createQuest,
  } = useGame();

  const [isQuickQuestOpen, setIsQuickQuestOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F19] flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Navbar onOpenNewQuest={() => setIsQuickQuestOpen(true)} />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <MobileNav />
      </div>

      {/* Level Up Celebration Modal */}
      <LevelUpModal data={levelUpData} onClose={closeLevelUpModal} />

      {/* Quest Completion Toast Notification */}
      <QuestCompleteToast
        feedback={completionFeedback}
        onDismiss={clearCompletionFeedback}
      />

      {/* Quick Add Quest Modal */}
      <QuestModal
        isOpen={isQuickQuestOpen}
        onClose={() => setIsQuickQuestOpen(false)}
        onSubmit={createQuest}
      />
    </div>
  );
}
