import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';

const Heatmap = ({ uid7 }) => {
  const [heatmapData, setHeatmapData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchHeatmapData();
  }, [dateRange]);

  // Listen for GitHub data updates
  useEffect(() => {
    const handleHeatmapUpdate = (e) => {
      if (e.detail.platform === 'github' && e.detail.data.contributions) {
        setHeatmapData(e.detail.data.contributions);
      }
    };

    window.addEventListener('heatmapUpdate', handleHeatmapUpdate);
    return () => window.removeEventListener('heatmapUpdate', handleHeatmapUpdate);
  }, []);

  // Also check for localStorage changes
  useEffect(() => {
    const interval = setInterval(() => {
      const githubData = localStorage.getItem('githubData');
      if (githubData) {
        const parsed = JSON.parse(githubData);
        if (parsed.contributions) {
          setHeatmapData(parsed.contributions);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      
      // Try to get GitHub data from localStorage first
      const githubData = localStorage.getItem('githubData');
      if (githubData) {
        const parsed = JSON.parse(githubData);
        if (parsed.contributions) {
          setHeatmapData(parsed.contributions);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to API
      const response = await studentAPI.getHeatmap(uid7, dateRange);
      setHeatmapData(response.data);
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
      
      // Generate mock data as fallback
      const mockData = {};
      for (let i = 0; i < 365; i++) {
        const date = new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        mockData[date] = Math.floor(Math.random() * 10);
      }
      setHeatmapData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 5) return 'bg-green-400';
    if (count <= 10) return 'bg-green-600';
    return 'bg-green-800';
  };

  const getIntensityLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const generateCalendarWeeks = () => {
    const weeks = [];
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    
    // Start from the beginning of the week (Sunday)
    const currentWeekStart = new Date(startDate);
    currentWeekStart.setDate(startDate.getDate() - startDate.getDay());
    
    while (currentWeekStart <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(currentWeekStart);
        currentDate.setDate(currentWeekStart.getDate() + i);
        
        if (currentDate > endDate) {
          week.push(null);
        } else {
          const dateStr = currentDate.toISOString().split('T')[0];
          week.push({
            date: new Date(currentDate),
            count: heatmapData[dateStr] || 0,
            dateStr
          });
        }
      }
      weeks.push(week);
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    return weeks;
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day.dateStr === selectedDate ? null : day.dateStr);
    }
  };

  const getMonthLabel = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDayLabel = (index) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[index];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const weeks = generateCalendarWeeks();
  const totalActivities = Object.values(heatmapData).reduce((sum, count) => sum + count, 0);
  const activeDays = Object.values(heatmapData).filter(count => count > 0).length;

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{totalActivities}</div>
          <div className="text-sm text-gray-500">Total Activities</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">{activeDays}</div>
          <div className="text-sm text-gray-500">Active Days</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">
            {activeDays > 0 ? (totalActivities / activeDays).toFixed(1) : 0}
          </div>
          <div className="text-sm text-gray-500">Avg Activities/Day</div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
          </div>
          <button
            onClick={fetchHeatmapData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Heatmap Calendar */}
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <div className="min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-8"></div>
            {weeks[0]?.map((day, index) => {
              if (day && index === 0) {
                return (
                  <div key={index} className="flex-1 text-xs text-gray-500">
                    {getMonthLabel(day.date)}
                  </div>
                );
              }
              return <div key={index} className="flex-1"></div>;
            })}
          </div>

          {/* Day labels and calendar grid */}
          <div className="flex">
            <div className="flex flex-col space-y-1 mr-2">
              {getDayLabel(0).split('').map((char, index) => (
                <div key={index} className="h-3 text-xs text-gray-500">
                  {char}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-52 gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="contents">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-blue-400 ${
                          day ? getIntensityColor(day.count) : 'bg-gray-50'
                        } ${
                          selectedDate === day?.dateStr ? 'ring-2 ring-blue-600' : ''
                        }`}
                        onClick={() => handleDateClick(day)}
                        title={
                          day
                            ? `${day.dateStr}: ${day.count} activities`
                            : 'No data'
                        }
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">Less</div>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(level === 0 ? 0 : level * 3)}`}
                ></div>
              ))}
            </div>
            <div className="text-xs text-gray-500">More</div>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <div className="text-lg font-semibold text-blue-600">
            {heatmapData[selectedDate] || 0} activities
          </div>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
