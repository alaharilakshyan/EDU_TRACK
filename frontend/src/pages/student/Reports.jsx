import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, DocumentTextIcon, CalendarIcon, HomeIcon } from '@heroicons/react/24/outline';

const Reports = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Project',
    description: '',
    file: null
  });
  
  // Load reports from localStorage on component mount
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem('userReports');
    if (savedReports) {
      return JSON.parse(savedReports);
    }
    return [
      {
        id: 1,
        title: 'Machine Learning Project Report',
        type: 'Project',
        date: '2024-03-10',
        status: 'Submitted',
        description: 'A comprehensive report on machine learning algorithms and their applications.',
        fileName: 'ml_project.pdf'
      }
    ];
  });

  // Save reports to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userReports', JSON.stringify(reports));
  }, [reports]);

  const [editingReport, setEditingReport] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingReport) {
      // Update existing report
      setReports(reports.map(report => 
        report.id === editingReport.id 
          ? {
              ...report,
              title: formData.title,
              type: formData.type,
              description: formData.description,
              fileName: formData.file?.name || report.fileName
            }
          : report
      ));
      setEditingReport(null);
    } else {
      // Add new report
      const newReport = {
        id: reports.length + 1,
        title: formData.title,
        type: formData.type,
        description: formData.description,
        date: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        fileName: formData.file?.name || 'No file uploaded'
      };
      setReports([newReport, ...reports]);
    }
    
    setFormData({ title: '', type: 'Project', description: '', file: null });
    setShowForm(false);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      title: report.title,
      type: report.type,
      description: report.description,
      file: null
    });
    setShowForm(true);
  };

  const handleDelete = (reportId) => {
    setReports(reports.filter(report => report.id !== reportId));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/app/dashboard"
              className="glass rounded-xl px-4 py-2 flex items-center space-x-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <HomeIcon className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass rounded-xl px-4 py-2 flex items-center space-x-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <PlusCircleIcon className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Submit Report</span>
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingReport ? 'Edit Report' : 'Submit New Report'}
          </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="e.g., Machine Learning Project Report" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Project">Project</option>
                  <option value="Research">Research</option>
                  <option value="Internship">Internship</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  rows="4" 
                  placeholder="Describe your report..."
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <input 
                  type="file" 
                  onChange={(e) => handleInputChange('file', e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  accept=".pdf,.doc,.docx" 
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Submit Report
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="glass rounded-xl shadow-lg p-6 backdrop-blur-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.type}</p>
                </div>
              </div>
              <div className="space-y-2">
                {report.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {report.date}
                </div>
                {report.fileName && (
                  <div className="flex items-center text-sm text-gray-500">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    {report.fileName}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(report)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
