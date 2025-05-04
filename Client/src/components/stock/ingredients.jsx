import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Plus, MoreVertical, Box, AlertTriangle, Clock, ShoppingCart } from 'lucide-react';
import './Ingredients.css';

const AddIngredientModal = ({ isEdit, onClose, initialData = {}, onSubmit }) => {
  const [modalData, setModalData] = useState({
    name: initialData.name || '',
    code: initialData.code || '',
    category: initialData.category || '',
    expirationDate: initialData.expirationDate || '',
    expiresIn: initialData.expiresIn || '',
    stockAlert: initialData.stockAlert || '',
    unit: initialData.unit || '',
    quantity: initialData.quantity || '',
    price: initialData.price || '',
    status: initialData.status || 'In stock'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(modalData, isEdit ? initialData.id : null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? 'Edit' : 'Add'} ingredient
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="modal-close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Ex: Tomate.."
                className="form-input"
                value={modalData.name}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Code <span className="required">*</span>
              </label>
              <input
                name="code"
                type="text"
                placeholder="Ex: 124.."
                className="form-input"
                value={modalData.code}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                name="category"
                className="form-input"
                value={modalData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Liquids">Liquids</option>
                <option value="Meat">Meat</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Price <span className="required">*</span>
              </label>
              <input
                name="price"
                type="number"
                placeholder="Ex: 3.5"
                className="form-input"
                value={modalData.price}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Quantity <span className="required">*</span>
              </label>
              <input
                name="quantity"
                type="text"
                placeholder="Ex: 100"
                className="form-input"
                value={modalData.quantity}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Expiration date
              </label>
              <input
                name="expirationDate"
                type="date"
                className="form-input"
                value={modalData.expirationDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Expires in <span className="required">*</span>
              </label>
              <select
                name="expiresIn"
                className="form-input"
                value={modalData.expiresIn}
                onChange={handleChange}
                required
              >
                <option value="">Select expiration</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 week">1 week</option>
                <option value="3 days">3 days</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Stock alert
                </label>
                <input
                  name="stockAlert"
                  type="number"
                  placeholder="5"
                  className="form-input"
                  value={modalData.stockAlert}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Unit
                </label>
                <select
                  name="unit"
                  className="form-input"
                  value={modalData.unit}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose unit</option>
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="pieces">pieces</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
            >
              {isEdit ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StockManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockData, setStockData] = useState([]);
  const itemsPerPage = 10;

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('ingredientsData');
    if (savedData) {
      setStockData(JSON.parse(savedData));
    } else {
      // Initial default data
      const defaultData = [
        { id: 1, code: '22', name: 'Tomate', quantity: '2Kg', alert: '100g', price: '3DT', category: 'Vegetables', status: 'Out of stock' },
        { id: 2, code: '22', name: 'Onion', quantity: '185Kg', alert: '12g', price: '3DT', category: 'Vegetables', status: 'Stock alert' },
        { id: 3, code: '22', name: 'Olive oil', quantity: '185L', alert: '9L', price: '3DT', category: 'Liquids', status: 'In stock' },
        { id: 4, code: '22', name: 'Concombre', quantity: '185Kg', alert: '15g', price: '3DT', category: 'Vegetables', status: 'In stock' },
        { id: 5, code: '22', name: 'Carotte', quantity: '100Kg', alert: '5g', price: '3DT', category: 'Vegetables', status: 'Out of stock' },
        { id: 6, code: '22', name: 'Pomme de terre', quantity: '85Kg', alert: '22g', price: '3DT', category: 'Vegetables', status: 'In stock' },
      ];
      setStockData(defaultData);
      localStorage.setItem('ingredientsData', JSON.stringify(defaultData));
    }
  }, []);

  const metrics = [
    { id: 1, title: "Stock value", value: "120DT", icon: <Box size={20} className="text-blue-600" /> },
    { id: 2, title: "Out of stock", value: "12", icon: <ShoppingCart size={20} className="text-red-600" /> },
    { id: 3, title: "Stock alert", value: "5", icon: <AlertTriangle size={20} className="text-yellow-600" /> },
    { id: 4, title: "Expiring", value: "2", icon: <Clock size={20} className="text-purple-600" /> },
  ];

  // Handle form submission (both add and edit)
  const handleSubmit = (data, editId = null) => {
    let updatedData;
    if (editId) {
      // Edit existing item
      updatedData = stockData.map(item => 
        item.id === editId ? { ...data, id: editId } : item
      );
    } else {
      // Add new item
      const newId = Math.max(...stockData.map(item => item.id), 0) + 1;
      updatedData = [...stockData, { ...data, id: newId }];
    }
    
    setStockData(updatedData);
    localStorage.setItem('ingredientsData', JSON.stringify(updatedData));
  };

  // Handle delete
  const handleDelete = (id) => {
    const updatedData = stockData.filter(item => item.id !== id);
    setStockData(updatedData);
    localStorage.setItem('ingredientsData', JSON.stringify(updatedData));
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // Filtrage et pagination
  const filteredData = stockData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="ingredients-container">
      {/* Header Controls */}
      <div className="header-controls">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            placeholder="Search"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="controls-buttons">
          <button className="filter-btn">
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="add-btn"
          >
            <Plus className="w-4 h-4" />
            Add Ingredient
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.id} className="metric-card">
            <div className="metric-icon">
              {metric.icon}
            </div>
            <div className="metric-content">
              <div className="metric-title">{metric.title}</div>
              <div className="metric-value">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="ingredients-table">
          <thead>
            <tr>
              <th>CODE</th>
              <th>NAME</th>
              <th>QUANTITY/UNITY</th>
              <th>ALERT QUANTITY</th>
              <th>UNIT PRICE</th>
              <th>CATEGORY</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.alert}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td>
                  <span className={`status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="actions-container">
                    <button className="actions-btn">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="actions-menu">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="action-item"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="action-item delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <span className="pagination-info">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
        </span>
        <div className="pagination-buttons">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddIngredientModal 
          isEdit={false} 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
      {isEditModalOpen && (
        <AddIngredientModal 
          isEdit={true} 
          initialData={selectedItem}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default StockManagement;






