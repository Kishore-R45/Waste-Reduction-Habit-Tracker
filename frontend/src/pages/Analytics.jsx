import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Chart from '../components/Chart';
import dayjs from 'dayjs';

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchStats();
    }
  }, [timeRange, user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/waste-stats/${user._id}?range=${timeRange}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values on error
      setStats({
        totals: { plastic: 0, organic: 0, paper: 0, glass: 0 },
        comparison: { plastic: 0, organic: 0, paper: 0, glass: 0 },
        reductionPercent: 0,
        bestCategory: 'N/A',
        worstCategory: 'N/A',
        dailyData: []
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (data) => {
    if (!data || !Array.isArray(data)) return 0;
    return data.reduce((sum, day) => {
      const dayTotal = (day?.plastic || 0) + (day?.organic || 0) + 
                      (day?.paper || 0) + (day?.glass || 0);
      return sum + dayTotal;
    }, 0);
  };

  // Helper function to safely access numeric values
  const safeNumber = (value, decimals = 1) => {
    const num = parseFloat(value) || 0;
    return num.toFixed(decimals);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <h3 className="text-sm text-gray-600 mb-1">Total Plastic</h3>
          <p className="text-2xl font-bold text-blue-600">
            {safeNumber(stats?.totals?.plastic)} kg
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.comparison?.plastic > 0 ? '↑' : '↓'} 
            {safeNumber(Math.abs(stats?.comparison?.plastic || 0))}% vs prev period
          </p>
        </div>

        <div className="card bg-green-50">
          <h3 className="text-sm text-gray-600 mb-1">Total Organic</h3>
          <p className="text-2xl font-bold text-green-600">
            {safeNumber(stats?.totals?.organic)} kg
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.comparison?.organic > 0 ? '↑' : '↓'} 
            {safeNumber(Math.abs(stats?.comparison?.organic || 0))}% vs prev period
          </p>
        </div>

        <div className="card bg-yellow-50">
          <h3 className="text-sm text-gray-600 mb-1">Total Paper</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {safeNumber(stats?.totals?.paper)} kg
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.comparison?.paper > 0 ? '↑' : '↓'} 
            {safeNumber(Math.abs(stats?.comparison?.paper || 0))}% vs prev period
          </p>
        </div>

        <div className="card bg-purple-50">
          <h3 className="text-sm text-gray-600 mb-1">Total Glass/Metal</h3>
          <p className="text-2xl font-bold text-purple-600">
            {safeNumber(stats?.totals?.glass)} kg
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.comparison?.glass > 0 ? '↑' : '↓'} 
            {safeNumber(Math.abs(stats?.comparison?.glass || 0))}% vs prev period
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Waste Trend</h2>
          <Chart data={stats?.dailyData || []} type="line" />
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <Chart data={stats?.dailyData || []} type="bar" stacked={true} />
        </div>
      </div>

      {/* Insights */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="text-2xl mr-3">📉</span>
            <div>
              <p className="font-medium">Total Reduction</p>
              <p className="text-sm text-gray-600">
                You've reduced your waste by {safeNumber(stats?.reductionPercent || 0)}% this period!
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">🏆</span>
            <div>
              <p className="font-medium">Best Category</p>
              <p className="text-sm text-gray-600">
                Your best improvement is in {stats?.bestCategory || 'N/A'} waste
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">🎯</span>
            <div>
              <p className="font-medium">Focus Area</p>
              <p className="text-sm text-gray-600">
                Consider reducing {stats?.worstCategory || 'N/A'} waste for better impact
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;