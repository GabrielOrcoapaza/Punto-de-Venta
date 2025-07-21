import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Traffic Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">TRAFFIC</p>
              <p className="text-2xl font-bold text-gray-900">350,897</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600">3.48%</span>
                <span className="text-sm text-gray-500 ml-1">Since last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>

        {/* New Users Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">NEW USERS</p>
              <p className="text-2xl font-bold text-gray-900">2,356</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-600">3.48%</span>
                <span className="text-sm text-gray-500 ml-1">Since last week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sales Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">SALES</p>
              <p className="text-2xl font-bold text-gray-900">924</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-600">1.10%</span>
                <span className="text-sm text-gray-500 ml-1">Since yesterday</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">PERFORMANCE</p>
              <p className="text-2xl font-bold text-gray-900">49,65%</p>
              <div className="flex items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600">12%</span>
                <span className="text-sm text-gray-500 ml-1">Since last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Value Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">OVERVIEW Sales value</h3>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {/* Chart bars for 2025 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-white rounded-t" style={{ height: '60%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-white rounded-t" style={{ height: '80%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Feb</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-white rounded-t" style={{ height: '90%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-white rounded-t" style={{ height: '70%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Apr</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-white rounded-t" style={{ height: '50%' }}></div>
              <span className="text-xs text-gray-400 mt-2">May</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-white rounded-t" style={{ height: '75%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Jun</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-white rounded-t" style={{ height: '90%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Jul</span>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white rounded mr-2"></div>
              <span className="text-sm text-gray-300">2025</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
              <span className="text-sm text-gray-300">2024</span>
            </div>
          </div>
        </div>

        {/* Total Orders Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">PERFORMANCE Total orders</h3>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {/* Chart bars for 2025 and 2024 */}
            <div className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full bg-pink-500 rounded-t" style={{ height: '30%' }}></div>
              <div className="w-full bg-blue-500 rounded-t" style={{ height: '25%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full bg-pink-500 rounded-t" style={{ height: '45%' }}></div>
              <div className="w-full bg-blue-500 rounded-t" style={{ height: '35%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Feb</span>
            </div>
            <div className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full bg-pink-500 rounded-t" style={{ height: '60%' }}></div>
              <div className="w-full bg-blue-500 rounded-t" style={{ height: '50%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full bg-pink-500 rounded-t" style={{ height: '100%' }}></div>
              <div className="w-full bg-blue-500 rounded-t" style={{ height: '10%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Apr</span>
            </div>
            <div className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full bg-pink-500 rounded-t" style={{ height: '70%' }}></div>
              <div className="w-full bg-blue-500 rounded-t" style={{ height: '40%' }}></div>
              <span className="text-xs text-gray-400 mt-2">May</span>
            </div>
            <div className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full bg-pink-500 rounded-t" style={{ height: '55%' }}></div>
              <div className="w-full bg-blue-500 rounded-t" style={{ height: '65%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Jun</span>
            </div>
            <div className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full bg-pink-500 rounded-t" style={{ height: '10%' }}></div>
              <div className="w-full bg-blue-500 rounded-t" style={{ height: '85%' }}></div>
              <span className="text-xs text-gray-400 mt-2">Jul</span>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-pink-500 rounded mr-2"></div>
              <span className="text-sm text-gray-300">2025</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-300">2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Visits Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Page visits</h3>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                SEE ALL
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAGE NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VISITORS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIQUE USERS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BOUNCE RATE</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/argon/</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4,569</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">340</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      46,53%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/argon/index.html</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3,513</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">294</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      56,23%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/argon/charts.html</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2,050</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">147</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                      </svg>
                      24,05%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Social Traffic Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Social traffic</h3>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                SEE ALL
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REFERRAL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VISITORS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Facebook</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,480</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">60%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Google</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4,807</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">80%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Instagram</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3,678</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">75%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Twitter</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2,645</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">30%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 