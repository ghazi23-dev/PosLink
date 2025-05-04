import { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import "./Purchases.css";

const Purchases = () => {
  const [menuVisible, setMenuVisible] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModalIndex, setShowEditModalIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const totalPages = Math.ceil(purchases.length / itemsPerPage);
  const paginatedData = purchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleMenu = (index, e) => {
    e.stopPropagation();
    setMenuVisible(menuVisible === index ? null : index);
  };

  const handleClickOutside = () => setMenuVisible(null);
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
            <input type="text" placeholder="Search..." />
            <Search size={20} />
          </div>
          <button className="filter-button">
            <Filter size={16} /> Filter
          </button>
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
                    <div className="action-menu">
                      <button 
                        className="action-menu-trigger"
                        onClick={(e) => toggleMenu(index, e)}
                      >
                        <span className="dots">⋮</span>
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
