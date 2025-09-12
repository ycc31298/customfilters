import React, { useState } from 'react';
import { Search, Filter, Users, Building2, Mail, Phone, MapPin, Calendar, Eye, Plus } from 'lucide-react';
import { UserProfileView } from './UserProfileView';

interface WorkforceViewProps {
  onGenerate: () => void;
}

export const WorkforceView: React.FC<WorkforceViewProps> = ({ onGenerate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'employees' | 'external'>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const workforceData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      username: 'sjohnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      type: 'employee',
      status: 'Active',
      hiringDate: '03/15/2022',
      isManager: true,
      country: 'United States',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 2,
      name: 'Michael Chen',
      username: 'mchen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Product Management',
      title: 'Product Manager',
      location: 'New York, NY',
      type: 'employee',
      status: 'Active',
      hiringDate: '07/22/2021',
      isManager: false,
      country: 'United States',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      username: 'erodriguez',
      email: 'emily.rodriguez@contractor.com',
      phone: '+1 (555) 345-6789',
      department: 'Design',
      title: 'UX Designer',
      location: 'Austin, TX',
      type: 'external',
      status: 'Active',
      hiringDate: '01/10/2023',
      isManager: false,
      country: 'United States',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 4,
      name: 'David Kim',
      username: 'dkim',
      email: 'david.kim@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Marketing',
      title: 'Marketing Director',
      location: 'Los Angeles, CA',
      type: 'employee',
      status: 'Active',
      hiringDate: '11/05/2020',
      isManager: true,
      country: 'United States',
      avatar: null
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      username: 'lthompson',
      email: 'lisa.thompson@freelance.com',
      phone: '+1 (555) 567-8901',
      department: 'Content',
      title: 'Content Writer',
      location: 'Seattle, WA',
      type: 'external',
      status: 'Inactive',
      hiringDate: '09/12/2022',
      isManager: false,
      country: 'United States',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    // Add more sample data
    ...Array.from({ length: 45 }, (_, i) => ({
      id: i + 6,
      name: `Employee ${i + 6}`,
      username: `emp${i + 6}`,
      email: `employee${i + 6}@company.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][i % 5],
      title: ['Software Engineer', 'Marketing Specialist', 'Sales Rep', 'HR Coordinator', 'Financial Analyst'][i % 5],
      location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Los Angeles, CA', 'Seattle, WA'][i % 5],
      type: i % 3 === 0 ? 'external' : 'employee',
      status: i % 7 === 0 ? 'Inactive' : 'Active',
      hiringDate: `0${(i % 9) + 1}/15/202${i % 3 + 1}`,
      isManager: i % 8 === 0,
      country: 'United States',
      avatar: i % 4 === 0 ? `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2` : null
    }))
  ];

  const filteredData = workforceData.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'employees' && person.type === 'employee') ||
                         (activeFilter === 'external' && person.type === 'external');
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (selectedUser) {
    return <UserProfileView user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search workforce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-4">
          <button
            onClick={onGenerate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate
          </button>
          <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            activeFilter === 'all'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ALL ({workforceData.length})
        </button>
        <button
          onClick={() => setActiveFilter('employees')}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            activeFilter === 'employees'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          EMPLOYEES ({workforceData.filter(p => p.type === 'employee').length})
        </button>
        <button
          onClick={() => setActiveFilter('external')}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            activeFilter === 'external'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          EXTERNAL USERS ({workforceData.filter(p => p.type === 'external').length})
        </button>
      </div>

      {/* Workforce Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 font-medium text-gray-900">Name</th>
              <th className="text-left py-4 px-6 font-medium text-gray-900">Contact</th>
              <th className="text-left py-4 px-6 font-medium text-gray-900">Department</th>
              <th className="text-left py-4 px-6 font-medium text-gray-900">Title</th>
              <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
              <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((person, index) => (
              <tr 
                key={person.id} 
                className={`hover:bg-gray-50 cursor-pointer ${
                  index < filteredData.length - 1 ? 'border-b border-gray-100' : ''
                }`}
                onClick={() => setSelectedUser(person)}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    {person.avatar ? (
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getInitials(person.name)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{person.name}</div>
                      <div className="text-sm text-gray-500">@{person.username}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-3 h-3 mr-2" />
                      {person.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-3 h-3 mr-2" />
                      {person.phone}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    {person.department}
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {person.title}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    person.type === 'employee' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {person.type === 'employee' ? 'Employee' : 'External'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(person.status)}`}>
                    {person.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <span>Rows per page: 10 ▼</span>
          <span>1-{Math.min(10, filteredData.length)} of {filteredData.length}</span>
          <div className="flex items-center space-x-2">
            <button className="text-gray-400">‹</button>
            <button className="text-gray-400">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};