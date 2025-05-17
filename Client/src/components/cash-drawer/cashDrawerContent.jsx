import React, { useState } from 'react';
import {
  MagnifyingGlass,
  FunnelSimple,
  CaretLeft,
  CaretRight,
  Money,
  CreditCard,
  Ticket,
  Coins
} from '@phosphor-icons/react';
import './cashDrawerContent.css';

const CashDrawerContent = () => {
  // Remplacer les transactions dynamiques par des valeurs statiques
  const [transactions] = useState([
    { id: 1, hour: '09:30 AM', user: 'John Doe', operation: 'Sale', description: 'Table #5', amount: 45.00 },
    { id: 2, hour: '10:15 AM', user: 'Jane Smith', operation: 'Refund', description: 'Order #142', amount: -15.50 },
    { id: 3, hour: '11:45 AM', user: 'Mike Johnson', operation: 'Sale', description: 'Table #8', amount: 60.00 },
    { id: 4, hour: '12:30 PM', user: 'Sarah Williams', operation: 'Expense', description: 'Supplies', amount: -25.00 },
    { id: 5, hour: '02:00 PM', user: 'David Brown', operation: 'Sale', description: 'Table #3', amount: 55.75 },
    { id: 6, hour: '03:15 PM', user: 'Emma Wilson', operation: 'Sale', description: 'Table #7', amount: 42.00 },
    { id: 7, hour: '04:30 PM', user: 'James Taylor', operation: 'Sale', description: 'Table #1', amount: 38.50 },
    { id: 8, hour: '05:45 PM', user: 'Olivia Brown', operation: 'Sale', description: 'Table #2', amount: 72.25 },
    { id: 9, hour: '07:00 PM', user: 'William Clark', operation: 'Withdrawal', description: 'Owner', amount: -100.00 },
    { id: 10, hour: '08:15 PM', user: 'Sophia Martinez', operation: 'Sale', description: 'Table #4', amount: 65.00 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const stats = [
    { 
      value: '1224', 
      unit: 'DT',
      description: 'Total collected',
      icon: <Coins size={24} weight="duotone" />
    },
    { 
      value: '824.5', 
      unit: 'DT',
      description: 'Cash',
      icon: <Money size={24} weight="duotone" />
    },
    { 
      value: '125.1', 
      unit: 'DT',
      description: 'Credit card',
      icon: <CreditCard size={24} weight="duotone" />
    },
    { 
      value: '33', 
      unit: '',
      description: 'Restaurant tickets',
      icon: <Ticket size={24} weight="duotone" />
    }
  ];

  const filterOptions = [
    { value: 'All', label: 'All' },
    { value: 'Sale', label: 'Sales' },
    { value: 'Refund', label: 'Refunds' },
    { value: 'Expense', label: 'Expenses' },
    { value: 'Withdrawal', label: 'Withdrawals' }
  ];

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const filteredTransactions = transactions.filter(t =>
    (selectedFilter === 'All' || t.operation === selectedFilter) &&
    (
      t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="cdw-cashdrawer">
      <div className="cdw-cashdrawer-content">
        {/* Statistics */}
        <div className="cdw-stats-cards">
          {stats.map((stat, index) => (
            <div key={index} className="cdw-stat-card">
              <div className="cdw-stat-icon">{stat.icon}</div>
              <div className="cdw-stat-info">
                <div className="cdw-stat-value">
                  {stat.value}
                  {stat.unit && <span className="cdw-stat-unit">{stat.unit}</span>}
                </div>
                <div className="cdw-stat-description">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and filter */}
        <div className="cdw-cashdrawer-controls">
          <div className="cdw-search-box">
            <MagnifyingGlass size={20} className="cdw-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="cdw-filter-dropdown">
            <div className="cdw-filter-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <FunnelSimple size={18} /> {filterOptions.find(option => option.value === selectedFilter)?.label || 'All'}
            </div>
            {isFilterOpen && (
              <div className="cdw-filter-menu">
                {filterOptions.map(option => (
                  <div
                    key={option.value}
                    className={`cdw-filter-option ${selectedFilter === option.value ? 'selected' : ''}`}
                    onClick={() => handleFilterSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transactions table */}
        <div className="cdw-cashdrawer-list-container">
          <table className="cdw-data-table">
            <thead>
              <tr>
                <th>Hour</th>
                <th>User</th>
                <th>Operation</th>
                <th>Description</th>
                <th>Amount (DT)</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map(t => (
                  <tr key={t.id}>
                    <td>{t.hour}</td>
                    <td>{t.user}</td>
                    <td>{t.operation}</td>
                    <td>{t.description}</td>
                    <td className={t.amount >= 0 ? 'cdw-positive' : 'cdw-negative'}>
                      {t.amount.toFixed(2)} DT
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="cdw-no-data">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="cdw-pagination-container">
          <button
            className="cdw-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`cdw-pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="cdw-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashDrawerContent;
