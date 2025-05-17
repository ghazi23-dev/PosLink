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
import { MoreVertical } from 'lucide-react';

import './productsList.css';

const PreviewModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content preview-modal">
        <div className="modal-header">
          <h3>Product</h3>
          <button className="close-btn" onClick={onClose}>
            <X weight="bold" />
          </button>
        </div>
        <div className="preview-modal-body">
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">ID : </span>
              <span className="preview-value">{product.id}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Name : </span>
              <span className="preview-value">{product.name}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Category : </span>
              <span className="preview-value">{product.category}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Sub-Category : </span>
              <span className="preview-value">{product.subCategory}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Order : </span>
              <span className="preview-value">{product.order || '-'}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Coast (DT) : </span>
              <span className="preview-value">{product.price}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">TVA percentage : </span>
              <span className="preview-value">{product.tvaPercentage || '-'}</span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Active : </span>
              <span className={`preview-value ${product.active ? 'active' : 'inactive'}`}>
                {product.active ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div className="preview-row">
            <div className="preview-content">
              <span className="preview-label">Ingredients : </span>
              <span className="preview-value">
                {product.ingredients?.join(', ') || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionMenu = ({ onPreview, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="rm-action-menu" ref={menuRef}>
      <button 
        className="rm-action-menu-trigger"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <MoreVertical className="w-5 h-5 " style={{marginRight:"-20px"}} />
        
      </button>
      {isOpen && (
        <div className="action-menu-dropdown">
          <button 
            className="action-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
              setIsOpen(false);
            }}
          >
            Preview
          </button>
          <button 
            className="action-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
          >
            Edit product
          </button>
          <button 
            className="action-menu-item delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    order: '',
    coast: '',
    tvaPercentage: '',
    active: true,
    ingredients: ''
  });
  const [categories, setCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  useEffect(() => {
    // Load categories from localStorage
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        coast: initialData.price || '',
        ingredients: initialData.ingredients?.join(', ') || ''
      });
    }
  }, [initialData]);

  // Update available sub-categories when category changes
  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find(cat => cat.name === formData.category);
      if (selectedCategory) {
        setAvailableSubCategories(selectedCategory.subCategories || []);
      } else {
        setAvailableSubCategories([]);
      }
    } else {
      setAvailableSubCategories([]);
    }
  }, [formData.category, categories]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        active: value === 'Yes'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Reset sub-category when category changes
        ...(name === 'category' ? { subCategory: '' } : {})
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      price: parseFloat(formData.coast),
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i)
    };
    onSubmit(processedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content product-form-modal">
        <div className="modal-header">
          <h3>{mode === 'add' ? 'Add a Product' : 'Edit Product'}</h3>
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
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subCategory">Sub-Category</label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              disabled={!formData.category}
            >
              <option value="">Select sub-category</option>
              {availableSubCategories.map(subCategory => (
                <option key={subCategory.id} value={subCategory.name}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="order">Order</label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="Enter order number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coast">Coast (DT)</label>
            <input
              type="number"
              step="0.01"
              id="coast"
              name="coast"
              value={formData.coast}
              onChange={handleChange}
              placeholder="Enter cost in DT"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tvaPercentage">TVA percentage</label>
            <input
              type="number"
              step="0.01"
              id="tvaPercentage"
              name="tvaPercentage"
              value={formData.tvaPercentage}
              onChange={handleChange}
              placeholder="Enter TVA percentage"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients</label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="Enter ingredients (comma separated)"
            />
          </div>

          <div className="form-group">
            <label className="radio-label">
              Active <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-option" >
                <input
                  type="radio"
                  name="active"
                  value="Yes"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <span>Yes</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="active"
                  value="No"
                  checked={!formData.active}
                  onChange={handleChange}
                />
                <span>No</span>
              </label>
            </div>
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

const ProductsList = () => {
  const [products, setProducts] = useState(() => {
    // Try to get products from localStorage first
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    // If no saved products, return default data
    return [
      {
        id: 1,
        name: 'Boga Cidre',
        subCategory: 'Boissons',
        category: 'Drinks',
        price: 3,
        active: true,
        ingredients: ['Carbonated Water', 'Sugar', 'Natural Flavors']
      },
      {
        id: 2,
        name: 'Fanta',
        subCategory: 'Boissons',
        category: 'Drinks',
        price: 3
      },
      {
        id: 3,
        name: 'Apla',
        subCategory: 'Boissons',
        category: 'Drinks',
        price: 3
      },
      {
        id: 4,
        name: 'Jus de Fraise',
        subCategory: 'Jus',
        category: 'Drinks',
        price: 8
      },
      {
        id: 5,
        name: "Jus d'orange",
        subCategory: 'Jus',
        category: 'Drinks',
        price: 6
      },
      {
        id: 6,
        name: 'Jus de kiwi',
        subCategory: 'Jus',
        category: 'Drinks',
        price: 10
      },
      {
        id: 7,
        name: 'Redbull',
        subCategory: 'Boissons',
        category: 'Drinks',
        price: 9
      },
      {
        id: 8,
        name: 'Shark',
        subCategory: 'Boissons',
        category: 'Drinks',
        price: 9
      },
      {
        id: 9,
        name: 'Crepe Nutella',
        subCategory: 'Crepes',
        category: 'Food',
        price: 11
      },
      {
        id: 10,
        name: 'Crepe Banane Fruits secs',
        subCategory: 'Crepes',
        category: 'Food',
        price: 12
      }
    ];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [previewModalState, setPreviewModalState] = useState({ isOpen: false, product: null });
  const [productModalState, setProductModalState] = useState({ isOpen: false, mode: 'add', productData: null });
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =9;

  const filterOptions = [
    { value: 'All', label: 'All' },
    { value: 'Drinks', label: 'Drinks' },
    { value: 'Food', label: 'Food' },
    { value: 'Desserts', label: 'Desserts' },
    { value: 'Appetizers', label: 'Appetizers' }
  ];

  // Filter products first
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedFilter === 'All' || product.category === selectedFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Then paginate the filtered results
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreview = (product) => {
    setPreviewModalState({ isOpen: true, product });
  };

  const closePreviewModal = () => {
    setPreviewModalState({ isOpen: false, product: null });
  };

  const handleAddProduct = (newProduct) => {
    const uniqueId = Math.max(...products.map(p => p.id), 0) + 1;
    const productToAdd = { ...newProduct, id: uniqueId };
    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleEditProduct = (productId) => {
    const productToEdit = products.find(p => p.id === productId);
    setProductModalState({ isOpen: true, mode: 'edit', productData: productToEdit });
  };

  const handleProductSubmit = (formData) => {
    if (productModalState.mode === 'add') {
      handleAddProduct(formData);
    } else {
      const updatedProducts = products.map(product =>
        product.id === productModalState.productData.id ? { ...formData, id: product.id } : product
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  const handleEdit = (productId) => {
    handleEditProduct(productId);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
  };

  return (
    <div className="products-container">
      {/* <div className="breadcrumb">
        <a href="#">Product Management</a>
        <span className="separator">/</span>
        <span className="current">Products List</span>
      </div> */}

      <div className="products-controls">
        <div className="search-box">
          <MagnifyingGlass weight="bold" className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="action-buttons-container">
          <div className="filter-dropdown">
            <button className="filter-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <FunnelSimple weight="bold" />
              Filter
            </button>
            {isFilterOpen && (
              <div className="filter-menu">
                {filterOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`filter-option ${selectedFilter === option.value ? 'selected' : ''}`}
                    onClick={() => handleFilterSelect(option.value)}
                  >
                    {selectedFilter === option.value && (
                      <span className="check">✓</span>
                    )}
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            className="add-btn"
            onClick={() => setProductModalState({ isOpen: true, mode: 'add', productData: null })}
          >
            <Plus weight="bold" />
            Add product
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <div className="sortable">
                  PRODUCT NAME <FontAwesomeIcon icon={faArrowDownShortWide} className="sort-icons"/>
                </div>
              </th>
              <th>SUB-CATEGORY</th>
              <th>CATEGORY</th>
              <th>PRICE (DT)</th>
              {/* <th>TVA PERCENTAGE</th> */}
              <th style={{ width: '60px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.subCategory}</td>
                <td>{product.category}</td>
              
                <td>{product.price}</td>
                {/* <td>{product.tvaPercentage || '-'}</td> */}
                <td>
                  <ActionMenu
                    onPreview={() => handlePreview(product)}
                    onEdit={() => handleEditProduct(product.id)}
                    onDelete={() => handleDelete(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ‹
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            ›
          </button>
        </div>
      )}

      <ProductFormModal
        isOpen={productModalState.isOpen}
        onClose={() => setProductModalState({ isOpen: false, mode: 'add', productData: null })}
        onSubmit={handleProductSubmit}
        initialData={productModalState.productData}
        mode={productModalState.mode}
      />

      <PreviewModal 
        isOpen={previewModalState.isOpen}
        onClose={closePreviewModal}
        product={previewModalState.product}
      />
    </div>
  );
};

export default ProductsList;
