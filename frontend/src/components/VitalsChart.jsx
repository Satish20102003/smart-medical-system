import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

const VitalsChart = ({ vitals = [] }) => {
  // Sort data by date ascending for the chart timeline
  const sortedVitals = useMemo(() => {
    return [...vitals].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [vitals]);

  const chartData = useMemo(() => {
    return {
      labels: sortedVitals.map(v => new Date(v.createdAt).toLocaleDateString()),
      datasets: [
        {
          label: 'Sugar (mg/dL)',
          data: sortedVitals.map(v => v.sugar),
          borderColor: '#4F46E5', // Primary Blue
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          yAxisID: 'y1',
          tension: 0.3,
        },
        {
          label: 'Heart Rate (bpm)',
          data: sortedVitals.map(v => v.heartRate),
          borderColor: '#10B981', // Success Green
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          yAxisID: 'y2',
          tension: 0.3,
        },
      ],
    };
  }, [sortedVitals]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Health Metrics Trend' },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Sugar (mg/dL)' },
        suggestedMin: 60,
        suggestedMax: 160,
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Heart Rate (bpm)' },
        grid: { drawOnChartArea: false }, // Only draw grid lines for the left axis
        suggestedMin: 60,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 h-[350px]">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default VitalsChart;