import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Chart = ({ data = [], type = 'line', stacked = false }) => {
  // Process data for charts
  const processedData = data.map(item => ({
    date: dayjs(item.date).format('MMM DD'),
    plastic: item.plastic || 0,
    organic: item.organic || 0,
    paper: item.paper || 0,
    glass: item.glass || 0,
    total: (item.plastic || 0) + (item.organic || 0) + (item.paper || 0) + (item.glass || 0)
  }));

  const chartData = {
    labels: processedData.map(item => item.date),
    datasets: stacked ? [
      {
        label: 'Plastic',
        data: processedData.map(item => item.plastic),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Organic',
        data: processedData.map(item => item.organic),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        label: 'Paper',
        data: processedData.map(item => item.paper),
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 1
      },
      {
        label: 'Glass/Metal',
        data: processedData.map(item => item.glass),
        backgroundColor: 'rgba(167, 139, 250, 0.8)',
        borderColor: 'rgb(167, 139, 250)',
        borderWidth: 1
      }
    ] : [
      {
        label: 'Total Waste',
        data: processedData.map(item => item.total),
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: stacked
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + ' kg';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        stacked: stacked,
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' kg';
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available for the selected period
        </div>
      ) : (
        type === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )
      )}
    </div>
  );
};

export default Chart;