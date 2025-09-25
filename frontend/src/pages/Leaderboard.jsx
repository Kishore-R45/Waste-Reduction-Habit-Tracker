import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LeaderboardList from '../components/LeaderboardList';
import api from '../api/axios';
import { FiAward, FiUsers } from 'react-icons/fi';

function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/leaderboard?page=${page}&limit=10`);
      setLeaderboard(data.leaderboard);
      setUserRank(data.userRank);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <FiAward />
              <span>Leaderboard</span>
            </h1>
            <p className="mt-2 opacity-90">See how you rank among waste reducers!</p>
          </div>
          {userRank && (
            <div className="text-center">
              <p className="text-3xl font-bold">#{userRank.position}</p>
              <p className="text-sm opacity-90">Your Rank</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <FiUsers className="text-3xl text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{leaderboard.length}</p>
          <p className="text-gray-600">Active Users</p>
        </div>
        
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">
            {leaderboard[0]?.reductionScore?.toFixed(0) || 0}
          </p>
          <p className="text-gray-600">Top Score</p>
        </div>
        
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary">
            {user.reductionScore?.toFixed(0) || 0}
          </p>
          <p className="text-gray-600">Your Score</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <LeaderboardList leaderboard={leaderboard} currentUserId={user._id} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Motivation Card */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-2 border-primary">
        <h3 className="text-lg font-semibold mb-2">🌟 Keep Going!</h3>
        <p className="text-gray-700">
          Every kilogram of waste you reduce makes a difference. Challenge yourself to beat your personal best and climb the leaderboard!
        </p>
      </div>
    </div>
  );
}

export default Leaderboard;