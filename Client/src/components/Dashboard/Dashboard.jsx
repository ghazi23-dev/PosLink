import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowsClockwise, 
  ClipboardText, 
  Coins, 
  CurrencyCircleDollar,
  ArrowsDownUp,
  FileXls,
  FilePdf,
  Calendar,
  CaretLeft,
  CaretRight,
  X, 
  Info
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

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState('26.04.2025');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState({ hours: '12', minutes: '00', period: 'AM' });
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null, type: null });
  const [stats, setStats] = useState({
    turnover: '374.12 DT',
    orders: '32',
    consumption: '500 DT',
    availableCash: '681.3 DT'
  });

  const [salesData, setSalesData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Average hour');
  const [showTurnoverModal, setShowTurnoverModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showConsumptionModal, setShowConsumptionModal] = useState(false);
  const [showAvailableCashModal, setShowAvailableCashModal] = useState(false);

  // Add new state for chart data based on period
  const [chartDataByPeriod, setChartDataByPeriod] = useState({
    'Average hour': [
      { label: '8AM', value: 250 },
      { label: '10AM', value: 400 },
      { label: '12PM', value: 650 },
      { label: '2PM', value: 500 },
      { label: '4PM', value: 750 },
      { label: '6PM', value: 900 },
      { label: '8PM', value: 600 },
      { label: '10PM', value: 450 }
    ],
    'Day': [
      { label: 'Mon', value: 2400 },
      { label: 'Tue', value: 3200 },
      { label: 'Wed', value: 2800 },
      { label: 'Thu', value: 3600 },
      { label: 'Fri', value: 4200 },
      { label: 'Sat', value: 4800 },
      { label: 'Sun', value: 3800 }
    ],
    'Month': [
      { label: 'Jan', value: 600 },
      { label: 'Feb', value: 800 },
      { label: 'Mar', value: 800 },
      { label: 'Apr', value: 650 },
      { label: 'May', value: 550 },
      { label: 'Jun', value: 750 },
      { label: 'Jul', value: 650 },
      { label: 'Aug', value: 850 },
      { label: 'Sep', value: 683.5 },
      { label: 'Oct', value: 800 },
      { label: 'Nov', value: 950 },
      { label: 'Dec', value: 700 }
    ],
    'Year': [
      { label: '2020', value: 45000 },
      { label: '2021', value: 52000 },
      { label: '2022', value: 61000 },
      { label: '2023', value: 85000 },
      { label: '2024', value: 72000 }
    ]
  });

  const consumptionData = [
    { id: 1, ingredient: "FLOUR", totalCost: "60.000", unitCost: "15.000", totalQuantity: 4, unit: "g" },
    { id: 2, ingredient: "THON", totalCost: "100.000", unitCost: "20.000", totalQuantity: 5, unit: "g" },
    { id: 3, ingredient: "EGGS", totalCost: "50.000", unitCost: "10.000", totalQuantity: 5, unit: "g" },
    { id: 4, ingredient: "TOMATOES", totalCost: "17.000", unitCost: "17.000", totalQuantity: 1, unit: "g" },
    { id: 5, ingredient: "PEPPERS", totalCost: "32.000", unitCost: "16.000", totalQuantity: 2, unit: "g" },
    { id: 6, ingredient: "ONIONS", totalCost: "65.000", unitCost: "13.000", totalQuantity: 5, unit: "g" },
    { id: 7, ingredient: "CHICKEN", totalCost: "40.000", unitCost: "20.000", totalQuantity: 2, unit: "g" },
  ];

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

  const turnoverPieData = [
    { name: 'Net Turnover', value: 270, color: '#22C55E' },
    { name: 'TVA', value: 200, color: '#0F172A' },
    { name: 'Discounts', value: 136, color: '#F59E0B' },
    { name: 'Offers', value: 394, color: '#FF5733' }
  ];

  const availableCashData = [
    { id: 1, category: "Cash Revenue", amount: "750 DT" },
    { id: 2, category: "Expenses", amount: "900 DT" },
    { id: 3, category: "Salary Payables", amount: "100 DT" },
    { id: 4, category: "Fond de caisse", amount: "50 DT" },
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      const storedData = getFromLocalStorage('dashboard');
      if (storedData) {
        setSalesData(storedData.sales);
        return;
      }

      const data = await loadJsonData('data/dashboard.json');
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
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 0
      },
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: false,
            padding: 10,
            font: {
              size: 11,
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
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 0
      },
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: false,
            padding: 10,
            font: {
              size: 11,
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

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Adjust for Monday start
    
    // Add previous month's days
    for (let i = 0; i < startDay; i++) {
      const prevDate = new Date(year, month, -startDay + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Add next month's days
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const handleQuickSelect = (option) => {
    const now = new Date();
    let start, end, type;
    
    switch (option) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = start;
        type = 'today';
        break;
      case 'lastWeek':
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6);
        type = 'lastWeek';
        break;
      case 'lastMonth':
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        start = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate() + 1);
        type = 'lastMonth';
        break;
      default:
        start = now;
        end = now;
        type = 'custom';
    }
    
    setSelectedRange({ start, end, type });
    setSelectedDate(formatDate(end)); // Set the visible date to the end of range
  };

  const isDateInRange = (date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const startDate = new Date(selectedRange.start.getFullYear(), selectedRange.start.getMonth(), selectedRange.start.getDate()).getTime();
    const endDate = new Date(selectedRange.end.getFullYear(), selectedRange.end.getMonth(), selectedRange.end.getDate()).getTime();
    
    return checkDate >= startDate && checkDate <= endDate;
  };

  const handleDateSelect = (date) => {
    const { hours, minutes, period } = selectedTime;
    const newDate = new Date(date);
    newDate.setHours(
      period === 'PM' ? (parseInt(hours) % 12) + 12 : parseInt(hours) % 12,
      parseInt(minutes)
    );
    
    // For custom range selection
    if (selectedRange.type === 'custom') {
      if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
        // Start new range
        setSelectedRange({ start: newDate, end: newDate, type: 'custom' });
      } else {
        // Complete the range
        const start = selectedRange.start;
        const end = newDate;
        if (end < start) {
          setSelectedRange({ start: end, end: start, type: 'custom' });
        } else {
          setSelectedRange({ start, end, type: 'custom' });
        }
      }
    } else {
      // Single date selection
      setSelectedRange({ start: newDate, end: newDate, type: 'single' });
    }
    
    setSelectedDate(formatDate(newDate));
  };

  const handleTimeChange = (type, value) => {
    setSelectedTime(prev => ({ ...prev, [type]: value }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.');
  };

  const toggleTurnoverModal = () => {
    setShowTurnoverModal(!showTurnoverModal);
  };

  const toggleConsumptionModal = () => {
    setShowConsumptionModal(!showConsumptionModal);
  };

  const toggleAvailableCashModal = () => {
    setShowAvailableCashModal(!showAvailableCashModal);
  };

  const TurnoverModal = () => {
    if (!showTurnoverModal) return null;
    
    return (
      <div className="modal-overlay" onClick={toggleTurnoverModal}>
        <div className="modal-content turnover-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">
              <span>Gross Turnover</span>
              <span className="info-icon">
                <Info size={25} weight="bold" />
              </span>
            </div>
            <button className="modal-close" onClick={toggleTurnoverModal}>
              <X size={24} />
            </button>
          </div>
          <div className="modal-body">
            <div className="modal-chart-container">
              <ResponsiveContainer width="70%" height={300}>
                <PieChart>
                  <Pie
                    data={turnoverPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                  >
                    {turnoverPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="modal-legend">
                {turnoverPieData.map((item, index) => (
                  <div key={`legend-${index}`} className="modal-legend-item">
                    <div className="legend-color" style={{ backgroundColor: item.color }} />
                    <span className="legend-label">{item.name}</span>
                    <span className="legend-value">{item.value} TND</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrdersModal = () => {
    if (!showOrdersModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowOrdersModal(false)}>
        <div className="modal-content orders-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">
              <span>Orders</span>
              <span className="info-icon">
              <Info size={25} weight="bold" />
              </span>
            </div>
            <button className="modal-close" onClick={() => setShowOrdersModal(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="modal-body">
            <div className="orders-stats">
              <div className="orders-stat-item selected">
                <h3>Total orders</h3>
                <p className="orders-stat-value">119</p>
              </div>
              <div className="orders-stat-item unselected">
                <h3>Average basket</h3>
                <p className="orders-stat-value">35.202</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ConsumptionModal = () => {
    if (!showConsumptionModal) return null;
    
    return (
      <div className="modal-overlay" onClick={toggleConsumptionModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">
              <span>Total Consumption</span>
              <span className="info-icon">
                <Info size={25} weight="bold" />
              </span>
            </div>
            <button className="modal-close" onClick={toggleConsumptionModal}>
              <X size={24} />
            </button>
          </div>
          <div className="modal-body">
            <div className="table-container">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ingredients</th>
                    <th>Total Cost</th>
                    <th>Unit Cost</th>
                    <th>Total Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {consumptionData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.ingredient}</td>
                      <td>{item.totalCost}</td>
                      <td>{item.unitCost}</td>
                      <td>{item.totalQuantity}</td>
                      <td>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <button className="see-more-btn">See More</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AvailableCashModal = () => {
    if (!showAvailableCashModal) return null;
    
    return (
      <div className="modal-overlay" onClick={toggleAvailableCashModal}>
        <div className="modal-content available-cash-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">
              <span>Available Cash</span>
              <span className="info-icon">
              <Info size={25} weight="bold" />
              </span>
            </div>
            <button className="modal-close" onClick={toggleAvailableCashModal}>
              <X size={24} />
            </button>
          </div>
          <div className="modal-body">
            <div className="cash-breakdown">
              {availableCashData.map((item) => (
                <div 
                  key={item.id} 
                  className={`cash-item ${item.id % 2 === 0 ? 'even' : 'odd'}`}
                >
                  <span className="cash-category">{item.category}</span>
                  <span className="cash-amount">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Remove the old chartData constant and add a function to get current period data
  const getCurrentChartData = () => {
    const data = chartDataByPeriod[selectedPeriod];
    return data.map(item => ({
      ...item,
      displayValue: item.label === (selectedPeriod === 'Month' ? 'Sep' : '') ? `${item.value} TND` : ''
    }));
  };

  const renderDatePickerDropdown = () => {
    if (!isDatePickerOpen) return null;

    return createPortal(
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          pointerEvents: 'none'
        }}
      >
        <div
          ref={(node) => {
            if (node) {
              const buttonRect = document.querySelector('.select-date').getBoundingClientRect();
              node.style.position = 'absolute';
              node.style.top = `${buttonRect.bottom + 8}px`;
              node.style.left = `${buttonRect.left}px`;
            }
          }}
          style={{
            position: 'absolute',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.1)',
            width: '600px',
            padding: '16px',
            display: 'flex',
            gap: '24px',
            pointerEvents: 'auto'
          }}
        >
          <div className="quick-select">
            <button 
              className={`${selectedRange.type === 'today' ? 'active' : ''} today-btn`}
              onClick={() => handleQuickSelect('today')}
            >
              Today
            </button>
            <button 
              className={selectedRange.type === 'lastWeek' ? 'active' : ''}
              onClick={() => handleQuickSelect('lastWeek')}
            >
              Last week
            </button>
            <button 
              className={selectedRange.type === 'lastMonth' ? 'active' : ''}
              onClick={() => handleQuickSelect('lastMonth')}
            >
              Last month
            </button>
            <button 
              className={selectedRange.type === 'custom' ? 'active' : ''}
              onClick={() => setSelectedRange({ start: null, end: null, type: 'custom' })}
            >
              Customized range
            </button>
          </div>

          <div className="calendar-section">
            <div className="calendar-header">
              <button 
                className="nav-btn"
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              >
                <CaretLeft weight="bold" />
              </button>
              <span className="current-month">
                {MONTHS[currentDate.getMonth()]}
              </span>
              <button 
                className="nav-btn"
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              >
                <CaretRight weight="bold" />
              </button>
            </div>

            <div className="calendar-grid">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="calendar-day-header">{day}</div>
              ))}
              {generateCalendarDays().map(({ date, isCurrentMonth }, index) => (
                <button
                  key={index}
                  className={`calendar-day 
                    ${!isCurrentMonth ? 'other-month' : ''} 
                    ${isDateInRange(date) ? 'in-range' : ''} 
                    ${formatDate(date) === selectedDate ? 'selected' : ''}
                    ${selectedRange.start && formatDate(date) === formatDate(selectedRange.start) ? 'range-start' : ''}
                    ${selectedRange.end && formatDate(date) === formatDate(selectedRange.end) ? 'range-end' : ''}
                  `}
                  onClick={() => handleDateSelect(date)}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>

            <div className="time-selector">
              <span>Time:</span>
              <div className="time-inputs">
                <select 
                  value={selectedTime.hours}
                  onChange={(e) => handleTimeChange('hours', e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                    <option key={hour} value={hour.toString().padStart(2, '0')}>
                      {hour.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <span>:</span>
                <select 
                  value={selectedTime.minutes}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
                >
                  {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                    <option key={minute} value={minute.toString().padStart(2, '0')}>
                      {minute.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select 
                  value={selectedTime.period}
                  onChange={(e) => handleTimeChange('period', e.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <button className="apply-btn" onClick={() => setIsDatePickerOpen(false)}>Apply</button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="dashboard">
      <div className="top-section-wrapper">
        <div className="dashboard-header">
          <div className="period-section">
            <h2>Period</h2>
            <p className="period-description">Choose the date range to show information on the dashboard</p>
            <div className="date-picker-container">
              <div 
                className="select-date" 
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  minWidth: '200px'
                }}
              >
                <Calendar size={20} weight="fill" className="calendar-icon" />
                <span className="date-text">Select a date</span>
                <span className="selected-date">{selectedDate}</span>
              </div>
              {renderDatePickerDropdown()}
            </div>
          </div>
          <div className="export-section">
            <p className="export-description">Download the displayed data as an Excel or PDF file</p>
            <div className="button-group">
              <button className="export-btn excel">
                <FileXls weight="fill" />
                Export Excel
              </button>
              <button className="export-btn pdf" style={{backgroundColor: '#FFFFFF'}}>
                <FilePdf weight="fill" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card" onClick={toggleTurnoverModal}>
            <div className="stat-icon">
              <ArrowsClockwise size={20} />
            </div>
            <div className="stat-content">
              <h3>Turnover</h3>
              <p className="stat-value">374.12<span className="unit">DT</span></p>
            </div>
          </div>
          
          <div className="stat-card" onClick={toggleAvailableCashModal}>
            <div className="stat-icon">
              <CurrencyCircleDollar size={20} />
            </div>
            <div className="stat-content">
              <h3>Available Cash</h3>
              <p className="stat-value">681.3<span className="unit">DT</span></p>
            </div>
          </div>

          <div className="stat-card" onClick={() => setShowOrdersModal(true)}>
            <div className="stat-icon">
              <ClipboardText size={20} />
            </div>
            <div className="stat-content">
              <h3>Number of orders</h3>
              <p className="stat-value">32</p>
            </div>
          </div>

          <div className="stat-card" onClick={toggleConsumptionModal}>
            <div className="stat-icon">
              <Coins size={20} />
            </div>
            <div className="stat-content">
              <h3>Total Consumption</h3>
              <p className="stat-value">500<span className="unit">DT</span></p>
            </div>
          </div>
        </div>
      </div>
      <div className="sales-section">
        <div className="sales-header">
          <h2>View Sales Details</h2>
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
            {selectedDate}
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart 
              data={getCurrentChartData()} 
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              barSize={19}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis 
                dataKey="label" 
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
                {getCurrentChartData().map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.label === (selectedPeriod === 'Month' ? 'Sep' : '') ? '#E30521' : '#D1E6FF'} 
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

      {/* <div className="chart-section empty-section">
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
            {selectedDate}
          </div>
        </div>
        <div className="chart-container">
          <div className="no-data">
            <img src="NoDataFounda.png" alt="No data found" />
            <p>No data was found</p>
          </div>
        </div>
      </div> */}

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

      <TurnoverModal />
      <OrdersModal />
      <ConsumptionModal />
      <AvailableCashModal />
    </div>
  );
};

export default Dashboard;