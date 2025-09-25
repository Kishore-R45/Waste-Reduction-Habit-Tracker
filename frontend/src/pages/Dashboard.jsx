import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LogForm from '../components/LogForm';
import Chart from '../components/Chart';
import EcoTips from '../components/EcoTips';
import { FiTrendingDown, FiAward, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's log
      try {
        const logResponse = await api.get(`/api/waste-log/${user._id}?date=${today}`);
        setTodayLog(logResponse.data.log);
      } catch (error) {
        console.log('No log for today yet');
        setTodayLog(null);
      }
      
      // Fetch weekly stats
      try {
        const statsResponse = await api.get(`/api/waste-stats/${user._id}?range=7`);
        setWeeklyStats(statsResponse.data);
      } catch (error) {
        console.log('Error fetching stats:', error);
        // Set default stats if API fails
        setWeeklyStats({
          reductionPercent: 0,
          streak: 0,
          dailyData: [],
          totals: {
            plastic: 0,
            organic: 0,
            paper: 0,
            glass: 0
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (data) => {
    try {
      await api.post('/api/waste-log', data);
      toast.success('Waste log saved successfully!');
      fetchDashboardData(); // Refresh data after saving
    } catch (error) {
      console.error('Error saving waste log:', error);
      toast.error('Failed to save waste log');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Safe access with default values
  const reductionPercent = weeklyStats?.reductionPercent || 0;
  const userScore = user?.reductionScore || 0;
  const streak = weeklyStats?.streak || 0;
  const dailyData = weeklyStats?.dailyData || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 🌱</h1>
        <p className="opacity-90">Track your waste, make an impact!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Weekly Reduction</p>
              <p className="text-2xl font-bold text-primary">
                {reductionPercent.toFixed(1)}%
              </p>
            </div>
            <FiTrendingDown className="h-8 w-8 text-primary opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Eco Score</p>
              <p className="text-2xl font-bold text-secondary">
                {userScore}
              </p>
            </div>
            <FiAward className="h-8 w-8 text-secondary opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Streak</p>
              <p className="text-2xl font-bold text-orange-500">
                {streak} days
              </p>
            </div>
            <FiActivity className="h-8 w-8 text-orange-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Form */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Log Today's Waste</h2>
          <LogForm onSubmit={handleLogSubmit} initialData={todayLog} />
        </div>

        {/* Weekly Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">This Week's Progress</h2>
          <Chart data={dailyData} />
        </div>
      </div>

      {/* Quick Summary */}
      {weeklyStats?.totals && (
        <div className="card bg-gradient-to-r from-blue-50 to-green-50">
          <h3 className="text-lg font-semibold mb-3">This Week's Totals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl">🥤</p>
              <p className="text-sm text-gray-600">Plastic</p>
              <p className="font-bold">{weeklyStats.totals.plastic?.toFixed(1) || 0} kg</p>
            </div>
            <div className="text-center">
              <p className="text-3xl">🥗</p>
              <p className="text-sm text-gray-600">Organic</p>
              <p className="font-bold">{weeklyStats.totals.organic?.toFixed(1) || 0} kg</p>
            </div>
            <div className="text-center">
              <p className="text-3xl">📄</p>
              <p className="text-sm text-gray-600">Paper</p>
              <p className="font-bold">{weeklyStats.totals.paper?.toFixed(1) || 0} kg</p>
            </div>
            <div className="text-center">
              <p className="text-3xl">🍾</p>
              <p className="text-sm text-gray-600">Glass/Metal</p>
              <p className="font-bold">{weeklyStats.totals.glass?.toFixed(1) || 0} kg</p>
            </div>
          </div>
        </div>
      )}

      {/* Eco Tips */}
      <EcoTips userId={user?._id} />
    </div>
  );
};

export default Dashboard;