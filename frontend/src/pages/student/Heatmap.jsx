import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, CodeBracketIcon, FireIcon, HomeIcon } from '@heroicons/react/24/outline';

const Heatmap = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activityData, setActivityData] = useState({
    github: { total: 156, streak: 12, today: 8 },
    leetcode: { total: 89, streak: 5, today: 3 },
    codeforces: { total: 45, streak: 3, today: 2 },
    hackerrank: { total: 67, streak: 8, today: 4 }
  });

  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear, 11, 31);
    
    // Generate data for the entire year
    for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
      const intensity = Math.floor(Math.random() * 5);
      data.push({
        date: d.toISOString().split('T')[0],
        intensity: intensity,
        count: intensity * Math.floor(Math.random() * 10) + 1,
        dayOfWeek: d.getDay(),
        weekOfYear: Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 604800000)
      });
    }
    
    return data;
  };

  const organizeByWeeks = () => {
    const weeks = [];
    const currentWeek = [];
    
    heatmapData.forEach((day, index) => {
      if (index % 7 === 0 && currentWeek.length > 0) {
        weeks.push([...currentWeek]);
        currentWeek.length = 0;
      }
      currentWeek.push(day);
    });
    
    if (currentWeek.length > 0) {
      weeks.push([...currentWeek]);
    }
    
    return weeks;
  };

  const getMonthLabels = () => {
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(selectedYear, i, 1);
      months.push(date.toLocaleDateString('en', { month: 'short' }));
    }
    
    return months;
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    
    return years;
  };

  const heatmapData = generateHeatmapData();
  const weeks = organizeByWeeks();
  const monthLabels = getMonthLabels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="glass rounded-2xl shadow-xl p-8 backdrop-blur-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Link 
                  to="/app/dashboard"
                  className="glass rounded-xl px-4 py-2 flex items-center space-x-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl mr-4"
                >
                  <HomeIcon className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">Home</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
                  Activity Heatmap
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {getYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-gray-600">Track your coding activity across all platforms for {selectedYear}</p>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(activityData).map(([platform, data]) => (
              <div key={platform} className="glass rounded-xl shadow-lg p-6 backdrop-blur-md hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 capitalize">{platform}</h3>
                  <CodeBracketIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-gray-900">{data.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Streak</span>
                    <span className="font-bold text-orange-600">{data.streak} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Today</span>
                    <span className="font-bold text-green-600">{data.today}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="glass rounded-2xl shadow-xl p-8 backdrop-blur-md">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Activity Overview</h2>
                <select 
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Platforms</option>
                  <option value="github">GitHub</option>
                  <option value="leetcode">LeetCode</option>
                  <option value="codeforces">Codeforces</option>
                  <option value="hackerrank">HackerRank</option>
                </select>
              </div>
              
              {/* Legend */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <span>Less</span>
                <div className="flex space-x-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-4 h-4 rounded ${
                        level === 0 ? 'bg-gray-100' :
                        level === 1 ? 'bg-green-200' :
                        level === 2 ? 'bg-green-300' :
                        level === 3 ? 'bg-green-400' :
                        'bg-green-500'
                      }`}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Month labels */}
                <div className="flex items-center mb-2">
                  <div className="w-8"></div>
                  <div className="flex space-x-2">
                    {monthLabels.map((month, index) => (
                      <div 
                        key={month} 
                        className="text-xs text-gray-600 text-center"
                        style={{ minWidth: '20px', padding: '0 2px' }}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start">
                  {/* Day labels */}
                  <div className="flex flex-col space-y-1 text-xs text-gray-500 w-8 mr-2">
                    <div className="h-4"></div>
                    <div className="h-4 flex items-center justify-end pr-1">Mon</div>
                    <div className="h-4"></div>
                    <div className="h-4 flex items-center justify-end pr-1">Wed</div>
                    <div className="h-4"></div>
                    <div className="h-4 flex items-center justify-end pr-1">Fri</div>
                    <div className="h-4"></div>
                    <div className="h-4 flex items-center justify-end pr-1">Sun</div>
                  </div>
                  
                  {/* Heatmap grid */}
                  <div className="flex space-x-1">
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col space-y-1">
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                          const dayData = week[dayIndex];
                          return (
                            <div
                              key={`${weekIndex}-${dayIndex}`}
                              className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-indigo-400 ${
                                dayData ? (
                                  dayData.intensity === 0 ? 'bg-gray-100' :
                                  dayData.intensity === 1 ? 'bg-green-200' :
                                  dayData.intensity === 2 ? 'bg-green-300' :
                                  dayData.intensity === 3 ? 'bg-green-400' :
                                  'bg-green-500'
                                ) : 'bg-gray-50'
                              }`}
                              title={dayData ? `${dayData.date}: ${dayData.count} contributions` : 'No data'}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
