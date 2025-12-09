import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, BriefcaseIcon, CalendarIcon, MapPinIcon, HomeIcon } from '@heroicons/react/24/outline';

const Internships = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'Current'
  });
  
  // Load internships from localStorage on component mount
  const [internships, setInternships] = useState(() => {
    const savedInternships = localStorage.getItem('userInternships');
    if (savedInternships) {
      return JSON.parse(savedInternships);
    }
    return [
      {
        id: 1,
        company: 'Tech Solutions Inc.',
        position: 'Software Developer Intern',
        location: 'San Francisco, CA',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        status: 'Completed'
      }
    ];
  });

  // Save internships to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userInternships', JSON.stringify(internships));
  }, [internships]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingInternship) {
      // Update existing internship
      setInternships(internships.map(internship => 
        internship.id === editingInternship.id 
          ? {
              ...internship,
              company: formData.company,
              position: formData.position,
              location: formData.location,
              startDate: formData.startDate,
              endDate: formData.endDate,
              status: formData.status
            }
          : internship
      ));
      setEditingInternship(null);
    } else {
      // Add new internship
      const newInternship = {
        id: internships.length + 1,
        company: formData.company,
        position: formData.position,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status
      };

      setInternships([newInternship, ...internships]);
    }

    setFormData({ company: '', position: '', location: '', startDate: '', endDate: '', status: 'Current' });
    setShowForm(false);
  };

  const handleEdit = (internship) => {
    setEditingInternship(internship);
    setFormData({
      company: internship.company,
      position: internship.position,
      location: internship.location,
      startDate: internship.startDate,
      endDate: internship.endDate,
      status: internship.status
    });
    setShowForm(true);
  };

  const handleDelete = (internshipId) => {
    setInternships(internships.filter(internship => internship.id !== internshipId));
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
            <h1 className="text-3xl font-bold text-gray-900">Internships</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass rounded-xl px-4 py-2 flex items-center space-x-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <PlusCircleIcon className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Add Internship</span>
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingInternship ? 'Edit Internship' : 'Add New Internship'}
          </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="e.g., Tech Solutions Inc." 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input 
                  type="text" 
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="e.g., Software Developer Intern" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="e.g., San Francisco, CA" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Current">Current</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Add Internship
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <div key={internship.id} className="glass rounded-xl shadow-lg p-6 backdrop-blur-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <BriefcaseIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">{internship.position}</h3>
                  <p className="text-sm text-gray-600">{internship.company}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {internship.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {internship.startDate} - {internship.endDate}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    internship.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {internship.status}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(internship)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(internship.id)}
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

export default Internships;
