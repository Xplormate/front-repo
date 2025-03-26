import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiFileText, FiActivity, FiClock } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  // This would be replaced with actual data from APIs
  const stats = [
    { name: 'Queries', value: '24', icon: <FiMessageSquare className="h-6 w-6 text-blue-500" /> },
    { name: 'Documents Analyzed', value: '8', icon: <FiFileText className="h-6 w-6 text-green-500" /> },
    { name: 'Suggestions Selected', value: '32', icon: <FiActivity className="h-6 w-6 text-purple-500" /> },
    { name: 'Last Activity', value: 'Today', icon: <FiClock className="h-6 w-6 text-orange-500" /> },
  ];
  
  // Recent queries - would be populated from API
  const recentQueries = [
    {
      id: 1,
      query: 'What are the growth prospects for Tesla stock?',
      date: '2 hours ago',
      hasResponse: true,
    },
    {
      id: 2,
      query: 'How will rising interest rates affect bank stocks?',
      date: 'Yesterday',
      hasResponse: true,
    },
    {
      id: 3,
      query: 'What is the market outlook for renewable energy companies?',
      date: '3 days ago',
      hasResponse: true,
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome, {currentUser?.name || 'User'}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's an overview of your research activity
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/chat"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiMessageSquare className="-ml-1 mr-2 h-5 w-5" />
            New Research Query
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Queries */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Research Queries
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentQueries.length === 0 ? (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No recent queries. Start a new research query!
            </li>
          ) : (
            recentQueries.map((item) => (
              <li key={item.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <Link to="/chat" className="block">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {item.query}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {item.hasResponse ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {item.date}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
        <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
          <Link
            to="/chat"
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View All Queries
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 