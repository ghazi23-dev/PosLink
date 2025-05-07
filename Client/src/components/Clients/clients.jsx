import React, { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlass,
  FunnelSimple,
  Plus,
  DotsThree,
  PencilSimple,
  Trash,
  X,
  Eye
} from '@phosphor-icons/react';
import { faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './clients.css';

const PreviewModal = ({ isOpen, onClose, client }) => {
  if (!isOpen || !client) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content preview-modal">
        <div className="modal-header">
          <h3>Client Details</h3>
          <button className="close-btn" onClick={onClose}>
            <X weight="bold" />
          </button>
        </div>
        <div className="preview-modal-body">
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Name : </span>
              <span className="preview-value">{client.name}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Total Orders : </span>
              <span className="preview-value">{client.totalOrders}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Orders Not Taken : </span>
              <span className="preview-value">{client.ordersNotTaken}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Canceled Orders : </span>
              <span className="preview-value">{client.canceledOrders}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Total Turnover : </span>
              <span className="preview-value">{client.totalTurnover}<sup>DT</sup></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionMenu = ({ onPreview, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setIsBottom(menuRect.bottom + 150 > windowHeight);
    }
  }, [isOpen]);
  
  return (
    <div className={`action-menu ${isBottom ? 'bottom' : ''}`} ref={menuRef}>
      <button 
        className="action-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <DotsThree size={20} weight="bold" />
      </button>
      {isOpen && (
        <>
          <div className="action-menu-overlay" onClick={() => setIsOpen(false)} />
          <div className="action-menu-dropdown">
            <button onClick={() => { onPreview(); setIsOpen(false); }}>
              <Eye weight="bold" />
              Preview
            </button>
            <button onClick={() => { onEdit(); setIsOpen(false); }}>
              <PencilSimple weight="bold" />
              Edit client
            </button>
            <button className="delete" onClick={() => { onDelete(); setIsOpen(false); }}>
              <Trash weight="bold" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const ClientFormModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content client-form-modal">
        <div className="modal-header">
          <h3>{mode === 'add' ? 'Add a Client' : 'Edit Client'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X weight="bold" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {mode === 'add' ? 'Add' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Clients = () => {
  const [clients] = useState(() => {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      return JSON.parse(savedClients);
    }
    return [
      {
        id: 1,
        name: 'Hamdi Boukadida',
        totalOrders: 120,
        ordersNotTaken: 5,
        canceledOrders: 5,
        totalTurnover: 1225
      },
      {
        id: 2,
        name: 'Hamdi Boukadida',
        totalOrders: 120,
        ordersNotTaken: 5,
        canceledOrders: 5,
        totalTurnover: 1225
      },
      {
        id: 3,
        name: 'Hamdi Boukadida',
        totalOrders: 120,
        ordersNotTaken: 5,  
        canceledOrders: 5,
        totalTurnover: 1225
      },
      {
        id: 4,
        name: 'Hamdi Boukadida',
        totalOrders: 120,
        ordersNotTaken: 5,
        canceledOrders: 5,
        totalTurnover: 1225
      },
      {
        id: 5,
        name: 'Hamdi Boukadida',
        totalOrders: 120,
        ordersNotTaken: 5,
        canceledOrders: 5,
        totalTurnover: 1225
      },
      {
        id: 6,
        name: 'Hamdi Boukadida',
        totalOrders: 120,
        ordersNotTaken: 5,
        canceledOrders: 5,
        totalTurnover: 1225
      },
      {
        id: 7,
        name: 'Hamdi Boukadida',
        totalOrders: 120,
        ordersNotTaken: 5,
        canceledOrders: 5,
        totalTurnover: 1225
      },
    ];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter clients first
  const filteredClients = clients.filter(client => {
    return client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           client.phone?.includes(searchQuery);
  });

  // Then paginate the filtered results
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="clients-container">
      <div className="white-container">
        <div className="clients-controls">
          <div className="search-box">
            <MagnifyingGlass weight="bold" className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <div className="sortable">
                    NAME <FontAwesomeIcon icon={faArrowDownShortWide} className="sort-icons"/>
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    TOTAL ORDERS
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    ORDERS NOT TAKEN
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    CANCELED ORDERS
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    TOTAL TURNOVER
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map(client => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.totalOrders || 0}</td>
                  <td>{client.ordersNotTaken || 0}</td>
                  <td>{client.canceledOrders || 0}</td>
                  <td>{client.totalTurnover || 0}<sup>DT</sup></td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
