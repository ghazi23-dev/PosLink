import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, MessageCircle } from 'lucide-react';
import './Inventory.css';

const Inventory = () => {
  const [searchTermInventory, setSearchTermInventory] = useState('');
  const [searchTermMonthly, setSearchTermMonthly] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [sortByOpen, setSortByOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Date');
  const [gapOptionsOpen, setGapOptionsOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', name: '' });

  // Exemple de données par défaut pour les inventaires
  const defaultInventories = [
    { id: 1, title: 'Inventory A', date: '2025-04-01', manager: 'John Doe', difference: 5 },
    { id: 2, title: 'Inventory B', date: '2025-04-02', manager: 'Jane Doe', difference: -3 },
    { id: 3, title: 'Inventory C', date: '2025-04-03', manager: 'Yassine Ghribel', difference: 10 },
  ];

  // Charger les inventaires depuis le localStorage ou utiliser les données par défaut
  const loadInventories = () => {
    const storedInventories = localStorage.getItem('inventories');
    return storedInventories ? JSON.parse(storedInventories) : defaultInventories;
  };

  const [inventories, setInventories] = useState(loadInventories);

  useEffect(() => {
    // Sauvegarder les inventaires dans le localStorage chaque fois que l'état des inventaires change
    localStorage.setItem('inventories', JSON.stringify(inventories));
  }, [inventories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddInventory = () => {
    if (!formData.date || !formData.name) {
      alert("Please fill in both fields.");
      return;
    }

    const newInventory = {
      id: inventories.length + 1,
      title: formData.name,
      date: formData.date,
      manager: 'Yassine Ghribel',
      difference: 90, // Default value for the difference
    };

    setInventories((prevInventories) => [...prevInventories, newInventory]);
    setIsModalOpen(false); // Close modal after adding
    setFormData({ date: '', name: '' }); // Reset form
  };

  const renderDifference = (saved, physical) => {
    const diff = physical - saved;
    if (diff > 0) return `+${diff} DT`;
    if (diff < 0) return `${diff} DT`;
    return '120 DT';
  };

  const categories = ['All', 'Drinks', 'Food', 'Desserts', 'Appetizers'];

  const sortOptions = ['Date', 'GAP'];
  const gapOptions = ['All', 'Jus', 'Boissons', 'Cafés', 'Thé'];

  const handleSortClick = (option) => {
    if (option === 'GAP') {
      setGapOptionsOpen(true);
    } else {
      setSelectedSort(option);
      setSortByOpen(false);
      setGapOptionsOpen(false);
    }
  };

  const handleGapOptionClick = (option) => {
    setSelectedSort(`GAP - ${option}`);
    setGapOptionsOpen(false);
    setSortByOpen(false);
  };

  return (
    <div className="inventory-container">
      {/* Inventories Section */}
      <div className="inventory-section">
        <div className="section-header">
          <div className="header-content">
            <h2 className="section-title">Inventories</h2>
            <p className="section-subtitle">{inventories.length} inventories this month</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-inventory-btn"
          >
            + Add Inventory
          </button>
        </div>

        <div className="controls-row">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search Inventories"
              className="search-input"
              value={searchTermInventory}
              onChange={(e) => setSearchTermInventory(e.target.value)}
            />
          </div>
          <div className="sort-container">
            <button 
              className="sort-btn"
              onClick={() => {
                setSortByOpen(!sortByOpen);
                setGapOptionsOpen(false);
              }}
            >
              <Filter className="w-4 h-4" />
              Sort by {selectedSort}
            </button>
            {sortByOpen && (
              <div className="sort-dropdown">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortClick(option)}
                    className="sort-option"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            {gapOptionsOpen && (
              <div className="sort-dropdown gap-options">
                {gapOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleGapOptionClick(option)}
                    className="sort-option"
                  >
                    {option === 'All' && <span className="checkmark">✓</span>}
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Manager</th>
              <th>GAP</th>
            </tr>
          </thead>
          <tbody>
            {inventories
              .filter((inv) => inv.title.toLowerCase().includes(searchTermInventory.toLowerCase()))
              .map((inv, idx) => (
                <tr key={idx}>
                  <td>{inv.date}</td>
                  <td>{inv.title}</td>
                  <td>{inv.manager}</td>
                  <td className={`gap-value ${inv.difference < 0 ? 'negative' : 'positive'}`}>
                    {inv.difference > 0 ? `+${inv.difference}DT` : `${inv.difference}DT`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Inventory Section */}
      <div className="inventory-section">
        <div className="section-header">
          <div className="header-content">
            <h2 className="section-title">Monthly Inventory</h2>
            <p className="section-subtitle">13/02/2025</p>
          </div>
          <div className="category-container">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="category-btn"
            >
              {selectedCategory} <ChevronDown className="w-4 h-4" />
            </button>
            {categoryOpen && (
              <div className="category-dropdown">
                {categories.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedCategory(option);
                      setCategoryOpen(false);
                    }}
                    className="category-option"
                  >
                    {option === 'All' && <span className="checkmark">✓</span>}
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="controls-row">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search Items"
              className="search-input"
              value={searchTermMonthly}
              onChange={(e) => setSearchTermMonthly(e.target.value)}
            />
          </div>
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Saved Stock</th>
              <th>Physical Stock</th>
              <th>Difference</th>
              <th>GAP</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {inventories
              .filter((item) => item.title.toLowerCase().includes(searchTermMonthly.toLowerCase()))
              .map((item, idx) => (
                <tr key={idx}>
                  <td>{item.title}</td>
                  <td>10 DT</td>
                  <td>12 DT</td>
                  <td className={`gap-value ${renderDifference(10, 12).includes('+') ? 'positive' : 'negative'}`}>
                    {renderDifference(10, 12)}
                  </td>
                  <td className="gap-value neutral">120 DT</td>
                  <td>
                    <MessageCircle className="comment-icon" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add Inventory</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close"
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">
                  Date of completion <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Inventory Title"
                  className="form-input"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddInventory}
                  className="btn-submit"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
// 
//