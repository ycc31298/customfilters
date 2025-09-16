import React, { useState } from 'react';
import { Settings, ChevronUp, ChevronDown, Filter, Plus, MoreVertical, Search, X } from 'lucide-react';

interface ConfigurationsDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenCustomFilters: () => void;
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

export const ConfigurationsDrawer: React.FC<ConfigurationsDrawerProps> = ({ isOpen, onToggle, onOpenCustomFilters }) => {

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
      <div className="p-4">
        <button
          onClick={onOpenCustomFilters}
          className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Custom Filters</span>
        </button>
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