import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, AcademicCapIcon, CalendarIcon, BuildingOfficeIcon, HomeIcon } from '@heroicons/react/24/outline';

const Certificates = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    credentialId: ''
  });
  
  // Load certificates from localStorage on component mount
  const [certificates, setCertificates] = useState(() => {
    const savedCertificates = localStorage.getItem('userCertificates');
    if (savedCertificates) {
      return JSON.parse(savedCertificates);
    }
    return [
      {
        id: 1,
        name: 'Web Development Bootcamp',
        issuer: 'Tech Academy',
        date: '2024-03-15',
        credentialId: 'WA-123456'
      }
    ];
  });

  // Save certificates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userCertificates', JSON.stringify(certificates));
  }, [certificates]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCertificate) {
      // Update existing certificate
      setCertificates(certificates.map(cert => 
        cert.id === editingCertificate.id 
          ? {
              ...cert,
              name: formData.name,
              issuer: formData.issuer,
              date: formData.date,
              credentialId: formData.credentialId
            }
          : cert
      ));
      setEditingCertificate(null);
    } else {
      // Add new certificate
      const newCertificate = {
        id: certificates.length + 1,
        name: formData.name,
        issuer: formData.issuer,
        date: formData.date,
        credentialId: formData.credentialId
      };

      setCertificates([newCertificate, ...certificates]);
    }

    setFormData({ name: '', issuer: '', date: '', credentialId: '' });
    setShowForm(false);
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      name: certificate.name,
      issuer: certificate.issuer,
      date: certificate.date,
      credentialId: certificate.credentialId
    });
    setShowForm(true);
  };

  const handleDelete = (certificateId) => {
    setCertificates(certificates.filter(cert => cert.id !== certificateId));
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
            <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass rounded-xl px-4 py-2 flex items-center space-x-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <PlusCircleIcon className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Add Certificate</span>
          </button>
        </div>

      {showForm && (
        <div className="glass rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="e.g., Web Development Bootcamp" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
              <input 
                type="text" 
                value={formData.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="e.g., Tech Academy" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID (Optional)</label>
              <input 
                type="text" 
                value={formData.credentialId}
                onChange={(e) => handleInputChange('credentialId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="e.g., WA-123456" 
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Add Certificate
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="glass rounded-xl shadow-lg p-6 backdrop-blur-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.issuer}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {cert.date}
              </div>
              {cert.credentialId && (
                <div className="text-sm text-gray-500">
                  ID: {cert.credentialId}
                </div>
              )}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => handleEdit(cert)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Certificates;
