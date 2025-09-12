import React, { useState } from 'react';
import { Settings, ChevronUp, ChevronDown, Database, Users, FileText, Shield, Bell, Palette } from 'lucide-react';

interface ConfigurationsDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ConfigurationsDrawer: React.FC<ConfigurationsDrawerProps> = ({ isOpen, onToggle }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const configSections = [
    {
      id: 'system',
      title: 'System Settings',
      icon: Database,
      items: ['Database Configuration', 'API Settings', 'Cache Management', 'Backup Settings']
    },
    {
      id: 'users',
      title: 'User Management',
      icon: Users,
      items: ['User Roles', 'Permissions', 'Authentication', 'Access Control']
    },
    {
      id: 'documents',
      title: 'Document Templates',
      icon: FileText,
      items: ['Template Library', 'Custom Fields', 'Approval Workflows', 'Version Control']
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      icon: Shield,
      items: ['Data Encryption', 'Audit Logs', 'Compliance Rules', 'Privacy Settings']
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: ['Email Templates', 'Alert Rules', 'Delivery Settings', 'Escalation Policies']
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      items: ['Theme Settings', 'Branding', 'Layout Options', 'Color Schemes']
    }
  ];

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className={`fixed bottom-0 left-0 w-80 bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 z-40 ${
      isOpen ? 'transform translate-y-0' : 'transform translate-y-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Configurations</h3>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {configSections.map((section) => {
          const IconComponent = section.icon;
          const isActive = activeSection === section.id;

          return (
            <div key={section.id} className="border-b border-gray-100">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{section.title}</span>
                </div>
                {isActive ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {isActive && (
                <div className="px-4 pb-4">
                  <div className="space-y-2">
                    {section.items.map((item, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>System Status: Online</span>
          <span>Last Updated: 2 min ago</span>
        </div>
      </div>
    </div>
  );
};