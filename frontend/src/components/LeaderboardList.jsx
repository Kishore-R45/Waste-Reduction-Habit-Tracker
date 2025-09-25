import React from 'react';
import { FaTrophy, FaAward ,FaMedal} from 'react-icons/fa';

const LeaderboardList = ({ users = [], currentUserId }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-500" />;
      case 2:
        return <FaMedal className="text-gray-400" />;
      case 3:
        return <FaAward className="text-orange-600" />;
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500';
    return 'bg-gray-200';
  };

  if (users.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No leaderboard data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user, index) => {
        const rank = index + 1;
        const isCurrentUser = user._id === currentUserId;
        
        return (
          <div
            key={user._id}
            className={`card transition-all hover:shadow-lg ${
              isCurrentUser ? 'ring-2 ring-primary ring-opacity-50 bg-green-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full ${getRankBadge(rank)} flex items-center justify-center text-white`}>
                  {getRankIcon(rank)}
                </div>
                
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {user.reductionScore || 0}
                </p>
                <p className="text-xs text-gray-500">Score</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardList;