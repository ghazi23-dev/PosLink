import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Trash2, MessageCircle, Plus } from 'lucide-react';
import './InventoryForm.css';

const InventoryForm = ({ inventoryId, date, onSave, onCancel }) => {
  const [products, setProducts] = useState([
    { id: 1, code: '', name: '', savedStock: '', physicalStock: '', difference: '', gap: '', comment: '' }
  ]);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [popupStyle, setPopupStyle] = useState({});
  const [productsList, setProductsList] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ code: '', name: '', category: 'Food' });
  const commentBtnRefs = useRef({});

  useEffect(() => {
    // Load products from localStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProductsList(JSON.parse(savedProducts));
    } else {
      // Set default products if none exist
      const defaultProducts = [
        { code: '101', name: 'Tomato', category: 'Food' },
        { code: '102', name: 'Potato', category: 'Food' },
        { code: '103', name: 'Orange Juice', category: 'Drinks' },
      ];
      localStorage.setItem('products', JSON.stringify(defaultProducts));
      setProductsList(defaultProducts);
    }
  }, []);

  const handleAddNewProduct = () => {
    if (!newProduct.code || !newProduct.name) {
      alert('Please fill in both code and name');
      return;
    }

    const productExists = productsList.some(
      p => p.code === newProduct.code || p.name.toLowerCase() === newProduct.name.toLowerCase()
    );

    if (productExists) {
      alert('A product with this code or name already exists');
      return;
    }

    const updatedProducts = [...productsList, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProductsList(updatedProducts);
    setNewProduct({ code: '', name: '', category: 'Food' });
    setShowAddProduct(false);
  };

  const handleAddProduct = () => {
    const newRow = {
      id: products.length + 1,
      code: '',
      name: '',
      savedStock: '',
      physicalStock: '',
      difference: '',
      gap: '',
      comment: ''
    };
    setProducts([...products, newRow]);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleProductChange = (id, field, value) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        
        // If name is selected, find and set the corresponding code
        if (field === 'name') {
          const selectedProduct = productsList.find(p => p.name === value);
          if (selectedProduct) {
            updatedProduct.code = selectedProduct.code;
          }
        }
        
        // Calculate difference and gap
        if (field === 'physicalStock' || field === 'savedStock') {
          const physical = field === 'physicalStock' ? parseFloat(value) : parseFloat(product.physicalStock);
          const saved = field === 'savedStock' ? parseFloat(value) : parseFloat(product.savedStock);
          
          if (!isNaN(physical) && !isNaN(saved)) {
            updatedProduct.difference = (physical - saved).toFixed(2);
            updatedProduct.gap = (Math.abs(physical - saved) * 1.5).toFixed(2);
          }
        }
        
        return updatedProduct;
      }
      return product;
    }));
  };

  const toggleComment = (id) => {
    if (activeCommentId === id) {
      setActiveCommentId(null);
      return;
    }

    const btnElement = commentBtnRefs.current[id];
    if (btnElement) {
      const rect = btnElement.getBoundingClientRect();
      setPopupStyle({
        top: `${rect.bottom + 8}px`,
      });
    }
    setActiveCommentId(id);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.comment-popup') && !e.target.closest('.comment-btn')) {
      setActiveCommentId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="inv-inventory-form">
      <div className="inv-inventory-form-content">
        <div className="inv-inventory-header">
          <h2>Inventory {inventoryId}</h2>
          <p className="inv-date">{date}</p>
          <button className="inv-add-product-btn" onClick={handleAddProduct}>
            + Add
          </button>
        </div>

        <div className="inv-stats-cards">
          <div className="inv-stat-card">
            <span className="inv-stat-amount">220<span className="inv-unit">DT</span></span>
            <span className="inv-stat-label">Amount</span>
          </div>
          <div className="inv-stat-card">
            <span className="inv-stat-amount">14</span>
            <span className="inv-stat-label">Added products</span>
          </div>
        </div>

        <div className="inv-product-management">
          {/* <button 
            className="inv-manage-products-btn"
            onClick={() => setShowAddProduct(!showAddProduct)}
          >
            <Plus size={16} /> Add New Product
          </button> */}
          
          {showAddProduct && (
            <div className="inv-add-product-form">
              <input
                type="text"
                placeholder="Product Code"
                value={newProduct.code}
                onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
              />
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="Food">Food</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
              </select>
              <div className="inv-form-actions">
                <button onClick={() => setShowAddProduct(false)}>Cancel</button>
                <button onClick={handleAddNewProduct}>Add Product</button>
              </div>
            </div>
          )}
        </div>

        <div className="inv-product-list">
          <table>
            <thead>
              <tr>
                <th>CODE</th>
                <th>NAME</th>
                <th>SAVED STOCK</th>
                <th>PHYSICAL STOCK</th>
                <th>DIFFERENCE</th>
                <th>GAP</th>
                <th>COMMENT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="text"
                      value={product.code}
                      onChange={(e) => handleProductChange(product.id, 'code', e.target.value)}
                      placeholder="Ex: 123"
                      readOnly
                    />
                  </td>
                  <td>
                    <div className="inv-select-wrapper">
                      <select
                        value={product.name}
                        onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                      >
                        <option value="">Choose product</option>
                        {productsList.map((p) => (
                          <option key={p.code} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                      
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={product.savedStock}
                      onChange={(e) => handleProductChange(product.id, 'savedStock', e.target.value)}
                      placeholder="300 Kg"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={product.physicalStock}
                      onChange={(e) => handleProductChange(product.id, 'physicalStock', e.target.value)}
                      placeholder="Quantity in Kg"
                    />
                  </td>
                  <td className={product.difference < 0 ? 'inv-negative' : 'inv-positive'}>
                    {product.difference ? `${product.difference} Kg` : '-'}
                  </td>
                  <td>
                    {product.gap ? `${product.gap}DT` : '-'}
                  </td>
                  <td>
                    <div className="inv-comment-cell">
                      <button 
                        ref={el => commentBtnRefs.current[product.id] = el}
                        className={`inv-comment-btn ${product.comment ? 'inv-has-comment' : ''}`}
                        onClick={() => toggleComment(product.id)}
                      >
                        <MessageCircle size={18} />
                      </button>
                      {activeCommentId === product.id && (
                        <div className="inv-comment-popup" style={popupStyle}>
                          <div className="inv-comment-header">
                            <h3>Comment</h3>
                            <button 
                              className="inv-close-btn"
                              onClick={() => setActiveCommentId(null)}
                            >
                              ×
                            </button>
                          </div>
                          <textarea
                            value={product.comment}
                            onChange={(e) => handleProductChange(product.id, 'comment', e.target.value)}
                            placeholder="Add a comment..."
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <button 
                      className="inv-delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="inv-form-actions">
          <div className="inv-main-actions">
            <button className="inv-cancel-btn" onClick={onCancel}>Cancel</button>
            <button className="inv-save-btn" onClick={() => onSave(products)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryForm; 