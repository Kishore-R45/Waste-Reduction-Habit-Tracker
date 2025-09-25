import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LeaderboardList from '../components/LeaderboardList';
import { FiUsers, FiRefreshCw } from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/leaderboard?page=${page}&limit=10`);
      
      console.log('Leaderboard response:', response.data); // Debug log
      
      if (response.data.success) {
        setLeaderboard(response.data.leaderboard || []);
        setUserRank(response.data.userRank);
        setTotalPages(response.data.totalPages || 1);
        setTotalUsers(response.data.totalUsers || 0);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
      // Set empty state on error
      setLeaderboard([]);
      setUserRank(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLeaderboard();
    toast.success('Leaderboard refreshed');
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
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <FaTrophy className="mr-2" />
              Leaderboard
            </h1>
            <p className="opacity-90">
              Compete with {totalUsers} users in waste reduction!
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Refresh leaderboard"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <FiUsers className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalUsers}</p>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
        
        {userRank && (
          <>
            <div className="card text-center bg-gradient-to-r from-primary/10 to-secondary/10">
              <p className="text-sm text-gray-600">Your Rank</p>
              <p className="text-3xl font-bold text-primary">#{userRank.rank}</p>
              <p className="text-sm text-gray-600">out of {totalUsers}</p>
            </div>
            
            <div className="card text-center">
              <p className="text-sm text-gray-600">Your Score</p>
              <p className="text-3xl font-bold text-secondary">{userRank.score}</p>
              <p className="text-sm text-gray-600">points</p>
            </div>
          </>
        )}
      </div>

      {/* Leaderboard List */}
      {leaderboard.length > 0 ? (
        <>
          <LeaderboardList users={leaderboard} currentUserId={user?._id} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <FaTrophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Leaderboard Data Yet</h3>
          <p className="text-gray-500 mb-4">
            {totalUsers < 2 
              ? "At least 2 users needed to show leaderboard rankings."
              : "Start logging your waste to appear on the leaderboard!"}
          </p>
          <button
            onClick={handleRefresh}
            className="btn-primary"
          >
            Refresh Leaderboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;