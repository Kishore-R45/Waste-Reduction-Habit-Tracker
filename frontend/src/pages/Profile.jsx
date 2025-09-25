import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FiUser, FiMail, FiCalendar, FiAward, FiTrendingDown, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Fetch user stats
      const statsResponse = await api.get(`/api/waste-stats/${user._id}?range=30`);
      setStats(statsResponse.data);
      
      // Fetch achievements
      const achievementsResponse = await api.get(`/api/achievements/${user._id}`);
      setAchievements(achievementsResponse.data.achievements || []);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // Only include password fields if user wants to change password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await api.put('/api/auth/profile', updateData);
      toast.success('Profile updated successfully');
      setEditMode(false);
      checkAuth(); // Refresh user data
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleExportData = async () => {
    try {
      const response = await api.get('/api/export/user-data', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `waste-data-${dayjs().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
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
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      {/* Profile Information */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-primary hover:text-green-700"
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Change Password (Optional)</h3>
              
              <div className="space-y-3">
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Current Password"
                  className="input-field"
                />
                
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="input-field"
                />
                
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center"
              >
                <FiSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center">
              <FiUser className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FiMail className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FiCalendar className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">{dayjs(user?.createdAt).format('MMMM D, YYYY')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Waste Logged</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.totalWaste?.toFixed(1) || 0} kg
                </p>
              </div>
              <FiTrendingDown className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reduction Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {user?.reductionScore || 0}
                </p>
              </div>
              <FiAward className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Days Active</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.activeDays || 0}
                </p>
              </div>
              <FiCalendar className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-lg ${
                  achievement.unlocked ? 'bg-yellow-50' : 'bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-sm font-medium">{achievement.name}</p>
                <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No achievements yet. Keep logging your waste!</p>
        )}
      </div>

      {/* Data Export */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Export your waste tracking data</p>
            <p className="text-sm text-gray-500">Download your data in CSV format</p>
          </div>
          <button
            onClick={handleExportData}
            className="btn-secondary"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;