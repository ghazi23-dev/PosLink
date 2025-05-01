import { useState, useEffect } from 'react';
import { 
  ArrowsClockwise, 
  ClipboardText, 
  Coins, 
  CurrencyCircleDollar,
  ArrowsDownUp,
  FileXls,
  FilePdf,
  Calendar
} from '@phosphor-icons/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LabelList,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { loadJsonData, getFromLocalStorage } from '../../utils/jsonUtils';
import './Dashboard.css';
import { Doughnut, Pie as ChartPie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend as ChartLegend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, ChartLegend);

const NoDataIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.8">
      <path d="M82.5 37.5H97.5L120 60V97.5C120 109.926 109.926 120 97.5 120H22.5C10.074 120 0 109.926 0 97.5V22.5C0 10.074 10.074 0 22.5 0H60L82.5 22.5V37.5Z" fill="#F1F5F9"/>
      <path d="M82.5 37.5H97.5L75 15V30C75 34.1421 78.3579 37.5 82.5 37.5Z" fill="#E2E8F0"/>
      <path d="M60 67.5C60 74.4036 54.4036 80 47.5 80C40.5964 80 35 74.4036 35 67.5C35 60.5964 40.5964 55 47.5 55C54.4036 55 60 60.5964 60 67.5Z" stroke="#94A3B8" strokeWidth="3"/>
      <path d="M85 95L57.5 67.5" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </svg>
);

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('03/12/2024 08:00AM - 04/12/2024 07:59PM');
  const [stats, setStats] = useState({
    turnover: '374.12 DT',
    orders: '32',
    consumption: '500 DT',
    availableCash: '681.3 DT'
  });

  const [salesData, setSalesData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Average hour');

  const chartData = [
    { month: 'Jan', value: 600 },
    { month: 'Feb', value: 800 },
    { month: 'Mar', value: 800 },
    { month: 'Apr', value: 650 },
    { month: 'May', value: 550 },
    { month: 'Jun', value: 750 },
    { month: 'Jul', value: 650 },
    { month: 'Aug', value: 850 },
    { month: 'Sep', value: 683.5 },
    { month: 'Oct', value: 800 },
    { month: 'Nov', value: 950 },
    { month: 'Dec', value: 0 }
  ].map(item => ({
    ...item,
    displayValue: item.month === 'Sep' ? `${item.value} TND` : ''
  }));

  const paymentMethodData = [
    { name: 'Cash', value: 576, color: '#FF5733' },
    { name: 'Check', value: 250, color: '#22C55E' },
    { name: 'TPE', value: 174, color: '#7C3AED' }
  ];

  const salesPerUserData = [
    { name: 'Manager1', value: 150, color: '#DC2626' },
    { name: 'Manager2', value: 250, color: '#FB923C' },
    { name: 'Waiter1', value: 150, color: '#22C55E' },
    { name: 'Waiter2', value: 200, color: '#1E293B' },
    { name: 'Waiter3', value: 200, color: '#7C3AED' },
    { name: 'Waiter4', value: 50, color: '#F59E0B' }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      const storedData = getFromLocalStorage('dashboard');
      if (storedData) {
        setSalesData(storedData.sales);
        return;
      }

      const data = await loadJsonData('/src/data/dashboard.json');
      if (data) {
        setSalesData(data.sales || []);
      }
    };

    loadDashboardData();
  }, []);

  const handleExportExcel = () => {
    // Implement Excel export functionality
    console.log('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    // Implement PDF export functionality
    console.log('Exporting to PDF...');
  };

  const renderCustomLabel = (props) => {
    const { x, y, value } = props;
    if (!value) return null;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <rect
          x={-35}
          y={-30}
          width={70}
          height={22}
          rx={8}
          fill="white"
          filter="drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.1))"
          stroke="#E2E8F0"
          strokeWidth={1}
        />
        <text
          x={0}
          y={-16}
          textAnchor="middle"
          fill="#1E293B"
          fontSize={12}
          fontWeight={500}
        >
          {value}
        </text>
      </g>
    );
  };

  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="custom-legend">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: entry.payload.color }} />
            <div className="legend-text">
              <span>{entry.value}</span>
              <span className="legend-value">{entry.payload.value} TND</span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const paymentMethodsConfig = {
    data: {
      labels: ['Cash', 'Check', 'TPE'],
      datasets: [{
        data: [576, 250, 174],
        backgroundColor: ['#FF5733', '#22C55E', '#7C3AED'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: false,
            padding: 15,
            font: {
              size: 14,
              weight: 500
            },
            generateLabels: (chart) => {
              const data = chart.data;
              return data.labels.map((label, i) => ({
                text: `${label}\n${data.datasets[0].data[i]} TND`,
                fillStyle: data.datasets[0].backgroundColor[i],
                index: i
              }));
            }
          }
        }
      }
    }
  };

  const salesPerUserConfig = {
    data: {
      labels: ['Manager1', 'Manager2', 'Waiter1', 'Waiter2', 'Waiter3', 'Waiter4'],
      datasets: [{
        data: [150, 250, 150, 200, 200, 50],
        backgroundColor: ['#DC2626', '#FB923C', '#22C55E', '#1E293B', '#7C3AED', '#F59E0B'],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: false,
            padding: 15,
            font: {
              size: 14,
              weight: 500
            },
            generateLabels: (chart) => {
              const data = chart.data;
              return data.labels.map((label, i) => ({
                text: `${label}\n${data.datasets[0].data[i]} TND`,
                fillStyle: data.datasets[0].backgroundColor[i],
                index: i
              }));
            }
          }
        }
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="period-section">
          <h2>Period</h2>
          <p className="period-description">Choose the date range to show information on the dashboard</p>
          <div className="date-picker">
            <input 
              type="text" 
              value={dateRange} 
              readOnly
              className="date-input"
            />
            <Calendar className="calendar-icon" weight="fill" />
          </div>
        </div>
        <div className="export-section">
          <p className="export-description">Download the displayed data as an Excel or PDF file</p>
          <div className="button-group">
            <button className="export-btn excel">
              <FileXls weight="fill" />
              Export Excel
            </button>
            <button className="export-btn pdf">
              <FilePdf weight="fill" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>
              <ArrowsClockwise weight="fill" className="stat-icon" />
              Turnover
            </h3>
            <p className="stat-value">{stats.turnover}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <h3>
              <ClipboardText weight="fill" className="stat-icon" />
              Number of orders
            </h3>
            <p className="stat-value">{stats.orders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>
              <Coins weight="fill" className="stat-icon" />
              Total Consumption
            </h3>
            <p className="stat-value">{stats.consumption}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>
              <CurrencyCircleDollar weight="fill" className="stat-icon" />
              Available Cash
            </h3>
            <p className="stat-value">{stats.availableCash}</p>
          </div>
        </div>
      </div>

      <div className="sales-section">
        <div className="sales-header">
          <h2>Sales Details</h2>
          <button className="sort-btn">
            <ArrowsDownUp weight="fill" />
            Sort by
          </button>
        </div>
        <div className="table-container">
          <table className="sales-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Total Cost(TND)</th>
                <th>Total Revenue(TND)</th>
                <th>Total Gain(TND)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{sale.name}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.totalCost}</td>
                  <td>{sale.totalRevenue}</td>
                  <td>{sale.totalGain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <button className="see-more-btn">See More</button>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <div className="chart-title">
            <h2>Net turnover</h2>
            <div className="rev-label">REV (TND)</div>
          </div>
          <div className="period-tabs">
            <button 
              className={selectedPeriod === 'Average hour' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('Average hour')}
            >
              Average hour
            </button>
            <button 
              className={selectedPeriod === 'Day' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('Day')}
            >
              Day
            </button>
            <button 
              className={selectedPeriod === 'Month' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('Month')}
            >
              Month
            </button>
            <button 
              className={selectedPeriod === 'Year' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('Year')}
            >
              Year
            </button>
          </div>
          <div className="chart-date-range">
            {dateRange}
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 20, left: 0, bottom: 5,  }}
              barSize={19}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                interval={0}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                tickCount={6}
              />
              <Bar 
                dataKey="value"
                radius={[4, 4, 4, 4]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.month === 'Sep' ? '#1E293B' : '#D1E6FF'} 
                  />
                ))}
                <LabelList
                  dataKey="displayValue"
                  position="top"
                  content={renderCustomLabel}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-section empty-section">
        <div className="chart-header">
          <div className="chart-title">
            <h2>Empty Section</h2>
          </div>
          <div className="period-tabs">
            <button 
              className={selectedPeriod === 'Average hour' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('Average hour')}
            >
              Average hour
            </button>
            <button 
              className={selectedPeriod === 'Day' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('Day')}
            >
              Day
            </button>
            <button 
              className={selectedPeriod === 'Month' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('Month')}
            >
              Month
            </button>
            <button 
              className={selectedPeriod === 'Year' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('Year')}
            >
              Year
            </button>
          </div>
          <div className="chart-date-range">
            {dateRange}
          </div>
        </div>
        <div className="chart-container">
          <div className="no-data">
            <img src="NoDataFounda.png" alt="No data found" />
            <p>No data was found</p>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-section pie-chart">
          <div className="chart-header">
            <h2>Turnover By Payment Methods</h2>
          </div>
          <div className="chart-container">
            <Doughnut {...paymentMethodsConfig} />
          </div>
        </div>

        <div className="chart-section pie-chart">
          <div className="chart-header">
            <h2>Product Sales Per User</h2>
          </div>
          <div className="chart-container">
            <ChartPie {...salesPerUserConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 