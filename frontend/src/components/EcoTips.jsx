import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import {FaLightbulb} from 'react-icons/fa';
import api from '../api/axios';

const EcoTips = ({ userId }) => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchTips();
    }
  }, [userId]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/suggestions/${userId}`);
      setTips(response.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching tips:', error);
      // Set default tips on error
      setTips([
        {
          category: 'general',
          text: 'Start tracking your waste today to get personalized tips!',
          priority: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const getCategoryColor = (category) => {
    const colors = {
      plastic: 'bg-blue-100 text-blue-700',
      organic: 'bg-green-100 text-green-700',
      paper: 'bg-yellow-100 text-yellow-700',
      glass: 'bg-purple-100 text-purple-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.general;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      plastic: '🥤',
      organic: '🥗',
      paper: '📄',
      glass: '🍾',
      general: '💡'
    };
    return icons[category] || icons.general;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (tips.length === 0) {
    return null;
  }

  const currentTip = tips[currentTipIndex];

  return (
    <div className="card bg-gradient-to-r from-green-50 to-blue-50">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <FaLightbulb className="text-yellow-500 mr-2" />
          <h2 className="text-xl font-semibold">Eco Tips</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchTips}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            title="Refresh tips"
          >
            <FiRefreshCw className="h-4 w-4" />
          </button>
          {tips.length > 1 && (
            <button
              onClick={nextTip}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
              title="Next tip"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{getCategoryIcon(currentTip.category)}</span>
          <div className="flex-1">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getCategoryColor(currentTip.category)}`}>
              {currentTip.category.toUpperCase()}
            </span>
            <p className="text-gray-700">{currentTip.text}</p>
          </div>
        </div>
      </div>

      {tips.length > 1 && (
        <div className="flex justify-center mt-3 space-x-1">
          {tips.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTipIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTipIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EcoTips;