import React, { useState } from 'react';
import {
  DotsThree,
  MagnifyingGlass,
  FunnelSimple,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react';
import { MoreVertical } from 'lucide-react';

import './tableContent.css';
import { DotsThreeVertical } from '@phosphor-icons/react';


const TableManagement = () => {
  const [tables] = useState([
    { id: 1, hour: '12:30 PM', space: 'Indoor', user: 'John Doe', price: 45.00 },
    { id: 2, hour: '01:15 PM', space: 'Outdoor', user: 'Jane Smith', price: 35.50 },
    { id: 3, hour: '02:45 PM', space: 'Indoor', user: 'Mike Johnson', price: 50.00 },
    { id: 4, hour: '03:30 PM', space: 'Outdoor', user: 'Sarah Williams', price: 40.00 },
    { id: 5, hour: '04:00 PM', space: 'Indoor', user: 'David Brown', price: 55.75 },
    { id: 6, hour: '05:15 PM', space: 'Outdoor', user: 'Emma Wilson', price: 42.00 },
    { id: 7, hour: '06:30 PM', space: 'Indoor', user: 'James Taylor', price: 60.25 },
    { id: 8, hour: '07:45 PM', space: 'Outdoor', user: 'Olivia Brown', price: 38.50 },
    { id: 9, hour: '08:00 PM', space: 'Indoor', user: 'William Clark', price: 52.75 },
    { id: 10, hour: '09:15 PM', space: 'Outdoor', user: 'Sophia Martinez', price: 45.00 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const stats = [
    { value: '2445 DT', description: 'Total revenue' },
    { value: '2', description: 'Tables currently occupied' },
    { value: '12', description: 'Recent changes' }
  ];

  const filterOptions = [
    { value: 'All', label: 'All' },
    { value: 'Indoor', label: 'Indoor' },
    { value: 'Outdoor', label: 'Outdoor' }
  ];

  const handleActionClick = (tableId, action) => {
    console.log(`Action ${action} clicked for table ${tableId}`);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const filteredTables = tables.filter(table => {
    const matchesSearch = 
      table.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.space.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.hour.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.id.toString().includes(searchQuery);
    
    const matchesSpace = selectedFilter === 'All' || table.space === selectedFilter;
    
    return matchesSearch && matchesSpace;
  });

  const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
  const currentTables = filteredTables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="tc-tables-container">
      <div className="tc-stats-cards">
        {stats.map((stat, index) => (
          <div key={index} className="tc-stat-card">
            <div className="tc-stat-value">{stat.value}</div>
            <div className="tc-stat-description">{stat.description}</div>
          </div>
        ))}
      </div>

      <div className="tc-table-controls tc-flex tc-mb-10 tc-justify-between">
        <div className="tc-search-box">
          <MagnifyingGlass weight="bold" className="tc-search-icon" />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="tc-filter-dropdown">
          <button className="tc-filter-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <FunnelSimple weight="bold" />
            Filter
          </button>
          {isFilterOpen && (
            <div className="tc-filter-menu">
              {filterOptions.map((option) => (
                <div 
                  key={option.value}
                  className={`tc-filter-option ${selectedFilter === option.value ? 'tc-selected' : ''}`}
                  onClick={() => handleFilterSelect(option.value)}
                >
                  {selectedFilter === option.value && (
                    <span className="tc-check">✓</span>
                  )}
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="tc-table-list-container">
        <table className="tc-tables-table">
          <thead>
            <tr>
              <th>Table</th>
              <th>Hour</th>
              <th>Space</th>
              <th>User</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTables.map(table => (
              <tr key={table.id}>
                <td>#{table.id}</td>
                <td>{table.hour}</td>
                <td>{table.space}</td>
                <td>{table.user}</td>
                <td>{table.price.toFixed(2)} DT</td>
                <td>
                  <div className="rm-action-menu">
                    <button 
                      className="rm-action-menu-trigger"
                      onClick={() => handleActionClick(table.id, 'menu')}
                    >
                              <MoreVertical className="w-5 h-5" />
                              </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="tc-pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="tc-pagination-btn"
          >
            ‹
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`tc-pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="tc-pagination-btn"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
