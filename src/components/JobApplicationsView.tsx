import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Briefcase, MapPin, UserCheck, Plus, Eye, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  phone: string;
  requisitionId: string;
  requisitionName: string;
  applicationStatus: string;
  hiringManager: string;
  recruiter: string;
  appliedDate: string;
  avatar?: string;
  location: string;
  country: string;
}

interface Requisition {
  id: string;
  name: string;
  location: string;
  hiringManager: string;
  applications: Application[];
  statusCounts: Record<string, number>;
}

interface JobApplicationsViewProps {
  onGenerate: () => void;
}

export const JobApplicationsView: React.FC<JobApplicationsViewProps> = ({ onGenerate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customFilter, setCustomFilter] = useState('All Applications');
  const [expandedRequisitions, setExpandedRequisitions] = useState<string[]>([]);
  const [selectedRequisitionStatus, setSelectedRequisitionStatus] = useState<Record<string, string>>({});
  const [selectedApplications, setSelectedApplications] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [requisitionsPerPage] = useState(10);
  const [visibleApplications, setVisibleApplications] = useState<Record<string, number>>({});
  const [applicationsPerLoad] = useState(20);

  // Sample data
  const applications: Application[] = [
    // REQ-2024-001 - Software Engineer
    {
      id: 'APP-001',
      candidateId: 'CAND-001',
      candidateName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      requisitionId: 'REQ-2024-001',
      requisitionName: 'Senior Software Engineer',
      applicationStatus: 'Interview Scheduled',
      hiringManager: 'David Chen',
      recruiter: 'Sarah Martinez',
      appliedDate: '2024-01-15',
      location: 'San Francisco, CA',
      country: 'United States',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 'APP-002',
      candidateId: 'CAND-002',
      candidateName: 'Michael Rodriguez',
      email: 'michael.rodriguez@email.com',
      phone: '+1 (555) 234-5678',
      requisitionId: 'REQ-2024-001',
      requisitionName: 'Senior Software Engineer',
      applicationStatus: 'Technical Review',
      hiringManager: 'David Chen',
      recruiter: 'Sarah Martinez',
      appliedDate: '2024-01-12',
      location: 'San Francisco, CA',
      country: 'United States',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 'APP-003',
      candidateId: 'CAND-003',
      candidateName: 'Emily Chen',
      email: 'emily.chen@email.com',
      phone: '+1 (555) 345-6789',
      requisitionId: 'REQ-2024-001',
      requisitionName: 'Senior Software Engineer',
      applicationStatus: 'New',
      hiringManager: 'David Chen',
      recruiter: 'Mike Johnson',
      appliedDate: '2024-01-18',
      location: 'San Francisco, CA',
      country: 'United States'
    },
    {
      id: 'APP-004',
      candidateId: 'CAND-004',
      candidateName: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '+1 (555) 456-7890',
      requisitionId: 'REQ-2024-001',
      requisitionName: 'Senior Software Engineer',
      applicationStatus: 'Hired',
      hiringManager: 'David Chen',
      recruiter: 'Sarah Martinez',
      appliedDate: '2024-01-08',
      location: 'San Francisco, CA',
      country: 'United States',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    // REQ-2024-002 - Product Manager
    {
      id: 'APP-005',
      candidateId: 'CAND-005',
      candidateName: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 567-8901',
      requisitionId: 'REQ-2024-002',
      requisitionName: 'Product Manager',
      applicationStatus: 'Phone Screen',
      hiringManager: 'Jennifer Martinez',
      recruiter: 'Lisa Chen',
      appliedDate: '2024-01-20',
      location: 'New York, NY',
      country: 'United States',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 'APP-006',
      candidateId: 'CAND-006',
      candidateName: 'Robert Kim',
      email: 'robert.kim@email.com',
      phone: '+1 (555) 678-9012',
      requisitionId: 'REQ-2024-002',
      requisitionName: 'Product Manager',
      applicationStatus: 'Offer Approved',
      hiringManager: 'Jennifer Martinez',
      recruiter: 'Lisa Chen',
      appliedDate: '2024-01-10',
      location: 'New York, NY',
      country: 'United States'
    },
    {
      id: 'APP-007',
      candidateId: 'CAND-007',
      candidateName: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 789-0123',
      requisitionId: 'REQ-2024-002',
      requisitionName: 'Product Manager',
      applicationStatus: 'Rejected',
      hiringManager: 'Jennifer Martinez',
      recruiter: 'Mike Johnson',
      appliedDate: '2024-01-05',
      location: 'New York, NY',
      country: 'United States'
    },
    // REQ-2024-003 - UX Designer
    {
      id: 'APP-008',
      candidateId: 'CAND-008',
      candidateName: 'Alex Turner',
      email: 'alex.turner@email.com',
      phone: '+1 (555) 890-1234',
      requisitionId: 'REQ-2024-003',
      requisitionName: 'UX Designer',
      applicationStatus: 'Portfolio Review',
      hiringManager: 'Sarah Davis',
      recruiter: 'Tom Wilson',
      appliedDate: '2024-01-22',
      location: 'Austin, TX',
      country: 'United States'
    },
    {
      id: 'APP-009',
      candidateId: 'CAND-009',
      candidateName: 'Nina Patel',
      email: 'nina.patel@email.com',
      phone: '+1 (555) 901-2345',
      requisitionId: 'REQ-2024-003',
      requisitionName: 'UX Designer',
      applicationStatus: 'Ready to Hire',
      hiringManager: 'Sarah Davis',
      recruiter: 'Tom Wilson',
      appliedDate: '2024-01-14',
      location: 'Austin, TX',
      country: 'United States',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    // Add more sample data
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `APP-${String(i + 10).padStart(3, '0')}`,
      candidateId: `CAND-${String(i + 10).padStart(3, '0')}`,
      candidateName: `Candidate ${i + 10}`,
      email: `candidate${i + 10}@email.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      requisitionId: `REQ-2024-${String((i % 8) + 1).padStart(3, '0')}`,
      requisitionName: [
        'Senior Software Engineer',
        'Product Manager', 
        'UX Designer',
        'Data Scientist',
        'Marketing Manager',
        'Sales Representative',
        'HR Specialist',
        'DevOps Engineer'
      ][i % 8],
      applicationStatus: [
        'New',
        'Phone Screen',
        'Technical Review',
        'Interview Scheduled',
        'Final Interview',
        'Offer Approval',
        'Offer Approved',
        'Offer Extended',
        'Offer Accepted',
        'Offer Declined',
        'Ready to Hire',
        'Hired',
        'Rejected',
        'Withdrawn',
        'Portfolio Review'
      ][i % 13],
      hiringManager: [
        'David Chen',
        'Jennifer Martinez',
        'Sarah Davis',
        'Michael Brown',
        'Lisa Wang',
        'Robert Johnson',
        'Emily Rodriguez',
        'James Wilson'
      ][i % 8],
      recruiter: [
        'Sarah Martinez',
        'Lisa Chen',
        'Mike Johnson',
        'Tom Wilson',
        'Amy Rodriguez'
      ][i % 5],
      appliedDate: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      location: [
        'San Francisco, CA',
        'New York, NY',
        'Austin, TX',
        'Seattle, WA',
        'Boston, MA',
        'Chicago, IL',
        'Los Angeles, CA',
        'Denver, CO'
      ][i % 8],
      country: 'United States',
      avatar: i % 4 === 0 ? `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2` : undefined
    }))
  ];

  // Generate more applications to demonstrate infinite scroll
  const generateMoreApplications = (baseApplications: Application[]): Application[] => {
    const additionalApps: Application[] = [];
    
    // Add more applications for each requisition to demonstrate infinite scroll
    for (let reqIndex = 1; reqIndex <= 8; reqIndex++) {
      const reqId = `REQ-2024-${String(reqIndex).padStart(3, '0')}`;
      const reqName = [
        'Senior Software Engineer',
        'Product Manager', 
        'UX Designer',
        'Data Scientist',
        'Marketing Manager',
        'Sales Representative',
        'HR Specialist',
        'DevOps Engineer'
      ][(reqIndex - 1) % 8];
      
      // Add 30-50 applications per requisition
      const numApps = 30 + Math.floor(Math.random() * 21);
      
      for (let i = 0; i < numApps; i++) {
        const appId = `APP-${reqId}-${String(i + 1).padStart(3, '0')}`;
        additionalApps.push({
          id: appId,
          candidateId: `CAND-${reqId}-${String(i + 1).padStart(3, '0')}`,
          candidateName: `Candidate ${reqIndex}-${i + 1}`,
          email: `candidate.${reqIndex}.${i + 1}@email.com`,
          phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          requisitionId: reqId,
          requisitionName: reqName,
          applicationStatus: [
            'New',
            'Phone Screen',
            'Technical Review',
            'Interview Scheduled',
            'Final Interview',
            'Offer Approval',
            'Offer Approved',
            'Offer Extended',
            'Offer Accepted',
            'Offer Declined',
            'Ready to Hire',
            'Hired',
            'Rejected',
            'Withdrawn',
            'Portfolio Review'
          ][i % 15],
          hiringManager: [
            'David Chen',
            'Jennifer Martinez',
            'Sarah Davis',
            'Michael Brown',
            'Lisa Wang',
            'Robert Johnson',
            'Emily Rodriguez',
            'James Wilson'
          ][(reqIndex - 1) % 8],
          recruiter: [
            'Sarah Martinez',
            'Lisa Chen',
            'Mike Johnson',
            'Tom Wilson',
            'Amy Rodriguez'
          ][i % 5],
          appliedDate: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          location: [
            'San Francisco, CA',
            'New York, NY',
            'Austin, TX',
            'Seattle, WA',
            'Boston, MA',
            'Chicago, IL',
            'Los Angeles, CA',
            'Denver, CO'
          ][(reqIndex - 1) % 8],
          country: 'United States',
          avatar: i % 4 === 0 ? `https://images.pexels.com/photos/${1000000 + (reqIndex * 100) + i}/pexels-photo-${1000000 + (reqIndex * 100) + i}.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2` : undefined
        });
      }
    }
    
    return [...baseApplications, ...additionalApps];
  };

  const allApplications = generateMoreApplications(applications);
  // Custom filter options
  const customFilterOptions = [
    'All Applications',
    'My Candidates',
    'Open Applications',
    'High Priority Reqs',
    'Recent Applications',
    'Pending Offers'
  ];

  // Statuses eligible for document generation
  const eligibleStatuses = [
    'Offer Approval',
    'Offer Approved',
    'Offer Extended',
    'Offer Accepted',
    'Ready to Hire',
    'Hired',
    'Final Interview',
    'Onboarding'
  ];

  // Apply custom filters
  const getFilteredApplications = () => {
    let filtered = allApplications;

    // Apply custom filter logic (simplified for demo)
    switch (customFilter) {
      case 'My Candidates':
        filtered = allApplications.filter(app => 
          ['David Chen', 'Jennifer Martinez', 'Sarah Davis'].includes(app.hiringManager)
        );
        break;
      case 'Open Applications':
        filtered = allApplications.filter(app => 
          !['Rejected', 'Withdrawn', 'Offer Extended'].includes(app.applicationStatus)
        );
        break;
      case 'High Priority Reqs':
        filtered = allApplications.filter(app => 
          ['REQ-2024-001', 'REQ-2024-002'].includes(app.requisitionId)
        );
        break;
      case 'Recent Applications':
        filtered = allApplications.filter(app => {
          const appDate = new Date(app.appliedDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return appDate >= weekAgo;
        });
        break;
      case 'Pending Offers':
        filtered = allApplications.filter(app => 
          ['Offer Approval', 'Offer Approved', 'Offer Extended', 'Offer Accepted'].includes(app.applicationStatus)
        );
        break;
      default:
        filtered = allApplications;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.requisitionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.requisitionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Group applications by requisition
  const requisitionsMap = useMemo(() => {
    const filtered = getFilteredApplications();
    const map = new Map<string, Requisition>();
    
    filtered.forEach(app => {
      // Only include applications with eligible statuses
      if (!eligibleStatuses.includes(app.applicationStatus)) {
        return;
      }
      
      if (!map.has(app.requisitionId)) {
        map.set(app.requisitionId, {
          id: app.requisitionId,
          name: app.requisitionName,
          location: app.location,
          hiringManager: app.hiringManager,
          applications: [],
          statusCounts: {}
        });
      }
      const req = map.get(app.requisitionId)!;
      req.applications.push(app);
      req.statusCounts[app.applicationStatus] = (req.statusCounts[app.applicationStatus] || 0) + 1;
    });
    
    return Array.from(map.values());
  }, [searchTerm, customFilter]);

  // Pagination for requisitions
  const totalPages = Math.ceil(requisitionsMap.length / requisitionsPerPage);
  const startIndex = (currentPage - 1) * requisitionsPerPage;
  const paginatedRequisitions = requisitionsMap.slice(startIndex, startIndex + requisitionsPerPage);

  // Initialize visible applications count for each requisition
  const getVisibleApplicationsCount = (requisitionId: string) => {
    return visibleApplications[requisitionId] || applicationsPerLoad;
  };

  const loadMoreApplications = (requisitionId: string) => {
    setVisibleApplications(prev => ({
      ...prev,
      [requisitionId]: (prev[requisitionId] || applicationsPerLoad) + applicationsPerLoad
    }));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New': 'bg-blue-100 text-blue-800',
      'Phone Screen': 'bg-yellow-100 text-yellow-800',
      'Technical Review': 'bg-purple-100 text-purple-800',
      'Interview Scheduled': 'bg-indigo-100 text-indigo-800',
      'Final Interview': 'bg-orange-100 text-orange-800',
      'Offer Approval': 'bg-yellow-100 text-yellow-800',
      'Offer Approved': 'bg-blue-100 text-blue-800',
      'Offer Extended': 'bg-green-100 text-green-800',
      'Offer Accepted': 'bg-green-200 text-green-900',
      'Offer Declined': 'bg-red-100 text-red-800',
      'Ready to Hire': 'bg-purple-100 text-purple-800',
      'Hired': 'bg-emerald-100 text-emerald-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Withdrawn': 'bg-gray-100 text-gray-800',
      'Portfolio Review': 'bg-pink-100 text-pink-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleRequisitionExpansion = (requisitionId: string) => {
    setExpandedRequisitions(prev => 
      prev.includes(requisitionId)
        ? prev.filter(id => id !== requisitionId)
        : [...prev, requisitionId]
    );
  };

  const handleRequisitionStatusFilter = (requisitionId: string, status: string) => {
    setSelectedRequisitionStatus(prev => ({
      ...prev,
      [requisitionId]: prev[requisitionId] === status ? '' : status
    }));
  };

  const getFilteredRequisitionApplications = (requisition: Requisition) => {
    const selectedStatus = selectedRequisitionStatus[requisition.id];
    return selectedStatus 
      ? requisition.applications.filter(app => app.applicationStatus === selectedStatus)
      : requisition.applications;
  };

  const toggleApplicationSelection = (requisitionId: string, applicationId: string) => {
    setSelectedApplications(prev => {
      const current = prev[requisitionId] || [];
      const updated = current.includes(applicationId)
        ? current.filter(id => id !== applicationId)
        : [...current, applicationId];
      
      return {
        ...prev,
        [requisitionId]: updated
      };
    });
  };

  const toggleAllApplicationsInRequisition = (requisition: Requisition) => {
    const filteredApps = getFilteredRequisitionApplications(requisition);
    const appIds = filteredApps.map(app => app.id);
    const currentSelected = selectedApplications[requisition.id] || [];
    const allSelected = appIds.every(id => currentSelected.includes(id));

    setSelectedApplications(prev => ({
      ...prev,
      [requisition.id]: allSelected ? [] : appIds
    }));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Reset visible applications when changing pages
    setVisibleApplications({});
  };

  const getPaginationRange = () => {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Custom Filters Dropdown */}
          <div className="relative">
            <select
              value={customFilter}
              onChange={(e) => setCustomFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {customFilterOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
        
        <button
          onClick={onGenerate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate
        </button>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {paginatedRequisitions.length} of {requisitionsMap.length} requisitions with {requisitionsMap.reduce((sum, req) => sum + req.applications.length, 0)} total applications
      </div>

      {/* Requisition Accordions */}
      <div className="space-y-4">
        {paginatedRequisitions.map((requisition) => {
          const isExpanded = expandedRequisitions.includes(requisition.id);
          const filteredApps = getFilteredRequisitionApplications(requisition);
          const visibleCount = getVisibleApplicationsCount(requisition.id);
          const visibleApps = filteredApps.slice(0, visibleCount);
          const hasMoreApps = visibleCount < filteredApps.length;
          const selectedStatus = selectedRequisitionStatus[requisition.id];
          const selectedApps = selectedApplications[requisition.id] || [];

          return (
            <div key={requisition.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Accordion Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleRequisitionExpansion(requisition.id)}
              >
                <div className="flex items-center space-x-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {requisition.name} ({requisition.id})
                    </h3>
                    <div className="text-sm text-gray-500 flex items-center space-x-4 mt-1">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {requisition.location}
                      </span>
                      <span className="flex items-center">
                        <UserCheck className="w-3 h-3 mr-1" />
                        {requisition.hiringManager}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {requisition.applications.length} applications
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="border-t border-gray-200">
                  {/* Status Cards */}
                  <div className="p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Application Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {Object.entries(requisition.statusCounts).map(([status, count]) => (
                        <button
                          key={status}
                          onClick={() => handleRequisitionStatusFilter(requisition.id, status)}
                          className={`p-3 rounded-lg border text-center transition-colors ${
                            selectedStatus === status
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                          }`}
                        >
                          <div className="text-2xl font-bold text-gray-900">{count}</div>
                          <div className="text-xs text-gray-600 mt-1 leading-tight">{status}</div>
                        </button>
                      ))}
                    </div>
                    {selectedStatus && (
                      <div className="mt-3 flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Filtered by: {selectedStatus}</span>
                        <button
                          onClick={() => handleRequisitionStatusFilter(requisition.id, '')}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Clear filter
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Applications Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="w-12 py-3 px-4">
                            <input
                              type="checkbox"
                              checked={visibleApps.length > 0 && visibleApps.every(app => selectedApps.includes(app.id))}
                              onChange={() => toggleAllApplicationsInRequisition(requisition)}
                              className="rounded border-gray-300"
                            />
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Application ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Candidate Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Application Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Recruiter</th>
                          <th className="w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleApps.map((app, index) => (
                          <tr 
                            key={app.id} 
                            className={`hover:bg-gray-50 transition-colors ${
                              index < visibleApps.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedApps.includes(app.id)}
                                onChange={() => toggleApplicationSelection(requisition.id, app.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-sm text-blue-600">{app.id}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                {app.avatar ? (
                                  <img
                                    src={app.avatar}
                                    alt={app.candidateName}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                      {getInitials(app.candidateName)}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {app.candidateName} ({app.candidateId})
                                  </div>
                                  <div className="text-xs text-gray-500">{app.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.applicationStatus)}`}>
                                {app.applicationStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-gray-900">{app.recruiter}</span>
                            </td>
                            <td className="py-3 px-4">
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Load More Button */}
                  {hasMoreApps && (
                    <div className="p-4 text-center border-t border-gray-200">
                      <button
                        onClick={() => loadMoreApplications(requisition.id)}
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Load More Applications ({filteredApps.length - visibleCount} remaining)
                      </button>
                    </div>
                  )}

                  {/* Bulk Actions */}
                  {selectedApps.length > 0 && (
                    <div className="p-4 bg-blue-50 border-t border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">
                          {selectedApps.length} application{selectedApps.length !== 1 ? 's' : ''} selected
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors">
                            Export
                          </button>
                          <button className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors">
                            Bulk Update
                          </button>
                          <button className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors">
                            Send Email
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({requisitionsMap.length} total requisitions)
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {getPaginationRange().map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {paginatedRequisitions.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">
            {searchTerm || customFilter !== 'All Applications' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Applications will appear here when candidates apply to job requisitions.'
            }
          </p>
        </div>
      )}
    </div>
  );
};