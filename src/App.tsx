import React from 'react';
import { useState } from 'react';
import { Users, Briefcase, FileText, Settings, Plus } from 'lucide-react';
import { WorkforceView } from './components/WorkforceView';
import { JobApplicationsView } from './components/JobApplicationsView';
import { GeneratedDocsView } from './components/GeneratedDocsView';
import { GenerateModal } from './components/GenerateModal';
import { ProgressModal } from './components/ProgressModal';
import { ConfigurationsDrawer } from './components/ConfigurationsDrawer';

function App() {
  const [activeTab, setActiveTab] = useState<'workforce' | 'applications' | 'generated'>('workforce');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  const handleGenerate = () => {
    setShowGenerateModal(false);
    setShowProgressModal(true);
  };

  const handleProgressComplete = () => {
    setShowProgressModal(false);
    setActiveTab('generated');
  };

  const tabs = [
    { id: 'workforce', label: 'Workforce', icon: Users },
    { id: 'applications', label: 'Job Applications', icon: Briefcase },
    { id: 'generated', label: 'Generated Docs/Processes', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">People Hub</h1>
          <p className="text-sm text-gray-600 mt-1">Unified workforce management</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Configurations Button - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              showConfigDrawer
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Configurations</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'workforce' && <WorkforceView onGenerate={() => setShowGenerateModal(true)} />}
        {activeTab === 'applications' && <JobApplicationsView onGenerate={() => setShowGenerateModal(true)} />}
        {activeTab === 'generated' && <GeneratedDocsView />}
      </div>

      {/* Modals */}
      {showGenerateModal && (
        <GenerateModal
          onClose={() => setShowGenerateModal(false)}
          onConfirm={handleGenerate}
        />
      )}

      {showProgressModal && (
        <ProgressModal
          onClose={() => setShowProgressModal(false)}
          onViewGeneratedItems={handleProgressComplete}
        />
      )}

      {/* Configurations Drawer */}
      <ConfigurationsDrawer
        isOpen={showConfigDrawer}
        onToggle={() => setShowConfigDrawer(!showConfigDrawer)}
      />
    </div>
  );
}

export default App;
