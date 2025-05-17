import { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import { MoreVertical } from 'lucide-react';

import "./Purchases.css";

const Purchases = () => {
  const [menuVisible, setMenuVisible] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModalIndex, setShowEditModalIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and search state
  const [filterSupplier, setFilterSupplier] = useState("");
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialisez les achats depuis le localStorage si disponibles
  const loadPurchases = () => {
    const savedPurchases = localStorage.getItem("purchases");
    if (savedPurchases) {
      return JSON.parse(savedPurchases);
    }
    return [
      { id: "#125", date: "2023-02-13", totalAmount: "1200DT", supplier: "Aziza" },
      ...Array(4).fill().map((_, i) => ({
        id: `#126${i}`,
        date: "2023-02-14",
        totalAmount: "900DT",
        supplier: "Carrefour"
      }))
    ];
  };

  const [purchases, setPurchases] = useState(loadPurchases);

  // Get unique suppliers for filter dropdown
  const suppliers = Array.from(new Set(purchases.map(p => p.supplier)));

  // Filter and search logic
  const filteredPurchases = purchases.filter(p => {
    const matchesSupplier = !filterSupplier || p.supplier === filterSupplier;
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.date.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSupplier && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const paginatedData = filteredPurchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleMenu = (index, e) => {
    e.stopPropagation();
    setMenuVisible(menuVisible === index ? null : index);
  };

  const handleClickOutside = () => {
    setMenuVisible(null);
    setShowSupplierDropdown(false);
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Sauvegarder les achats dans le localStorage chaque fois qu'il y a un changement
  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(purchases));
  }, [purchases]);

  const handleAddPurchase = (e) => {
    e.preventDefault();
    const form = e.target;
    const date = form.date.value;
    const supplier = form.supplier.value;
    const totalAmount = `${Math.floor(Math.random() * 2000)}DT`; // auto-calculé
    const newId = `#${Math.floor(100 + Math.random() * 900)}`;

    const newPurchase = { id: newId, date, supplier, totalAmount };
    setPurchases([newPurchase, ...purchases]);
    setShowAddModal(false);
  };

  const handleEditPurchase = (e) => {
    e.preventDefault();
    const form = e.target;
    const date = form.date.value;
    const supplier = form.supplier.value;

    const updatedPurchases = [...purchases];
    updatedPurchases[showEditModalIndex] = {
      ...updatedPurchases[showEditModalIndex],
      date,
      supplier,
    };

    setPurchases(updatedPurchases);
    setShowEditModalIndex(null);
  };

  const handleDelete = (index) => {
    const actualIndex = index + (currentPage - 1) * itemsPerPage;
    const updated = [...purchases];
    updated.splice(actualIndex, 1);
    setPurchases(updated);
    setMenuVisible(null);
  };

  // Filter dropdown click handler
  const handleSupplierFilterClick = (e) => {
    e.stopPropagation();
    setShowSupplierDropdown(!showSupplierDropdown);
  };

  // Supplier select handler
  const handleSupplierSelect = (supplier) => {
    setFilterSupplier(supplier);
    setShowSupplierDropdown(false);
    setCurrentPage(1);
  };

  // Clear supplier filter
  const clearSupplierFilter = (e) => {
    e.stopPropagation();
    setFilterSupplier("");
    setShowSupplierDropdown(false);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-8xl">
      <div className="white-container">
        {/* Header */}
        <div className="purchases-header">
          <div className="title-section">
            <h1>Purchases</h1>
            <p>{purchases.length} purchases made this month</p>
          </div>
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            + Add
          </button>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Search size={20} />
          </div>
          <div className="filter-dropdown-container" style={{ position: 'relative' }}>
            <button className="filter-button" onClick={handleSupplierFilterClick} type="button">
              <Filter size={16} /> Filter
            </button>
            {showSupplierDropdown && (
              <div className="supplier-dropdown-list">
                <div 
                  className={`supplier-dropdown-item${filterSupplier === '' ? ' selected' : ''}`}
                  onClick={clearSupplierFilter}
                >
                  All Suppliers
                </div>
                {suppliers.map(supplier => (
                  <div 
                    key={supplier}
                    className={`supplier-dropdown-item${filterSupplier === supplier ? ' selected' : ''}`}
                    onClick={() => handleSupplierSelect(supplier)}
                  >
                    {supplier}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((purchase, index) => (
                <tr key={index}>
                  <td>{purchase.id}</td>
                  <td>{purchase.date}</td>
                  <td>{purchase.totalAmount}</td>
                  <td>{purchase.supplier}</td>
                  <td>
                    <div className="rm-action-menu">
                      <button 
                        className="rm-action-menu-trigger"
                        onClick={(e) => toggleMenu(index, e)}
                      >
                              <MoreVertical className="w-5 h-5 ml-6"  style={{marginRight:"-22px"}}/>

                      </button>
                      {menuVisible === index && (
                        <div className="action-menu-dropdown">
                          <button onClick={() => setShowEditModalIndex(index + (currentPage - 1) * itemsPerPage)}>
                            Edit Purchase
                          </button>
                          <button onClick={() => handleDelete(index)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Purchase</h2>
              <button onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddPurchase}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Date of purchase <span className="text-red-500">*</span></label>
                  <input name="date" type="date" required />
                </div>
                <div className="form-group">
                  <label>Supplier <span className="text-red-500">*</span></label>
                  <select name="supplier" required>
                    <option value="">Select a supplier</option>
                    <option value="Aziza">Aziza</option>
                    <option value="Carrefour">Carrefour</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModalIndex !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Purchase</h2>
              <button onClick={() => setShowEditModalIndex(null)}>&times;</button>
            </div>
            <form onSubmit={handleEditPurchase}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Date of purchase <span className="text-red-500">*</span></label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={purchases[showEditModalIndex].date}
                  />
                </div>
                <div className="form-group">
                  <label>Supplier <span className="text-red-500">*</span></label>
                  <select
                    name="supplier"
                    required
                    defaultValue={purchases[showEditModalIndex].supplier}
                  >
                    <option value="Aziza">Aziza</option>
                    <option value="Carrefour">Carrefour</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShowEditModalIndex(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
