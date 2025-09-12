import React, { useState, useMemo } from 'react';
import { Search, Filter, User, Briefcase, Calendar, MapPin, Eye, Star, ChevronDown, ChevronRight, Users, Building2, Globe, UserCheck, Plus } from 'lucide-react';

interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  phone: string;
  requisitionId: string;
  requisitionTitle: string;
  status: string;
  country: string;
  location: string;
  hiringManager: string;
  recruiter: string;
  appliedDate: string;
  avatar?: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  applications: Application[];
}

interface Requisition {
  id: string;
  title: string;
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
  const [viewMode, setViewMode] = useState<'candidates' | 'requisition'>('candidates');
  const [activeStatusFilters, setActiveStatusFilters] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [expandedCandidates, setExpandedCandidates] = useState<string[]>([]);
  const [expandedRequisitions, setExpandedRequisitions] = useState<string[]>([]);
  const [selectedRequisitionStatus, setSelectedRequisitionStatus] = useState<Record<string, string>>({});
  const [showAllStatusChips, setShowAllStatusChips] = useState(false);

  // Sample data with multiple applications per candidate
  const applications: Application[] = [
    // Maria Santos - 2 applications
    {
      id: 'app-1',
      candidateId: 'cand-1',
      candidateName: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+63 917 123 4567',
      requisitionId: 'REQ-1001',
      requisitionTitle: 'Software Engineer',
      status: 'Interview',
      country: 'Philippines',
      location: 'Manila, Philippines',
      hiringManager: 'David Chen',
      recruiter: 'John Tan',
      appliedDate: '2024-01-15',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 'app-2',
      candidateId: 'cand-1',
      candidateName: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+63 917 123 4567',
      requisitionId: 'REQ-1003',
      requisitionTitle: 'Sales Executive',
      status: 'Screening',
      country: 'United States',
      location: 'New York, NY',
      hiringManager: 'Jennifer Wilson',
      recruiter: 'Sarah Lee',
      appliedDate: '2024-01-12',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    // James Carter - 3 applications
    {
      id: 'app-3',
      candidateId: 'cand-2',
      candidateName: 'James Carter',
      email: 'james.carter@email.com',
      phone: '+65 8123 4567',
      requisitionId: 'REQ-1002',
      requisitionTitle: 'Product Manager',
      status: 'Background Check',
      country: 'Singapore',
      location: 'Singapore',
      hiringManager: 'Lisa Wang',
      recruiter: 'Mei Lin',
      appliedDate: '2024-01-10',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 'app-4',
      candidateId: 'cand-2',
      candidateName: 'James Carter',
      email: 'james.carter@email.com',
      phone: '+65 8123 4567',
      requisitionId: 'REQ-1004',
      requisitionTitle: 'HR Specialist',
      status: 'Offer',
      country: 'Germany',
      location: 'Berlin, Germany',
      hiringManager: 'Klaus Weber',
      recruiter: 'Hans Müller',
      appliedDate: '2024-01-08',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 'app-5',
      candidateId: 'cand-2',
      candidateName: 'James Carter',
      email: 'james.carter@email.com',
      phone: '+65 8123 4567',
      requisitionId: 'REQ-1005',
      requisitionTitle: 'QA Analyst',
      status: 'Technical Interview',
      country: 'India',
      location: 'Bangalore, India',
      hiringManager: 'Raj Patel',
      recruiter: 'Priya Sharma',
      appliedDate: '2024-01-05',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    // Aiko Tanaka - 2 applications
    {
      id: 'app-6',
      candidateId: 'cand-3',
      candidateName: 'Aiko Tanaka',
      email: 'aiko.tanaka@email.com',
      phone: '+81 90 1234 5678',
      requisitionId: 'REQ-1001',
      requisitionTitle: 'Software Engineer',
      status: 'New',
      country: 'Philippines',
      location: 'Manila, Philippines',
      hiringManager: 'David Chen',
      recruiter: 'John Tan',
      appliedDate: '2024-01-14',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    {
      id: 'app-7',
      candidateId: 'cand-3',
      candidateName: 'Aiko Tanaka',
      email: 'aiko.tanaka@email.com',
      phone: '+81 90 1234 5678',
      requisitionId: 'REQ-1002',
      requisitionTitle: 'Product Manager',
      status: 'Approval',
      country: 'Singapore',
      location: 'Singapore',
      hiringManager: 'Lisa Wang',
      recruiter: 'Mei Lin',
      appliedDate: '2024-01-11',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
    },
    // Additional candidates with single applications
    ...Array.from({ length: 150 }, (_, i) => ({
      id: `app-${i + 8}`,
      candidateId: `cand-${i + 4}`,
      candidateName: `Candidate ${i + 4}`,
      email: `candidate${i + 4}@email.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      requisitionId: `REQ-100${(i % 10) + 1}`,
      requisitionTitle: ['Software Engineer', 'Product Manager', 'Sales Executive', 'HR Specialist', 'QA Analyst', 'Marketing Manager', 'Data Scientist', 'UX Designer', 'DevOps Engineer', 'Business Analyst'][i % 10],
      status: ['New', 'Screening', 'Interview', 'Technical Interview', 'Background Check', 'Approval', 'Offer', 'Rejected', 'Withdrawn'][i % 9],
      country: ['Philippines', 'Singapore', 'United States', 'Germany', 'India', 'Japan', 'Australia', 'Canada'][i % 8],
      location: ['Manila, Philippines', 'Singapore', 'New York, NY', 'Berlin, Germany', 'Bangalore, India', 'Tokyo, Japan', 'Sydney, Australia', 'Toronto, Canada'][i % 8],
      hiringManager: ['David Chen', 'Lisa Wang', 'Jennifer Wilson', 'Klaus Weber', 'Raj Patel', 'Yuki Sato', 'Emma Thompson', 'Michael Brown'][i % 8],
      recruiter: ['John Tan', 'Mei Lin', 'Sarah Lee', 'Hans Müller', 'Priya Sharma', 'Kenji Nakamura', 'Sophie Davis', 'Robert Johnson'][i % 8],
      appliedDate: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      avatar: i % 4 === 0 ? `https://images.pexels.com/photos/${1000000 + i}/pexels-photo-${1000000 + i}.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2` : undefined
    }))
  ];

  // Group applications by candidate
  const candidatesMap = useMemo(() => {
    const map = new Map<string, Candidate>();
    applications.forEach(app => {
      if (!map.has(app.candidateId)) {
        map.set(app.candidateId, {
          id: app.candidateId,
          name: app.candidateName,
          email: app.email,
          phone: app.phone,
          avatar: app.avatar,
          applications: []
        });
      }
      map.get(app.candidateId)!.applications.push(app);
    });
    return map;
  }, [applications]);

  // Group applications by requisition
  const requisitionsMap = useMemo(() => {
    const map = new Map<string, Requisition>();
    applications.forEach(app => {
      if (!map.has(app.requisitionId)) {
        map.set(app.requisitionId, {
          id: app.requisitionId,
          title: app.requisitionTitle,
          location: app.location,
          hiringManager: app.hiringManager,
          applications: [],
          statusCounts: {}
        });
      }
      const req = map.get(app.requisitionId)!;
      req.applications.push(app);
      req.statusCounts[app.status] = (req.statusCounts[app.status] || 0) + 1;
    });
    return map;
  }, [applications]);

  // Get all unique statuses with counts
  const allStatuses = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    applications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });
    return Object.entries(statusCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([status, count]) => ({ status, count }));
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.requisitionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.requisitionTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeStatusFilters.length === 0 || activeStatusFilters.includes(app.status);
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, activeStatusFilters]);

  // Get filtered candidates
  const filteredCandidates = useMemo(() => {
    const candidateIds = new Set(filteredApplications.map(app => app.candidateId));
    return Array.from(candidatesMap.values()).filter(candidate => 
      candidateIds.has(candidate.id)
    ).map(candidate => ({
      ...candidate,
      applications: candidate.applications.filter(app => 
        filteredApplications.some(filtered => filtered.id === app.id)
      )
    }));
  }, [candidatesMap, filteredApplications]);

  // Get filtered requisitions
  const filteredRequisitions = useMemo(() => {
    const requisitionIds = new Set(filteredApplications.map(app => app.requisitionId));
    return Array.from(requisitionsMap.values()).filter(req => 
      requisitionIds.has(req.id)
    ).map(req => ({
      ...req,
      applications: req.applications.filter(app => 
        filteredApplications.some(filtered => filtered.id === app.id)
      )
    }));
  }, [requisitionsMap, filteredApplications]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New': 'bg-blue-100 text-blue-800',
      'Screening': 'bg-yellow-100 text-yellow-800',
      'Interview': 'bg-purple-100 text-purple-800',
      'Technical Interview': 'bg-indigo-100 text-indigo-800',
      'Background Check': 'bg-orange-100 text-orange-800',
      'Approval': 'bg-cyan-100 text-cyan-800',
      'Offer': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Withdrawn': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const toggleStatusFilter = (status: string) => {
    setActiveStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleApplicationSelection = (applicationId: string) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const toggleAllCandidateApplications = (candidate: Candidate) => {
    const candidateAppIds = candidate.applications.map(app => app.id);
    const allSelected = candidateAppIds.every(id => selectedApplications.includes(id));
    
    if (allSelected) {
      setSelectedApplications(prev => prev.filter(id => !candidateAppIds.includes(id)));
    } else {
      setSelectedApplications(prev => [...new Set([...prev, ...candidateAppIds])]);
    }
  };

  const toggleCandidateExpansion = (candidateId: string) => {
    setExpandedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
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
      ? requisition.applications.filter(app => app.status === selectedStatus)
      : requisition.applications;
  };

  const visibleStatusChips = showAllStatusChips ? allStatuses : allStatuses.slice(0, 6);
  const hiddenStatusCount = allStatuses.length - 6;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applications..."
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
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setViewMode('candidates')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'candidates'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => setViewMode('requisition')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'requisition'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            By Requisition
          </button>
        </div>
      </div>

      {/* Quick Status Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {visibleStatusChips.map(({ status, count }) => (
            <button
              key={status}
              onClick={() => toggleStatusFilter(status)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeStatusFilters.includes(status)
                  ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status} ({count})
            </button>
          ))}
          {!showAllStatusChips && hiddenStatusCount > 0 && (
            <button
              onClick={() => setShowAllStatusChips(true)}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              +{hiddenStatusCount} More
            </button>
          )}
          {showAllStatusChips && hiddenStatusCount > 0 && (
            <button
              onClick={() => setShowAllStatusChips(false)}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Show Less
            </button>
          )}
        </div>
        {activeStatusFilters.length > 0 && (
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            <button
              onClick={() => setActiveStatusFilters([])}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Content based on view mode */}
      {viewMode === 'candidates' ? (
        /* Candidates View */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-12 py-4 px-6">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={() => {}}
                  />
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Candidate</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Primary Application</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Location</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Recruiter</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => {
                const primaryApp = candidate.applications[0];
                const isExpanded = expandedCandidates.includes(candidate.id);
                const hasMultipleApps = candidate.applications.length > 1;

                return (
                  <React.Fragment key={candidate.id}>
                    <tr className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={candidate.applications.every(app => selectedApplications.includes(app.id))}
                          onChange={() => toggleAllCandidateApplications(candidate)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {candidate.avatar ? (
                            <img
                              src={candidate.avatar}
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {getInitials(candidate.name)}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.email}</div>
                            {hasMultipleApps && (
                              <div className="text-xs text-blue-600">
                                {candidate.applications.length} applications
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">
                            {primaryApp.requisitionId} - {primaryApp.requisitionTitle}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Globe className="w-3 h-3 mr-1" />
                            {primaryApp.country}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(primaryApp.status)}`}>
                          {primaryApp.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {primaryApp.location}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {primaryApp.recruiter}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {hasMultipleApps && (
                            <button
                              onClick={() => toggleCandidateExpansion(candidate.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && hasMultipleApps && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="ml-8">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">All Applications</h4>
                            <div className="bg-white rounded-lg border border-gray-200">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="w-12 py-2 px-4">
                                      <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        onChange={() => {}}
                                      />
                                    </th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-700">Requisition</th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-700">Title</th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-700">Status</th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-700">Recruiter</th>
                                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-700">Location</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {candidate.applications.map((app, index) => (
                                    <tr key={app.id} className={index < candidate.applications.length - 1 ? 'border-b border-gray-100' : ''}>
                                      <td className="py-2 px-4">
                                        <input
                                          type="checkbox"
                                          checked={selectedApplications.includes(app.id)}
                                          onChange={() => toggleApplicationSelection(app.id)}
                                          className="rounded border-gray-300"
                                        />
                                      </td>
                                      <td className="py-2 px-4 text-sm font-mono text-blue-600">{app.requisitionId}</td>
                                      <td className="py-2 px-4 text-sm text-gray-900">{app.requisitionTitle}</td>
                                      <td className="py-2 px-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                                          {app.status}
                                        </span>
                                      </td>
                                      <td className="py-2 px-4 text-sm text-gray-600">{app.recruiter}</td>
                                      <td className="py-2 px-4 text-sm text-gray-600">{app.location}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Requisition Grouping View */
        <div className="space-y-4">
          {filteredRequisitions.map((requisition) => {
            const isExpanded = expandedRequisitions.includes(requisition.id);
            const filteredApps = getFilteredRequisitionApplications(requisition);
            const selectedStatus = selectedRequisitionStatus[requisition.id];

            return (
              <div key={requisition.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
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
                        {requisition.id} - {requisition.title}
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center space-x-4">
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

                {isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    {/* Status Cards */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Application Status</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Object.entries(requisition.statusCounts).map(([status, count]) => (
                          <button
                            key={status}
                            onClick={() => handleRequisitionStatusFilter(requisition.id, status)}
                            className={`p-3 rounded-lg border text-center transition-colors ${
                              selectedStatus === status
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-2xl font-bold text-gray-900">{count}</div>
                            <div className="text-xs text-gray-600 mt-1">{status}</div>
                          </button>
                        ))}
                      </div>
                      {selectedStatus && (
                        <div className="mt-2">
                          <button
                            onClick={() => handleRequisitionStatusFilter(requisition.id, '')}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Clear filter
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Applications List */}
                    <div className="bg-gray-50 rounded-lg">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Candidate</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Country</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Recruiter</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Applied</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredApps.map((app, index) => (
                            <tr key={app.id} className={`hover:bg-white ${index < filteredApps.length - 1 ? 'border-b border-gray-100' : ''}`}>
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
                                    <div className="text-sm font-medium text-gray-900">{app.candidateName}</div>
                                    <div className="text-xs text-gray-500">{app.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Globe className="w-3 h-3 mr-1" />
                                  {app.country}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{app.recruiter}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {new Date(app.appliedDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        Showing {viewMode === 'flat' ? filteredCandidates.length : filteredRequisitions.length} {viewMode === 'flat' ? 'candidates' : 'requisitions'} 
        {activeStatusFilters.length > 0 && ` with status: ${activeStatusFilters.join(', ')}`}
      </div>
    </div>
  );
};