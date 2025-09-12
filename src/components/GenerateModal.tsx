import React, { useState } from 'react';
import { X, Search, ChevronDown, ChevronRight, FileText, Users } from 'lucide-react';

interface GenerateModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const GenerateModal: React.FC<GenerateModalProps> = ({ onClose, onConfirm }) => {
  const [currentStep, setCurrentStep] = useState<'select' | 'summary'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'documents' | 'processes'>('documents');
  const [selectedItems, setSelectedItems] = useState<string[]>(['Certificate of Employment']);
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const documents = [
    'Annual Performance Review',
    'Certificate of Employment',
    'Exit Documents',
    'Form',
    'Leave Form',
    'Offer Letter Template',
    'Reference Check Form',
    'Employee Handbook',
    'Non-Disclosure Agreement',
    'Work Authorization'
  ];

  const processes = [
    'Onboarding Workflow',
    'Performance Review Process',
    'Exit Interview Process',
    'Training Enrollment',
    'Benefits Setup',
    'Equipment Assignment',
    'Security Access Setup',
    'Compliance Training',
    'Background Check Process',
    'Reference Verification'
  ];

  const currentItems = selectedTab === 'documents' ? documents : processes;
  const filteredItems = currentItems.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemToggle = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleNext = () => {
    if (currentStep === 'select') {
      setCurrentStep('summary');
    } else {
      onConfirm();
    }
  };

  const handleBack = () => {
    if (currentStep === 'summary') {
      setCurrentStep('select');
    }
  };

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  if (currentStep === 'summary') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Configure Template Parameters</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4 text-sm text-gray-600">{selectedItems.length} items selected</div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {selectedTab === 'documents' ? (
                          <FileText className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Users className="w-4 h-4 text-green-500" />
                        )}
                        <span className="font-medium text-gray-900">{item}</span>
                      </div>
                      <button
                        onClick={() => toggleExpanded(item)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedItems.includes(item) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {expandedItems.includes(item) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Template Version
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                              <option>Latest (v2.1)</option>
                              <option>v2.0</option>
                              <option>v1.9</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Language
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                              <option>English</option>
                              <option>Spanish</option>
                              <option>French</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Format
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                              <option>PDF</option>
                              <option>Word Document</option>
                              <option>HTML</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Priority
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                              <option>Normal</option>
                              <option>High</option>
                              <option>Urgent</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              BACK
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              GENERATE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Select Documents / Processes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400">‹</button>
              <button className="text-gray-400">›</button>
              <button className="text-gray-400">🔄</button>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-sm text-gray-600">
              {selectedTab === 'documents' ? 'Documents' : 'Processes'}: {filteredItems.length} {selectedItems.length > 0 && `${selectedItems.length} Selected`}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('documents')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              DOCUMENTS
            </button>
            <button
              onClick={() => setSelectedTab('processes')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'processes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              PROCESSES
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                onChange={() => {}}
              />
              <span className="text-sm font-medium text-gray-700">Name ▼</span>
            </div>

            {filteredItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 py-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => handleItemToggle(item)}
                  className="rounded border-gray-300"
                />
                <div className="flex items-center space-x-2">
                  {selectedTab === 'documents' ? (
                    <FileText className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Users className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-sm text-gray-900">{item}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Details */}
          <div className="mt-6">
            <button
              onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <span className="text-sm font-medium">ADDITIONAL DETAILS</span>
              {showAdditionalDetails ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {showAdditionalDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Enter any additional requirements or notes..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Rows per page: 10 ▼
          </div>
          <button
            onClick={handleNext}
            disabled={selectedItems.length === 0}
            className={`px-6 py-2 rounded-lg font-medium ${
              selectedItems.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            GENERATE
          </button>
        </div>
      </div>
    </div>
  );
};