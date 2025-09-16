import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Briefcase, MapPin, UserCheck, Plus, Eye, ChevronLeft, ChevronRight as ChevronRightIcon, List, Grid3X3 } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'accordion' | 'flat'>('flat');
  const [expandedRequisitions, setExpandedRequisitions] = useState<string[]>([]);
  const [selectedRequisitionStatus, setSelectedRequisitionStatus] = useState<Record<string, string>>({});
  const [selectedApplications, setSelectedApplications] = useState<Record<string, string[]>>({});
  const [flatSelectedApplications, setFlatSelectedApplications] = useState<string[]>([]);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [requisitionsPerPage] = useState(10);
  const [applicationsPerPage] = useState(10);
  const [loadedApplications, setLoadedApplications] = useState<Record<string, number>>({});
  const [applicationsPerLoad] = useState(20);
  const [isLoadingApplications, setIsLoadingApplications] = useState<Record<string, boolean>>({});
  const [showAllStatusChips, setShowAllStatusChips] = useState(false);

  // Refs for infinite scroll
  const applicationContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Generate comprehensive sample data
  const generateApplications = (): Application[] => {
    const applications: Application[] = [];
    const jobTitles = [
      'Senior Software Engineer',
      'Product Manager', 
      'UX Designer',
      'Data Scientist',
      'Marketing Manager',
      'Sales Representative',
      'HR Specialist',
      'DevOps Engineer',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Mobile Developer',
      'QA Engineer',
      'Business Analyst',
      'Project Manager',
      'Technical Writer',
      'Customer Success Manager',
      'Account Executive',
      'Financial Analyst',
      'Operations Manager'
    ];

    const locations = [
      'San Francisco, CA',
      'New York, NY',
      'Austin, TX',
      'Seattle, WA',
      'Boston, MA',
      'Chicago, IL',
      'Los Angeles, CA',
      'Denver, CO',
      'Atlanta, GA',
      'Miami, FL',
      'Portland, OR',
      'Nashville, TN',
      'Phoenix, AZ',
      'Dallas, TX',
      'Philadelphia, PA'
    ];

    const hiringManagers = [
      'David Chen',
      'Jennifer Martinez',
      'Sarah Davis',
      'Michael Brown',
      'Lisa Wang',
      'Robert Johnson',
      'Emily Rodriguez',
      'James Wilson',
      'Amanda Thompson',
      'Kevin Lee',
      'Rachel Green',
      'Mark Anderson',
      'Jessica Taylor',
      'Daniel Kim',
      'Laura Miller'
    ];

    const recruiters = [
      'Sarah Martinez',
      'Lisa Chen',
      'Mike Johnson',
      'Tom Wilson',
      'Amy Rodriguez',
      'Chris Parker',
      'Nicole Davis',
      'Ryan Thompson',
      'Maria Garcia',
      'Alex Turner'
    ];

    const statuses = [
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
    ];

    // Generate 60 requisitions with 100-150 applications each
    for (let reqIndex = 1; reqIndex <= 60; reqIndex++) {
      const reqId = `REQ-2024-${String(reqIndex).padStart(3, '0')}`;
      const jobTitle = jobTitles[(reqIndex - 1) % jobTitles.length];
      const location = locations[(reqIndex - 1) % locations.length];
      const hiringManager = hiringManagers[(reqIndex - 1) % hiringManagers.length];
      
      // Generate 100-150 applications per requisition
      const numApps = 100 + Math.floor(Math.random() * 51);
      
      for (let appIndex = 1; appIndex <= numApps; appIndex++) {
        const appId = `APP-${reqId}-${String(appIndex).padStart(3, '0')}`;
        const candidateId = `CAND-${reqId}-${String(appIndex).padStart(3, '0')}`;
        
        applications.push({
          id: appId,
          candidateId: candidateId,
          candidateName: `Candidate ${reqIndex}-${appIndex}`,
          email: `candidate.${reqIndex}.${appIndex}@email.com`,
          phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          requisitionId: reqId,
          requisitionName: jobTitle,
          applicationStatus: statuses[Math.floor(Math.random() * statuses.length)],
          hiringManager: hiringManager,
          recruiter: recruiters[Math.floor(Math.random() * recruiters.length)],
          appliedDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          location: location,
          country: 'United States',
          avatar: appIndex % 4 === 0 ? `https://images.pexels.com/photos/${1000000 + (reqIndex * 100) + appIndex}/pexels-photo-${1000000 + (reqIndex * 100) + appIndex}.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2` : undefined
        });
      }
    }
    
    return applications;
  };

  const allApplications = useMemo(() => generateApplications(), []);

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

    // Apply custom filter logic
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
          parseInt(app.requisitionId.split('-')[2]) <= 10
        );
        break;
      case 'Recent Applications':
        filtered = allApplications.filter(app => {
          const appDate = new Date(app.appliedDate);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return appDate >= monthAgo;
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

  // Get applications for flat view with status filtering
  const getFlatViewApplications = () => {
    let filtered = getFilteredApplications();
    
    // Filter by eligible statuses for accordion view, but show all for flat view
    if (viewMode === 'accordion') {
      filtered = filtered.filter(app => eligibleStatuses.includes(app.applicationStatus));
    }

    // Apply status filters for flat view
    if (viewMode === 'flat' && selectedStatusFilters.length > 0) {
      filtered = filtered.filter(app => selectedStatusFilters.includes(app.applicationStatus));
    }

    return filtered;
  };

  // Get status counts for flat view
  const getStatusCounts = () => {
    const filtered = getFilteredApplications();
    const counts: Record<string, number> = {};
    
    filtered.forEach(app => {
      counts[app.applicationStatus] = (counts[app.applicationStatus] || 0) + 1;
    });
    
    return counts;
  };

  // Group applications by requisition (for accordion view)
  const requisitionsMap = useMemo(() => {
    const filtered = getFilteredApplications().filter(app => eligibleStatuses.includes(app.applicationStatus));
    const map = new Map<string, Requisition>();
    
    filtered.forEach(app => {
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

  // Pagination for requisitions (accordion view)
  const totalPages = Math.ceil(requisitionsMap.length / requisitionsPerPage);
  const startIndex = (currentPage - 1) * requisitionsPerPage;
  const paginatedRequisitions = requisitionsMap.slice(startIndex, startIndex + requisitionsPerPage);

  // Pagination for flat view
  const flatViewApplications = getFlatViewApplications();
  const totalFlatPages = Math.ceil(flatViewApplications.length / applicationsPerPage);
  const flatStartIndex = (currentPage - 1) * applicationsPerPage;
  const paginatedFlatApplications = flatViewApplications.slice(flatStartIndex, flatStartIndex + applicationsPerPage);

  // Initialize loaded applications count for each requisition
  const getLoadedApplicationsCount = (requisitionId: string) => {
    return loadedApplications[requisitionId] || applicationsPerLoad;
  };

  // Infinite scroll handler
  const handleScroll = useCallback((requisitionId: string) => {
    const container = applicationContainerRefs.current[requisitionId];
    if (!container || isLoadingApplications[requisitionId]) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Load more when scrolled to 80% of the container
    if (scrollPercentage > 0.8) {
      const requisition = requisitionsMap.find(req => req.id === requisitionId);
      if (!requisition) return;

      const filteredApps = getFilteredRequisitionApplications(requisition);
      const currentLoaded = getLoadedApplicationsCount(requisitionId);
      
      if (currentLoaded < filteredApps.length) {
        setIsLoadingApplications(prev => ({ ...prev, [requisitionId]: true }));
        
        // Simulate loading delay
        setTimeout(() => {
          setLoadedApplications(prev => ({
            ...prev,
            [requisitionId]: Math.min(currentLoaded + applicationsPerLoad, filteredApps.length)
          }));
          setIsLoadingApplications(prev => ({ ...prev, [requisitionId]: false }));
        }, 500);
      }
    }
  }, [requisitionsMap, applicationsPerLoad, isLoadingApplications]);

  // Set up scroll listeners
  useEffect(() => {
    const containers = applicationContainerRefs.current;
    const scrollHandlers: Record<string, () => void> = {};

    Object.keys(containers).forEach(requisitionId => {
      const container = containers[requisitionId];
      if (container) {
        const handler = () => handleScroll(requisitionId);
        scrollHandlers[requisitionId] = handler;
        container.addEventListener('scroll', handler);
      }
    });

    return () => {
      Object.keys(scrollHandlers).forEach(requisitionId => {
        const container = containers[requisitionId];
        if (container) {
          container.removeEventListener('scroll', scrollHandlers[requisitionId]);
        }
      });
    };
  }, [expandedRequisitions, handleScroll]);

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
    setExpandedRequisitions(prev => {
      const isExpanding = !prev.includes(requisitionId);
      if (isExpanding) {
        // Initialize loaded applications count when expanding
        setLoadedApplications(prevLoaded => ({
          ...prevLoaded,
          [requisitionId]: applicationsPerLoad
        }));
        return [...prev, requisitionId];
      } else {
        // Reset loaded applications count when collapsing
        setLoadedApplications(prevLoaded => {
          const newLoaded = { ...prevLoaded };
          delete newLoaded[requisitionId];
          return newLoaded;
        });
        return prev.filter(id => id !== requisitionId);
      }
    });
  };

  const handleRequisitionStatusFilter = (requisitionId: string, status: string) => {
    setSelectedRequisitionStatus(prev => ({
      ...prev,
      [requisitionId]: prev[requisitionId] === status ? '' : status
    }));
    // Reset loaded applications when filter changes
    setLoadedApplications(prev => ({
      ...prev,
      [requisitionId]: applicationsPerLoad
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
    const loadedCount = getLoadedApplicationsCount(requisition.id);
    const visibleApps = filteredApps.slice(0, loadedCount);
    const appIds = visibleApps.map(app => app.id);
    const currentSelected = selectedApplications[requisition.id] || [];
    const allSelected = appIds.every(id => currentSelected.includes(id));

    setSelectedApplications(prev => ({
      ...prev,
      [requisition.id]: allSelected ? [] : appIds
    }));
  };

  // Flat view selection handlers
  const toggleFlatApplicationSelection = (applicationId: string) => {
    setFlatSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const toggleAllFlatApplications = () => {
    const appIds = paginatedFlatApplications.map(app => app.id);
    const allSelected = appIds.every(id => flatSelectedApplications.includes(id));
    
    if (allSelected) {
      setFlatSelectedApplications(prev => prev.filter(id => !appIds.includes(id)));
    } else {
      setFlatSelectedApplications(prev => [...new Set([...prev, ...appIds])]);
    }
  };

  // Status filter handlers
  const toggleStatusFilter = (status: string) => {
    setSelectedStatusFilters(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Reset loaded applications when changing pages
    setLoadedApplications({});
    setExpandedRequisitions([]);
  };

  const getPaginationRange = () => {
    const totalPagesForView = viewMode === 'flat' ? totalFlatPages : totalPages;
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPagesForView, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  };

  // Reset selections and page when switching view modes
  const handleViewModeChange = (mode: 'accordion' | 'flat') => {
    setViewMode(mode);
    setCurrentPage(1);
    setSelectedApplications({});
    setFlatSelectedApplications([]);
    setSelectedStatusFilters([]);
    setExpandedRequisitions([]);
    setShowAllStatusChips(false);
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

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('flat')}
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'flat'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              Job Applications
            </button>
            <button
              onClick={() => handleViewModeChange('accordion')}
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'accordion'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Requisition
            </button>
          </div>
        </div>
      </div>

      {/* Flat View */}
      {viewMode === 'flat' && (
        <>
          {/* Status Filter Chips */}
          <div className="mb-6">
            <div className="space-y-3">
              {(() => {
                const statusEntries = Object.entries(getStatusCounts());
                const maxVisible = 6;
                const visibleStatuses = showAllStatusChips ? statusEntries : statusEntries.slice(0, maxVisible);
                const hiddenCount = statusEntries.length - maxVisible;
                
                return (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {visibleStatuses.map(([status, count]) => (
                        <button
                          key={status}
                          onClick={() => toggleStatusFilter(status)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            selectedStatusFilters.includes(status)
                              ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                          <span className="ml-2 px-1.5 py-0.5 bg-white/60 rounded-full text-xs font-semibold">
                            {count}
                          </span>
                        </button>
                      ))}
                      
                      {!showAllStatusChips && hiddenCount > 0 && (
                        <button
                          onClick={() => setShowAllStatusChips(true)}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          +{hiddenCount} More
                        </button>
                      )}
                    </div>
                    
                    {showAllStatusChips && statusEntries.length > maxVisible && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setShowAllStatusChips(false)}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          Show Less
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {paginatedFlatApplications.length} of {flatViewApplications.length} applications
          </div>

          {/* Sticky Action Bar */}
          {flatSelectedApplications.length > 0 && (
            <div className="sticky top-0 z-20 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {flatSelectedApplications.length} Application{flatSelectedApplications.length !== 1 ? 's' : ''} Selected
                </span>
                <button
                  onClick={onGenerate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Generate
                </button>
              </div>
            </div>
          )}

          {/* Flat Applications Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr className="border-b border-gray-200">
                  <th className="w-12 py-4 px-6">
                    <input
                      type="checkbox"
                      checked={paginatedFlatApplications.length > 0 && paginatedFlatApplications.every(app => flatSelectedApplications.includes(app.id))}
                      onChange={toggleAllFlatApplications}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Application ID</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Candidate Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Job Requisition</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Application Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Hiring Manager</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Recruiter</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedFlatApplications.map((app, index) => (
                  <tr 
                    key={app.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      index < paginatedFlatApplications.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={flatSelectedApplications.includes(app.id)}
                        onChange={() => toggleFlatApplicationSelection(app.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-blue-600">{app.id}</span>
                    </td>
                    <td className="py-4 px-6">
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
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">
                        {app.requisitionName} ({app.requisitionId})
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.applicationStatus)}`}>
                        {app.applicationStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{app.hiringManager}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{app.recruiter}</span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <span>Rows per page: {applicationsPerPage}</span>
              <span>{flatStartIndex + 1}-{Math.min(flatStartIndex + applicationsPerPage, flatViewApplications.length)} of {flatViewApplications.length}</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}
                >
                  ‹
                </button>
                <button 
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalFlatPages}
                  className={currentPage === totalFlatPages ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Accordion View */}
      {viewMode === 'accordion' && (
        <>
          {/* Results Summary */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {paginatedRequisitions.length} of {requisitionsMap.length} requisitions with {requisitionsMap.reduce((sum, req) => sum + req.applications.length, 0)} total applications
          </div>

          {/* Requisition Accordions */}
          <div className="space-y-4">
            {paginatedRequisitions.map((requisition) => {
              const isExpanded = expandedRequisitions.includes(requisition.id);
              const filteredApps = getFilteredRequisitionApplications(requisition);
              const loadedCount = getLoadedApplicationsCount(requisition.id);
              const visibleApps = filteredApps.slice(0, loadedCount);
              const hasMoreApps = loadedCount < filteredApps.length;
              const selectedStatus = selectedRequisitionStatus[requisition.id];
              const selectedApps = selectedApplications[requisition.id] || [];
              const isLoading = isLoadingApplications[requisition.id];

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
                      </div>

                      {/* Applications Table with Infinite Scroll */}
                      <div className="overflow-hidden">
                        {/* Sticky Action Bar - appears when applications are selected */}
                        {selectedApps.length > 0 && (
                          <div className="sticky top-0 z-10 bg-blue-50 border-b border-blue-200 px-4 py-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-900">
                                {selectedApps.length} Applicant{selectedApps.length !== 1 ? 's' : ''} Selected
                              </span>
                              <button
                                onClick={onGenerate}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Generate
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Scrollable Applications Container */}
                        <div 
                          ref={(el) => applicationContainerRefs.current[requisition.id] = el}
                          className="max-h-96 overflow-y-auto"
                          style={{ scrollBehavior: 'smooth' }}
                        >
                          <table className="w-full">
                            <thead className="sticky top-0 bg-gray-50 z-5">
                              <tr className="border-b border-gray-200">
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

                          {/* Loading indicator */}
                          {isLoading && (
                            <div className="p-4 text-center">
                              <div className="inline-flex items-center space-x-2 text-gray-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm">Loading more applications...</span>
                              </div>
                            </div>
                          )}

                          {/* End of list indicator */}
                          {!hasMoreApps && !isLoading && visibleApps.length > 0 && (
                            <div className="p-4 text-center text-sm text-gray-500">
                              Showing all {filteredApps.length} applications
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination Controls */}
      {(viewMode === 'accordion' ? totalPages : totalFlatPages) > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {viewMode === 'accordion' ? totalPages : totalFlatPages} 
            {viewMode === 'accordion' 
              ? ` (${requisitionsMap.length} total requisitions)`
              : ` (${flatViewApplications.length} total applications)`
            }
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
              disabled={currentPage === (viewMode === 'accordion' ? totalPages : totalFlatPages)}
              className={`p-2 rounded-lg ${
                currentPage === (viewMode === 'accordion' ? totalPages : totalFlatPages)
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
      {((viewMode === 'accordion' && paginatedRequisitions.length === 0) || 
        (viewMode === 'flat' && paginatedFlatApplications.length === 0)) && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">
            {searchTerm || customFilter !== 'All Applications' || selectedStatusFilters.length > 0
              ? 'Try adjusting your search or filter criteria.'
              : 'Applications will appear here when candidates apply to job requisitions.'
            }
          </p>
        </div>
      )}
    </div>
  );
};