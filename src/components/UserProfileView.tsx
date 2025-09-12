import React from 'react';
import { ChevronLeft, Grid3X3, RefreshCw } from 'lucide-react';

interface UserProfileViewProps {
  user: any;
  onBack: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ user, onBack }) => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-6 text-white relative">
        <button
          onClick={onBack}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/20">
              <span className="text-white text-xl font-medium">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex items-center space-x-6 mt-2 text-blue-100">
              <div className="flex items-center space-x-1">
                <span className="text-sm">👤 Username</span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm">📧 Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm">⏰ Last Login</span>
                <span className="font-medium">09/08/2025, 6:10 PM</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm">📅 Created</span>
                <span className="font-medium">11/06/2024, 5:36 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
            FILES
          </button>
          <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
            PROPERTIES
          </button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
            POLICIES
          </button>
          <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
            GROUPS
          </button>
        </nav>
      </div>

      {/* Properties Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="w-4 h-4 text-gray-400" />
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex">
            <div className="w-48 text-sm font-medium text-gray-900">Country</div>
            <div className="text-sm text-gray-600">{user.country || 'United States'}</div>
          </div>

          <div className="flex">
            <div className="w-48 text-sm font-medium text-gray-900">Department</div>
            <div className="text-sm text-gray-600">
              {user.department || 'Global Human Resources (50007726)'}
            </div>
          </div>

          <div className="flex">
            <div className="w-48 text-sm font-medium text-gray-900">Employee Title</div>
            <div className="text-sm text-gray-600">{user.title || 'Administrative Support'}</div>
          </div>

          <div className="flex">
            <div className="w-48 text-sm font-medium text-gray-900">Hiring Date</div>
            <div className="text-sm text-gray-600">{user.hiringDate || '06/01/2000'}</div>
          </div>

          <div className="flex">
            <div className="w-48 text-sm font-medium text-gray-900">Is the user a manager</div>
            <div className="text-sm text-gray-600">{user.isManager ? 'True' : 'False'}</div>
          </div>

          <div className="flex">
            <div className="w-48 text-sm font-medium text-gray-900">User ID</div>
            <div className="text-sm text-gray-600">{user.username}</div>
          </div>

          <div className="flex">
            <div className="w-48 text-sm font-medium text-gray-900">Manager ID</div>
            <div className="text-sm text-gray-600 text-blue-600 underline cursor-pointer">108743</div>
          </div>

          <div className="flex">
            <div className="w-48 text-sm font-medium text-gray-900">Number of Team Me...</div>
            <div className="text-sm text-gray-600">37</div>
          </div>
        </div>
      </div>
    </div>
  );
};