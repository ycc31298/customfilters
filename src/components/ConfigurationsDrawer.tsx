import React, { useState } from 'react';
import { Settings, ChevronUp, ChevronDown, Database, Users, FileText, Shield, Bell, Palette, Filter, Plus, MoreVertical, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ConfigurationsDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface CustomFilter {
  id: string;
  name: string;
  assignedGroups: string[];
  status: boolean;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export const ConfigurationsDrawer: React.FC<ConfigurationsDrawerProps> = ({ isOpen, onToggle }) => {
  const [activeSection, setActiveSection] = useState<string | null>('custom-filters');
  const [activeTab, setActiveTab] = useState<'people' | 'applicants' | 'templates'>('people');
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showConditionBuilder, setShowConditionBuilder] = useState(false);
  const [showTargetGroups, setShowTargetGroups] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [enableFilter, setEnableFilter] = useState(true);
  const [matchType, setMatchType] = useState<'any' | 'all'>('any');
  const [groupSearchTerm, setGroupSearchTerm] = useState('');

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
    },
    {
      id: 'custom-filters',
      title: 'Custom Filters',
      icon: Filter,
      items: []
    }
  ];

  const customFilters: Record<string, CustomFilter[]> = {
    people: [
      {
        id: '1',
        name: 'Best Run',
        assignedGroups: ['Employees', 'Global HR', 'BA Team +2'],
        status: true
      },
      {
        id: '2',
        name: 'Regular Employees Only',
        assignedGroups: ['Global HR'],
        status: true
      }
    ],
    applicants: [
      {
        id: '3',
        name: 'Senior Candidates',
        assignedGroups: ['Hiring Managers', 'HR Team'],
        status: true
      }
    ],
    templates: [
      {
        id: '4',
        name: 'Standard Templates',
        assignedGroups: ['Template Admins'],
        status: false
      }
    ]
  };

  const availableGroups = [
    'RD Team',
    'BA Team',
    'Global HR',
    'Finance Team',
    'Employees',
    'Hiring Managers',
    'HR Team',
    'Template Admins'
  ];

  const conditionFields = [
    'Department',
    'Title',
    'Location',
    'Status',
    'Hiring Date',
    'Manager',
    'Employee Type'
  ];

  const operators = [
    'equals',
    'not equals',
    'contains',
    'does not contain',
    'starts with',
    'ends with',
    'is empty',
    'is not empty'
  ];

  const filteredGroups = availableGroups.filter(group =>
    group.toLowerCase().includes(groupSearchTerm.toLowerCase())
  );

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const handleCreateFilter = () => {
    setShowCreatePanel(true);
  };

  const handleCloseCreatePanel = () => {
    setShowCreatePanel(false);
    setFilterName('');
    setConditions([]);
    setSelectedGroups([]);
    setEnableFilter(true);
  };

  const handleOpenConditionBuilder = () => {
    setShowConditionBuilder(true);
  };

  const handleCloseConditionBuilder = () => {
    setShowConditionBuilder(false);
  };

  const handleOpenTargetGroups = () => {
    setShowTargetGroups(true);
  };

  const handleCloseTargetGroups = () => {
    setShowTargetGroups(false);
  };

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: ''
    };
    setConditions([...conditions, newCondition]);
  };

  const handleRemoveCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const handleGroupToggle = (group: string) => {
    setSelectedGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const getTabTitle = () => {
    const tabNames = {
      people: 'People',
      applicants: 'Applicants',
      templates: 'Templates'
    };
    return `Create Custom Filter for ${tabNames[activeTab]}`;
  };

  return (
    <>
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

                {isActive && section.id === 'custom-filters' && (
                  <div className="px-4 pb-4">
                    {/* Custom Filters Tabs */}
                    <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setActiveTab('people')}
                        className={`px-3 py-2 text-xs rounded-md transition-colors ${
                          activeTab === 'people'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        PEOPLE
                      </button>
                      <button
                        onClick={() => setActiveTab('applicants')}
                        className={`px-3 py-2 text-xs rounded-md transition-colors ${
                          activeTab === 'applicants'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        APPLICANTS
                      </button>
                      <button
                        onClick={() => setActiveTab('templates')}
                        className={`px-3 py-2 text-xs rounded-md transition-colors ${
                          activeTab === 'templates'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        TEMPLATES
                      </button>
                    </div>

                    {/* Add Custom Filter Button */}
                    <button
                      onClick={handleCreateFilter}
                      className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors mb-4"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">CUSTOM FILTER</span>
                    </button>

                    {/* Filters List */}
                    <div className="space-y-2">
                      {customFilters[activeTab]?.map((filter) => (
                        <div key={filter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{filter.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {filter.assignedGroups.join(', ')}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${filter.status ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <MoreVertical className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isActive && section.id !== 'custom-filters' && (
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

      {/* Create Custom Filter Panel */}
      {showCreatePanel && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{getTabTitle()}</h2>
              <button
                onClick={handleCloseCreatePanel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Enter filter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions
                </label>
                <button
                  onClick={handleOpenConditionBuilder}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span>Set filter conditions</span>
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Target Groups */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Groups
                </label>
                <button
                  onClick={handleOpenTargetGroups}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span>
                    {selectedGroups.length > 0 
                      ? `${selectedGroups.length} group${selectedGroups.length > 1 ? 's' : ''} selected`
                      : 'Choose group of users'
                    }
                  </span>
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Enable Filter Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Enable Filter</span>
                <button
                  onClick={() => setEnableFilter(!enableFilter)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enableFilter ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enableFilter ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseCreatePanel}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                CANCEL
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                CREATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Condition Builder Modal */}
      {showConditionBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Set filter conditions</h2>
              <button
                onClick={handleCloseConditionBuilder}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-700">Match</span>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value as 'any' | 'all')}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="any">Any</option>
                    <option value="all">All</option>
                  </select>
                  <span className="text-sm text-gray-700">of the following conditions</span>
                </div>

                {/* Conditions */}
                <div className="space-y-3">
                  {conditions.map((condition) => (
                    <div key={condition.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <select
                        value={condition.field}
                        onChange={(e) => {
                          setConditions(conditions.map(c => 
                            c.id === condition.id ? { ...c, field: e.target.value } : c
                          ));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select Condition Field</option>
                        {conditionFields.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                      <select
                        value={condition.operator}
                        onChange={(e) => {
                          setConditions(conditions.map(c => 
                            c.id === condition.id ? { ...c, operator: e.target.value } : c
                          ));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        {operators.map(op => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => {
                          setConditions(conditions.map(c => 
                            c.id === condition.id ? { ...c, value: e.target.value } : c
                          ));
                        }}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => handleRemoveCondition(condition.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mt-4">
                  <button
                    onClick={handleAddCondition}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">CONDITION</span>
                  </button>
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">COPY CONDITION</span>
                  </button>
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">PASTE CONDITION</span>
                  </button>
                </div>

                <div className="mt-6">
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">CONDITION GROUP</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseConditionBuilder}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                CANCEL
              </button>
              <button
                onClick={handleCloseConditionBuilder}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Target Groups Modal */}
      {showTargetGroups && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Target Groups</h3>
                <button
                  onClick={handleCloseTargetGroups}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={groupSearchTerm}
                  onChange={(e) => setGroupSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {filteredGroups.map((group) => (
                  <label key={group} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group)}
                      onChange={() => handleGroupToggle(group)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-900">{group}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedGroups([])}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                CLEAR
              </button>
              <button
                onClick={handleCloseTargetGroups}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                SELECT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};