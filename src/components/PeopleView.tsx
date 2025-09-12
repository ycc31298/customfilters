import React, { useState } from 'react';
import { Search, Filter, RefreshCw, ChevronDown, ChevronRight, X, SlidersHorizontal } from 'lucide-react';

interface PeopleViewProps {
  onUserClick: (user: any) => void;
  onGenerate: () => void;
}

export const PeopleView: React.FC<PeopleViewProps> = ({ onUserClick, onGenerate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'requisition'>('none');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [expandedCandidates, setExpandedCandidates] = useState<string[]>([]);
  const [customFilter, setCustomFilter] = useState<string>('all-records');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showCustomFilters, setShowCustomFilters] = useState(false);
  const [showAllStatusChips, setShowAllStatusChips] = useState(false);

  // Combined dataset with employees, external users, and job applications
  const allUsers = [
    // Employees
    {
      id: 1,
      name: 'Aanya Singh',
      username: 'sfadmin',
      email: 'test@stratohcm.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      userType: 'Employee',
      department: 'Global Human Resources',
      title: 'Administrative Support',
      country: 'United States',
      location: 'New York, NY',
      businessUnit: 'Corporate',
      hiringDate: '06/01/2000',
      isManager: true,
      status: 'Active',
      hiringManager: 'John Smith'
    },
    {
      id: 2,
      name: 'Aaron Chan',
      username: 'ChanA',
      email: 'aaron.chan@bestrunsap.com',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      userType: 'Employee',
      department: 'Marketing',
      title: 'Marketing Manager',
      country: 'United States',
      location: 'San Francisco, CA',
      businessUnit: 'Marketing',
      hiringDate: '08/22/2019',
      isManager: true,
      status: 'Active',
      hiringManager: 'Sarah Wilson'
    },
    // External Users
    {
      id: 3,
      name: 'Maria Gonzalez',
      username: 'mgonzalez.ext',
      email: 'maria.gonzalez@contractor.com',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      userType: 'External User',
      department: 'Engineering',
      title: 'Contract Developer',
      country: 'Mexico',
      location: 'Mexico City',
      businessUnit: 'Technology',
      contractStart: '01/15/2024',
      contractEnd: '12/31/2024',
      status: 'Active',
      hiringManager: 'Mike Johnson'
    },
    {
      id: 4,
      name: 'James Wilson',
      username: 'jwilson.ext',
      email: 'james.wilson@vendor.com',
      avatar: null,
      userType: 'External User',
      department: 'IT Services',
      title: 'Technical Consultant',
      country: 'United Kingdom',
      location: 'London',
      businessUnit: 'Technology',
      contractStart: '03/01/2024',
      contractEnd: '08/31/2024',
      status: 'Inactive',
      hiringManager: 'Alice Brown'
    },
    // Job Applications with specific requisition statuses
    {
      id: 5,
      name: 'Anna Reyes',
      email: 'anna.reyes@email.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      userType: 'Job Application',
      requisition: { id: 'REQ-1001', title: 'Software Engineer', location: 'Philippines' },
      applicationStatus: 'Interview',
      country: 'Philippines',
      location: 'Manila',
      businessUnit: 'Technology',
      department: 'Engineering',
      hiringManager: 'John Smith',
      recruiter: 'Alice Brown',
      source: 'LinkedIn',
      dateApplied: '2024-01-15'
    },
    {
      id: 6,
      name: 'Anna Reyes',
      email: 'anna.reyes@email.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      userType: 'Job Application',
      requisition: { id: 'REQ-1002', title: 'Product Manager', location: 'Singapore' },
      applicationStatus: 'Assessment',
      country: 'Singapore',
      location: 'Singapore',
      businessUnit: 'Product',
      department: 'Product Management',
      hiringManager: 'Sarah Wilson',
      recruiter: 'Bob Davis',
      source: 'LinkedIn',
      dateApplied: '2024-01-20'
    },
    {
      id: 7,
      name: 'James Tan',
      email: 'james.tan@email.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      userType: 'Job Application',
      requisition: { id: 'REQ-1003', title: 'Sales Executive', location: 'US' },
      applicationStatus: 'Offer',
      country: 'United States',
      location: 'New York, NY',
      businessUnit: 'Sales',
      department: 'Sales',
      hiringManager: 'Mike Johnson',
      recruiter: 'Charlie Green',
      source: 'Indeed',
      dateApplied: '2024-01-12'
    },
    {
      id: 8,
      name: 'Maria Lopez',
      email: 'maria.lopez@email.com',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      userType: 'Job Application',
      requisition: { id: 'REQ-1004', title: 'HR Specialist', location: 'Germany' },
      applicationStatus: 'New',
      country: 'Germany',
      location: 'Berlin',
      businessUnit: 'Corporate',
      department: 'Human Resources',
      hiringManager: 'Alice Brown',
      recruiter: 'David Lee',
      source: 'Company Website',
      dateApplied: '2024-02-01'
    },
    {
      id: 9,
      name: 'Raj Patel',
      email: 'raj.patel@email.com',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2',
      userType: 'Job Application',
      requisition: { id: 'REQ-1005', title: 'QA Analyst', location: 'India' },
      applicationStatus: 'Technical Interview',
      country: 'India',
      location: 'Bangalore',
      businessUnit: 'Technology',
      department: 'Quality Assurance',
      hiringManager: 'John Smith',
      recruiter: 'Alice Brown',
      source: 'Referral',
      dateApplied: '2024-01-28'
    },
    // Generate more job applications to reach 200+ entries
    ...Array.from({ length: 195 }, (_, i) => {
      const candidateNames = [
        'Sofia Rodriguez', 'Michael Chen', 'Emma Johnson', 'David Kim', 'Isabella Garcia',
        'Alexander Wang', 'Olivia Martinez', 'Daniel Lee', 'Ava Thompson', 'Lucas Brown',
        'Mia Davis', 'Ethan Wilson', 'Charlotte Miller', 'Noah Anderson', 'Amelia Taylor',
        'William Thomas', 'Harper Jackson', 'James White', 'Evelyn Harris', 'Benjamin Martin',
        'Abigail Thompson', 'Henry Garcia', 'Emily Rodriguez', 'Sebastian Martinez',
        'Madison Lewis', 'Jack Robinson', 'Elizabeth Clark', 'Owen Rodriguez', 'Sofia Walker',
        'Luke Hall', 'Avery Allen', 'Gabriel Young', 'Ella Hernandez', 'Carter King',
        'Scarlett Wright', 'Jayden Lopez', 'Grace Hill', 'Leo Scott', 'Chloe Green',
        'Julian Adams', 'Lily Baker', 'Mateo Gonzalez', 'Zoey Nelson', 'Levi Carter',
        'Natalie Mitchell', 'Asher Perez', 'Hannah Roberts', 'Caleb Turner', 'Addison Phillips'
      ];
      
      const requisitions = [
        { id: 'REQ-1001', title: 'Software Engineer', location: 'Philippines' },
        { id: 'REQ-1002', title: 'Product Manager', location: 'Singapore' },
        { id: 'REQ-1003', title: 'Sales Executive', location: 'US' },
        { id: 'REQ-1004', title: 'HR Specialist', location: 'Germany' },
        { id: 'REQ-1005', title: 'QA Analyst', location: 'India' }
      ];

      // Define specific statuses for each requisition
      const requisitionStatuses = {
        'REQ-1001': ['New', 'Screening', 'Interview', 'Offer', 'Hired'],
        'REQ-1002': ['New', 'Assessment', 'Interview', 'Background Check', 'Approval', 'Offer', 'Hired'],
        'REQ-1003': ['New', 'Screening', 'Interview', 'Offer', 'Rejected'],
        'REQ-1004': ['New', 'Screening', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Hired'],
        'REQ-1005': ['New', 'Technical Interview', 'HR Interview', 'Offer', 'Hired']
      };
      
      const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Australia', 'Netherlands', 'Sweden', 'Singapore', 'Philippines', 'India'];
      const locations = [
        'New York, NY', 'San Francisco, CA', 'Toronto, ON', 'London', 'Berlin', 'Paris', 
        'Madrid', 'Sydney', 'Amsterdam', 'Stockholm', 'Singapore', 'Los Angeles, CA',
        'Chicago, IL', 'Boston, MA', 'Seattle, WA', 'Austin, TX', 'Vancouver, BC', 'Manila', 'Bangalore'
      ];
      const hiringManagers = ['John Smith', 'Sarah Wilson', 'Mike Johnson', 'Alice Brown', 'Bob Davis', 'Charlie Green', 'David Lee', 'Emma White'];
      const recruiters = ['Alice Brown', 'Bob Davis', 'Charlie Green', 'David Lee', 'Emma White', 'Frank Miller', 'Grace Taylor'];
      const sources = ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Glassdoor', 'AngelList', 'Stack Overflow'];
      
      const candidateName = candidateNames[i % candidateNames.length];
      const requisition = requisitions[i % requisitions.length];
      const userType = i < 20 ? (i % 3 === 0 ? 'Employee' : 'External User') : 'Job Application';
      
      if (userType === 'Employee') {
        return {
          id: i + 10,
          name: candidateName,
          username: `user${i + 10}`,
          email: `${candidateName.toLowerCase().replace(' ', '.')}@company.com`,
          avatar: i % 4 === 0 ? `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2` : null,
          userType,
          department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'][i % 6],
          title: ['Software Engineer', 'Marketing Manager', 'Sales Rep', 'HR Specialist'][i % 4],
          country: countries[i % countries.length],
          location: locations[i % locations.length],
          businessUnit: ['Technology', 'Marketing', 'Sales', 'Corporate'][i % 4],
          hiringDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-15`,
          isManager: i % 5 === 0,
          status: i % 4 === 0 ? 'Inactive' : 'Active',
          hiringManager: hiringManagers[i % hiringManagers.length]
        };
      } else if (userType === 'External User') {
        return {
          id: i + 10,
          name: candidateName,
          username: `${candidateName.toLowerCase().replace(' ', '.')}.ext`,
          email: `${candidateName.toLowerCase().replace(' ', '.')}@contractor.com`,
          avatar: i % 4 === 0 ? `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2` : null,
          userType,
          department: ['Engineering', 'IT Services', 'Consulting', 'Design'][i % 4],
          title: ['Contractor', 'Consultant', 'Vendor', 'Freelancer'][i % 4],
          country: countries[i % countries.length],
          location: locations[i % locations.length],
          businessUnit: ['Technology', 'Operations', 'Consulting'][i % 3],
          contractStart: '2024-01-01',
          contractEnd: '2024-12-31',
          status: i % 4 === 0 ? 'Inactive' : 'Active',
          hiringManager: hiringManagers[i % hiringManagers.length]
        };
      } else {
        const reqId = requisition.id as keyof typeof requisitionStatuses;
        const availableStatuses = requisitionStatuses[reqId];
        const applicationStatus = availableStatuses[i % availableStatuses.length];
        
        return {
          id: i + 10,
          name: candidateName,
          email: `${candidateName.toLowerCase().replace(' ', '.')}@email.com`,
          avatar: i % 4 === 0 ? `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2` : null,
          userType,
          requisition,
          applicationStatus,
          country: countries[i % countries.length],
          location: locations[i % locations.length],
          businessUnit: requisition.title.includes('Engineer') || requisition.title.includes('Developer') || requisition.title.includes('QA') || requisition.title.includes('DevOps') ? 'Technology' : 
                       requisition.title.includes('Sales') ? 'Sales' :
                       requisition.title.includes('Marketing') ? 'Marketing' :
                       requisition.title.includes('Product') ? 'Product' : 'Corporate',
          department: requisition.title.includes('Engineer') || requisition.title.includes('Developer') ? 'Engineering' :
                     requisition.title.includes('QA') ? 'Quality Assurance' :
                     requisition.title.includes('Sales') ? 'Sales' :
                     requisition.title.includes('Marketing') ? 'Marketing' :
                     requisition.title.includes('Product') ? 'Product Management' :
                     requisition.title.includes('HR') ? 'Human Resources' :
                     requisition.title.includes('DevOps') ? 'Operations' : 'General',
          hiringManager: hiringManagers[i % hiringManagers.length],
          recruiter: recruiters[i % recruiters.length],
          source: sources[i % sources.length],
          dateApplied: `2024-${String(((i % 11) + 1)).padStart(2, '0')}-${String(((i % 28) + 1)).padStart(2, '0')}`
        };
      }
    })
  ];

  // Custom filter definitions
  const customFilters = {
    'all-records': { name: 'All Records', conditions: {} },
    'my-candidates': { 
      name: 'My Candidates', 
      conditions: { userType: ['Job Application'], hiringManager: ['John Smith'] }
    },
    'open-applications': { 
      name: 'Open Applications', 
      conditions: { userType: ['Job Application'], status: ['New', 'Screening', 'Interview', 'Assessment'] }
    },
    'high-priority-reqs': { 
      name: 'High Priority Reqs', 
      conditions: { requisition: ['REQ-1001', 'REQ-1002', 'REQ-1003'] }
    },
    'active-interviews': { 
      name: 'Active Interviews', 
      conditions: { status: ['Interview', 'Assessment'] }
    }
  };

  // Apply custom filter
  const applyCustomFilter = (users: typeof allUsers) => {
    const filter = customFilters[customFilter as keyof typeof customFilters];
    if (!filter || customFilter === 'all-records') return users;

    return users.filter(user => {
      return Object.entries(filter.conditions).every(([key, values]) => {
        if (key === 'userType') return values.includes(user.userType);
        if (key === 'hiringManager') return values.includes(user.hiringManager);
        if (key === 'status' && user.userType === 'Job Application') {
          return values.includes(user.applicationStatus);
        }
        if (key === 'status' && (user.userType === 'Employee' || user.userType === 'External User')) {
          return values.includes(user.status);
        }
        if (key === 'requisition' && user.userType === 'Job Application') {
          return user.requisition && values.includes(user.requisition.id);
        }
        return true;
      });
    });
  };

  // Filter users based on search and status (AND logic for multiple statuses)
  const filteredUsers = applyCustomFilter(allUsers).filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.userType === 'Job Application' && user.requisition && 
                          (user.requisition.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.requisition.title.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus = selectedStatuses.length === 0 || 
                         selectedStatuses.every(status => {
                           if (user.userType === 'Job Application') {
                             return user.applicationStatus === status;
                           } else {
                             return user.status === status;
                           }
                         });

    return matchesSearch && matchesStatus;
  });

  // Get all unique statuses for chips
  const getAllStatuses = () => {
    const baseUsers = applyCustomFilter(allUsers);
    const statuses = new Set<string>();
    
    baseUsers.forEach(user => {
      if (user.userType === 'Job Application') {
        statuses.add(user.applicationStatus);
      } else {
        statuses.add(user.status);
      }
    });

    return Array.from(statuses);
  };

  // Get status counts
  const getStatusCounts = () => {
    const baseUsers = applyCustomFilter(allUsers);
    const counts: { [key: string]: number } = {};
    
    baseUsers.forEach(user => {
      const status = user.userType === 'Job Application' ? user.applicationStatus : user.status;
      counts[status] = (counts[status] || 0) + 1;
    });

    return counts;
  };

  // Get statuses for a specific requisition
  const getRequisitionStatuses = (reqId: string) => {
    const baseUsers = applyCustomFilter(allUsers);
    const counts: { [key: string]: number } = {};
    
    baseUsers
      .filter(user => user.userType === 'Job Application' && user.requisition?.id === reqId)
      .forEach(user => {
        counts[user.applicationStatus] = (counts[user.applicationStatus] || 0) + 1;
      });

    return counts;
  };

  // Group candidates by name for flat view
  const groupCandidatesByName = () => {
    const candidateGroups: { [key: string]: typeof filteredUsers } = {};
    
    filteredUsers.forEach(user => {
      if (user.userType === 'Job Application') {
        if (!candidateGroups[user.name]) {
          candidateGroups[user.name] = [];
        }
        candidateGroups[user.name].push(user);
      } else {
        // For employees and external users, treat each as individual
        candidateGroups[`${user.name}_${user.id}`] = [user];
      }
    });

    return candidateGroups;
  };

  // Group users
  const groupedUsers = () => {
    if (groupBy === 'none') {
      return groupCandidatesByName();
    }

    const groups: { [key: string]: typeof filteredUsers } = {};
    filteredUsers.forEach(user => {
      let groupKey = '';
      if (groupBy === 'requisition') {
        groupKey = user.userType === 'Job Application' && user.requisition 
          ? `${user.requisition.id} - ${user.requisition.title} (${user.requisition.location})`
          : 'No Requisition';
      }
      
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(user);
    });

    return groups;
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupKey)
        ? prev.filter(g => g !== groupKey)
        : [...prev, groupKey]
    );
  };

  const toggleCandidate = (candidateName: string) => {
    setExpandedCandidates(prev =>
      prev.includes(candidateName)
        ? prev.filter(c => c !== candidateName)
        : [...prev, candidateName]
    );
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const getUserTypeBadgeColor = (userType: string) => {
    switch (userType) {
      case 'Employee': return 'border-blue-500';
      case 'External User': return 'border-orange-500';
      case 'Job Application': return 'border-green-500';
      default: return 'border-gray-400';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'Employee': return '👤';
      case 'External User': return '🔗';
      case 'Job Application': return '📋';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Screening': return 'bg-yellow-100 text-yellow-800';
      case 'Interview': return 'bg-orange-100 text-orange-800';
      case 'Technical Interview': return 'bg-orange-100 text-orange-800';
      case 'HR Interview': return 'bg-orange-100 text-orange-800';
      case 'Assessment': return 'bg-purple-100 text-purple-800';
      case 'Background Check': return 'bg-indigo-100 text-indigo-800';
      case 'Approval': return 'bg-teal-100 text-teal-800';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Hired': return 'bg-emerald-100 text-emerald-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const groupOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'requisition', label: 'Requisition' }
  ];

  const statusCounts = getStatusCounts();
  const allStatuses = getAllStatuses();

  // Handle status chip display logic
  const maxVisibleChips = 8;
  const visibleStatuses = showAllStatusChips ? allStatuses : allStatuses.slice(0, maxVisibleChips);
  const hiddenCount = allStatuses.length - maxVisibleChips;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Custom Filters Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCustomFilters(!showCustomFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-sm">{customFilters[customFilter as keyof typeof customFilters].name}</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {showCustomFilters && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {Object.entries(customFilters).map(([key, filter]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCustomFilter(key);
                      setShowCustomFilters(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      customFilter === key ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Search */}
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <span className="text-sm">Advanced Search</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={onGenerate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate
          </button>
          <RefreshCw className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
        </div>
      </div>

      {/* Grouping Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Group by:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {groupOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setGroupBy(option.value as any)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  groupBy === option.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Chips for Flat List View */}
      {groupBy === 'none' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {visibleStatuses.map((status) => (
              <button
                key={status}
                onClick={() => toggleStatusFilter(status)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedStatuses.includes(status)
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {status} ({statusCounts[status] || 0})
              </button>
            ))}
            
            {!showAllStatusChips && hiddenCount > 0 && (
              <button
                onClick={() => setShowAllStatusChips(true)}
                className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-300 hover:border-gray-400"
              >
                +{hiddenCount} More
              </button>
            )}
            
            {showAllStatusChips && hiddenCount > 0 && (
              <button
                onClick={() => setShowAllStatusChips(false)}
                className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-300 hover:border-gray-400"
              >
                Show Less
              </button>
            )}
          </div>
        </div>
      )}

      {/* Advanced Search Drawer */}
      {showAdvancedSearch && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Advanced Search</h3>
            <button
              onClick={() => setShowAdvancedSearch(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">All Countries</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Unit</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">All Business Units</option>
                <option value="Technology">Technology</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">All Hiring Managers</option>
                <option value="John Smith">John Smith</option>
                <option value="Sarah Wilson">Sarah Wilson</option>
                <option value="Mike Johnson">Mike Johnson</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* People Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {Object.entries(groupedUsers()).map(([groupKey, groupUsers]) => (
          <div key={groupKey}>
            {groupBy === 'requisition' && groupKey !== 'All People' && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div
                  className="cursor-pointer hover:bg-gray-100 -mx-2 px-2 py-1 rounded"
                  onClick={() => toggleGroup(groupKey)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {expandedGroups.includes(groupKey) ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="font-medium text-gray-900">{groupKey}</span>
                      <span className="text-sm text-gray-500">({groupUsers.length})</span>
                    </div>
                  </div>
                </div>

                {/* Status Cards for Requisition */}
                {expandedGroups.includes(groupKey) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(getRequisitionStatuses(groupKey.split(' - ')[0])).map(([status, count]) => (
                      <button
                        key={status}
                        onClick={() => toggleStatusFilter(status)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                          selectedStatuses.includes(status)
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {status} ({count})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(groupBy === 'requisition' ? expandedGroups.includes(groupKey) : true) && (
              <div>
                {groupBy === 'requisition' && (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-medium text-gray-900 w-12">
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.length === groupUsers.length && groupUsers.length > 0}
                            onChange={() => {
                              const allSelected = selectedUsers.length === groupUsers.length;
                              if (allSelected) {
                                setSelectedUsers(prev => prev.filter(id => !groupUsers.map(u => u.id).includes(id)));
                              } else {
                                setSelectedUsers(prev => [...new Set([...prev, ...groupUsers.map(u => u.id)])]);
                              }
                            }}
                            className="rounded border-gray-300" 
                          />
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Name</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Profile Type</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Email</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Department</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Location</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Requisition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupUsers.map((user, index) => (
                        <tr 
                          key={user.id} 
                          className={`hover:bg-gray-50 cursor-pointer ${
                            index < groupUsers.length - 1 ? 'border-b border-gray-100' : ''
                          }`}
                          onClick={() => onUserClick(user)}
                        >
                          <td className="py-4 px-6">
                            <input 
                              type="checkbox" 
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded border-gray-300" 
                            />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className={`w-8 h-8 rounded-full object-cover border-2 ${getUserTypeBadgeColor(user.userType)}`}
                                  />
                                ) : (
                                  <div className={`w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center border-2 ${getUserTypeBadgeColor(user.userType)}`}>
                                    <span className="text-white text-xs font-medium">
                                      {getInitials(user.name)}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs border border-gray-200">
                                  {getUserTypeIcon(user.userType)}
                                </div>
                              </div>
                              <span className="font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.userType === 'Employee' ? 'bg-blue-100 text-blue-800' :
                              user.userType === 'External User' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.userType}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {user.email}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              getStatusColor(user.userType === 'Job Application' ? user.applicationStatus : user.status)
                            }`}>
                              {user.userType === 'Job Application' ? user.applicationStatus : user.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {user.department || '-'}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            <div>
                              <span>{user.location || '-'}</span>
                              {user.country && (
                                <div className="text-sm text-gray-500">{user.country}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {user.userType === 'Job Application' && user.requisition ? (
                              <div>
                                <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                  {user.requisition.id}
                                </span>
                                <div className="text-sm text-gray-500">{user.requisition.title}</div>
                              </div>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {groupBy === 'none' && (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-medium text-gray-900 w-12">
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300" 
                          />
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Name</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Profile Type</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Email</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Department</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Location</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Requisition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupedUsers()).map(([candidateName, applications]) => {
                        const primaryApp = applications[0];
                        const hasMultipleApps = applications.length > 1;
                        const isExpanded = expandedCandidates.includes(candidateName);

                        return (
                          <React.Fragment key={candidateName}>
                            {/* Primary row */}
                            <tr className="hover:bg-gray-50 border-b border-gray-100">
                              <td className="py-4 px-6">
                                <input 
                                  type="checkbox" 
                                  checked={selectedUsers.includes(primaryApp.id)}
                                  onChange={() => toggleUserSelection(primaryApp.id)}
                                  className="rounded border-gray-300" 
                                />
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  {hasMultipleApps && (
                                    <button
                                      onClick={() => toggleCandidate(candidateName)}
                                      className="text-gray-400 hover:text-gray-600"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                  <div className="relative">
                                    {primaryApp.avatar ? (
                                      <img
                                        src={primaryApp.avatar}
                                        alt={primaryApp.name}
                                        className={`w-8 h-8 rounded-full object-cover border-2 ${getUserTypeBadgeColor(primaryApp.userType)}`}
                                      />
                                    ) : (
                                      <div className={`w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center border-2 ${getUserTypeBadgeColor(primaryApp.userType)}`}>
                                        <span className="text-white text-xs font-medium">
                                          {getInitials(primaryApp.name)}
                                        </span>
                                      </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs border border-gray-200">
                                      {getUserTypeIcon(primaryApp.userType)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">{primaryApp.name}</span>
                                    {hasMultipleApps && (
                                      <div className="text-xs text-gray-500">
                                        {applications.length} applications
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  primaryApp.userType === 'Employee' ? 'bg-blue-100 text-blue-800' :
                                  primaryApp.userType === 'External User' ? 'bg-orange-100 text-orange-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {primaryApp.userType}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-gray-600">
                                {primaryApp.email}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  getStatusColor(primaryApp.userType === 'Job Application' ? primaryApp.applicationStatus : primaryApp.status)
                                }`}>
                                  {primaryApp.userType === 'Job Application' ? primaryApp.applicationStatus : primaryApp.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-gray-600">
                                {primaryApp.department || '-'}
                              </td>
                              <td className="py-4 px-6 text-gray-600">
                                <div>
                                  <span>{primaryApp.location || '-'}</span>
                                  {primaryApp.country && (
                                    <div className="text-sm text-gray-500">{primaryApp.country}</div>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-gray-600">
                                {primaryApp.userType === 'Job Application' && primaryApp.requisition ? (
                                  <div>
                                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                      {primaryApp.requisition.id}
                                    </span>
                                    <div className="text-sm text-gray-500">{primaryApp.requisition.title}</div>
                                  </div>
                                ) : '-'}
                              </td>
                            </tr>

                            {/* Nested applications */}
                            {hasMultipleApps && isExpanded && (
                              <tr>
                                <td colSpan={8} className="px-6 py-0">
                                  <div className="bg-gray-50 rounded-lg p-4 my-2">
                                    <div className="text-sm font-medium text-gray-700 mb-3">
                                      Other Applications ({applications.length - 1})
                                    </div>
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b border-gray-200">
                                          <th className="text-left py-2 px-3 font-medium text-gray-700 w-8">
                                            <input 
                                              type="checkbox" 
                                              checked={applications.slice(1).every(app => selectedUsers.includes(app.id))}
                                              onChange={() => {
                                                const otherApps = applications.slice(1);
                                                const allSelected = otherApps.every(app => selectedUsers.includes(app.id));
                                                if (allSelected) {
                                                  setSelectedUsers(prev => prev.filter(id => !otherApps.map(app => app.id).includes(id)));
                                                } else {
                                                  setSelectedUsers(prev => [...new Set([...prev, ...otherApps.map(app => app.id)])]);
                                                }
                                              }}
                                              className="rounded border-gray-300" 
                                            />
                                          </th>
                                          <th className="text-left py-2 px-3 font-medium text-gray-700">Requisition</th>
                                          <th className="text-left py-2 px-3 font-medium text-gray-700">Status</th>
                                          <th className="text-left py-2 px-3 font-medium text-gray-700">Location</th>
                                          <th className="text-left py-2 px-3 font-medium text-gray-700">Hiring Manager</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {applications.slice(1).map((app) => (
                                          <tr key={app.id} className="hover:bg-gray-100">
                                            <td className="py-2 px-3">
                                              <input 
                                                type="checkbox" 
                                                checked={selectedUsers.includes(app.id)}
                                                onChange={() => toggleUserSelection(app.id)}
                                                className="rounded border-gray-300" 
                                              />
                                            </td>
                                            <td className="py-2 px-3">
                                              {app.requisition && (
                                                <div>
                                                  <span className="text-blue-600 font-medium">
                                                    {app.requisition.id}
                                                  </span>
                                                  <div className="text-gray-500">{app.requisition.title}</div>
                                                </div>
                                              )}
                                            </td>
                                            <td className="py-2 px-3">
                                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                getStatusColor(app.applicationStatus)
                                              }`}>
                                                {app.applicationStatus}
                                              </span>
                                            </td>
                                            <td className="py-2 px-3 text-gray-600">
                                              {app.location}
                                            </td>
                                            <td className="py-2 px-3 text-gray-600">
                                              {app.hiringManager}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
        
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <span>Rows per page: 10 ▼</span>
          <span>1-10 of {filteredUsers.length}</span>
          <div className="flex items-center space-x-2">
            <button className="text-gray-400">‹</button>
            <button className="text-gray-400">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};