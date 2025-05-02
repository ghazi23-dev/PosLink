import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlass, 
  Plus, 
  PencilSimple, 
  Trash,
  CaretDown,
  CaretUp,
  X
} from '@phosphor-icons/react';
import './CategoriesSub.css';

// Sample image URLs from Unsplash (food-related)
const sampleImages = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', // burger
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop', // pizza
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=400&fit=crop', // pasta
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', // coffee
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop', // salad
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', // cake
];

// Sample emojis for sub-categories (as an alternative to images)
let sampleEmojis = {
  Food: ['🍔', '🍕', '🍝', '🥩', '🌮', '🥪', '🍜', '🍖'],
  Drinks: ['☕️', '🥤', '🧃', '🍹', '🧋', '🥂', '🍺', '🍷'],
  Appetizers: ['🥗', '🥣', '🥟', '🍤', '🥪', '🌯', '🥨', '🧆'],
  Desserts: ['🍰', '🍦', '🥐', '🧁', '🍫', '🍮', '🥧', '🍪'],
  Breakfast: ['🍳', '🥞', '🥪', '🥐', '🥖', '🥯', '🥣', '🥓'],
  Salads: ['🥗', '🥒', '🥦', '🥕', '🥑', '🍅', '🥔', '🥙'],
  KidsMenu: ['🍔', '🍕', '🍝', '🥩', '🌮', '🥪', '🍜', '🍖'],
};

// Add this constant at the top with other constants
const categoryEmojiGroups = {
  "Food & Dishes": ['🍕', '🍔', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥠', '🥡'],
  "Breads & Breakfast": ['🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🥓', '🥩', '🥪'],
  "Sweets & Desserts": ['🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯'],
  "Fruits": ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒'],
  "Vegetables": ['🥬', '🥦', '🥒', '🥕', '🌽', '🌶️', '🫑', '🥑', '🥔', '🍆', '🥜', '🌰'],
  "Drinks": ['☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🥛', '🧊'],
  "Cutlery & Others": ['🍽️', '🍴', '🥄', '🔪', '🧊', '🥢', '👨‍🍳', '👩‍🍳', '🧑‍🍳']
};

// Add Category Modal Component
const CategoryFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    order: '',
    icon: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedEmojiGroup, setSelectedEmojiGroup] = useState("Food & Dishes");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.order.trim()) newErrors.order = 'Order is required';
    if (!formData.icon) newErrors.icon = 'Icon is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
      setFormData({
        name: '',
        order: '',
        icon: ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEmojiSelect = (emoji) => {
    setFormData(prev => ({
      ...prev,
      icon: emoji
    }));
    setShowEmojiPicker(false);
    if (errors.icon) {
      setErrors(prev => ({
        ...prev,
        icon: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add a Category</h3>
          <button className="close-btn" onClick={onClose}>
            <X weight="bold" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="order">
              Order <span className="required">*</span>
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="Enter order number"
              className={errors.order ? 'error' : ''}
            />
            {errors.order && <span className="error-text">{errors.order}</span>}
          </div>

          <div className="form-group">
            <label>
              Icon <span className="required">*</span>
            </label>
            <div className="icon-selector">
              <div 
                className="selected-icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {formData.icon || 'Select an icon'} 
                <CaretDown weight="bold" />
              </div>
              {errors.icon && <span className="error-text">{errors.icon}</span>}
              
              {showEmojiPicker && (
                <div className="emoji-picker">
                  <div className="emoji-groups">
                    {Object.keys(categoryEmojiGroups).map(group => (
                      <button
                        key={group}
                        type="button"
                        className={`emoji-group-btn ${selectedEmojiGroup === group ? 'active' : ''}`}
                        onClick={() => setSelectedEmojiGroup(group)}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                  <div className="emoji-list">
                    {categoryEmojiGroups[selectedEmojiGroup].map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        className="emoji-btn"
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!formData.name.trim() || !formData.order.trim() || !formData.icon}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Sub-category Modal Component
const SubCategoryFormModal = ({ isOpen, onClose, onSubmit, parentCategories, selectedParentId }) => {
  const [formData, setFormData] = useState({
    name: '',
    order: '',
    icon: '',
    parent: selectedParentId || ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedParentId) {
      setFormData(prev => ({ ...prev, parent: selectedParentId }));
    }
  }, [selectedParentId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.order.trim()) newErrors.order = 'Order is required';
    if (!formData.parent) newErrors.parent = 'Parent category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
      setFormData({
        name: '',
        order: '',
        icon: '',
        parent: selectedParentId || ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add a Sub-category</h3>
          <button className="close-btn" onClick={onClose}>
            <X weight="bold" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter sub-category name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="order">
              Order <span className="required">*</span>
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="Enter order number"
              className={errors.order ? 'error' : ''}
            />
            {errors.order && <span className="error-text">{errors.order}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icon</label>
            <select
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="icon-select"
            >
              <option value="">Select an icon</option>
              {sampleEmojis[parentCategories.find(cat => cat.id === parseInt(formData.parent))?.name || 'Food']?.map((emoji, index) => (
                <option key={index} value={emoji}>{emoji} Sub-category</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="parent">
              Parent <span className="required">*</span>
            </label>
            <select
              id="parent"
              name="parent"
              value={formData.parent}
              onChange={handleChange}
              className={errors.parent ? 'error' : ''}
            >
              <option value="">Select parent category</option>
              {parentCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.parent && <span className="error-text">{errors.parent}</span>}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!formData.name.trim() || !formData.order.trim() || !formData.parent}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Sub-category Modal Component
const EditSubCategoryModal = ({ isOpen, onClose, onSubmit, parentCategories, subCategory, parentCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    order: '',
    icon: '',
    parent: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subCategory && isOpen) {
      setFormData({
        name: subCategory.name || '',
        order: subCategory.order?.toString() || '',
        icon: sampleEmojis[parentCategory.name][subCategory.emojiIndex] || '',
        parent: parentCategory.id.toString()
      });
    }
  }, [subCategory, isOpen, parentCategory]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.order.trim()) newErrors.order = 'Order is required';
    if (!formData.parent) newErrors.parent = 'Parent category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, id: subCategory.id });
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Sub-category</h3>
          <button className="close-btn" onClick={onClose}>
            <X weight="bold" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter sub-category name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="order">
              Order <span className="required">*</span>
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="Enter order number"
              className={errors.order ? 'error' : ''}
            />
            {errors.order && <span className="error-text">{errors.order}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icon</label>
            <select
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="icon-select"
            >
              <option value="">Select an icon</option>
              {sampleEmojis[parentCategory.name]?.map((emoji, index) => (
                <option key={index} value={emoji}>{emoji} Sub-category</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="parent">
              Parent <span className="required">*</span>
            </label>
            <select
              id="parent"
              name="parent"
              value={formData.parent}
              onChange={handleChange}
              className={errors.parent ? 'error' : ''}
            >
              <option value="">Select parent category</option>
              {parentCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.parent && <span className="error-text">{errors.parent}</span>}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!formData.name.trim() || !formData.order.trim() || !formData.parent}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add this component after CategoryFormModal
const EditCategoryModal = ({ isOpen, onClose, onSubmit, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    order: '',
    icon: ''
  });
  const [errors, setErrors] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiGroup, setSelectedEmojiGroup] = useState("Food & Dishes");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        order: category.order?.toString() || '',
        icon: category.icon || ''
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.order.trim()) newErrors.order = 'Order is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, id: category.id });
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEmojiSelect = (emoji) => {
    setFormData(prev => ({
      ...prev,
      icon: emoji
    }));
    setShowEmojiPicker(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content edit-category-modal">
        <div className="modal-header">
          <h3>Edit Category</h3>
          <button className="close-btn" onClick={onClose}>
            <X weight="bold" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="order">
              Order <span className="required">*</span>
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="Enter order number"
              className={errors.order ? 'error' : ''}
            />
            {errors.order && <span className="error-text">{errors.order}</span>}
          </div>

          <div className="form-group">
            <label>Icon</label>
            <div className="icon-selector">
              <div 
                className="selected-icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {formData.icon || 'Select an icon'} 
                <CaretDown weight="bold" />
              </div>
              
              {showEmojiPicker && (
                <div className="emoji-picker">
                  <div className="emoji-groups">
                    {Object.keys(categoryEmojiGroups).map(group => (
                      <button
                        key={group}
                        type="button"
                        className={`emoji-group-btn ${selectedEmojiGroup === group ? 'active' : ''}`}
                        onClick={() => setSelectedEmojiGroup(group)}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                  <div className="emoji-list">
                    {categoryEmojiGroups[selectedEmojiGroup].map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        className="emoji-btn"
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoriesSub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [useImages, setUseImages] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [editSubCategoryModal, setEditSubCategoryModal] = useState({
    isOpen: false,
    subCategory: null,
    parentCategory: null
  });
  const [editCategoryModal, setEditCategoryModal] = useState({
    isOpen: false,
    category: null
  });

  // Load categories from localStorage on component mount
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Initialize with default categories if none exist
      const defaultCategories = [
        {
          id: 1,
          name: 'Food',
          icon: '🍔',
          subCategories: [
            { id: 1, name: 'Burgers', imageIndex: 0, emojiIndex: 0 },
            { id: 2, name: 'Pizza', imageIndex: 1, emojiIndex: 1 },
            { id: 3, name: 'Pasta', imageIndex: 2, emojiIndex: 2 },
          ]
        },
        {
          id: 2,
          name: 'Drinks',
          icon: '🥤',
          subCategories: [
            { id: 4, name: 'Hot Drinks', imageIndex: 3, emojiIndex: 0 },
            { id: 5, name: 'Cold Drinks', imageIndex: 4, emojiIndex: 1 },
            { id: 6, name: 'Smoothies', imageIndex: 5, emojiIndex: 2 },
          ]
        },
        {
          id: 3,
          name: 'Appetizers',
          icon: '🍟',
          subCategories: [
            { id: 7, name: 'Salads', imageIndex: 0, emojiIndex: 0 },
            { id: 8, name: 'Soups', imageIndex: 1, emojiIndex: 1 },
            { id: 9, name: 'Starters', imageIndex: 2, emojiIndex: 2 },
          ]
        },
        {
          id: 4,
          name: 'Desserts',
          icon: '🍰',
          subCategories: [
            { id: 10, name: 'Cakes', imageIndex: 3, emojiIndex: 0 },
            { id: 11, name: 'Ice Cream', imageIndex: 4, emojiIndex: 1 },
            { id: 12, name: 'Pastries', imageIndex: 5, emojiIndex: 2 },
          ]
        },
        {
          id: 5,
          name: 'Breakfast',
          icon: '🍳',
          subCategories: [
            { id: 13, name: 'Eggs & Omelettes', imageIndex: 0, emojiIndex: 0 },
            { id: 14, name: 'Pancakes & Waffles', imageIndex: 1, emojiIndex: 1 },
            { id: 15, name: 'Sandwiches', imageIndex: 2, emojiIndex: 2 },
          ]
        }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
  }, []);

  const getSubCategoryIcon = (category, subCategory) => {
    if (useImages) {
      return (
        <img 
          src={sampleImages[subCategory.imageIndex]} 
          alt={subCategory.name}
          className="subcategory-image"
          onError={(e) => {
            e.target.style.display = 'none';  // Hide the broken image
            setUseImages(false);
          }}
        />
      );
    } else {
      return (
        <span className="subcategory-emoji">
          {sampleEmojis[category.name][subCategory.emojiIndex]}
        </span>
      );
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleAddCategory = (newCategory) => {
    const newId = Math.max(...categories.map(cat => cat.id), 0) + 1;
    const categoryToAdd = {
      id: newId,
      name: newCategory.name,
      icon: newCategory.icon || '🍽️',
      order: parseInt(newCategory.order),
      subCategories: []
    };

    // Add default emojis for the new category if it doesn't exist
    if (!sampleEmojis[newCategory.name]) {
      sampleEmojis[newCategory.name] = ['🍽️', '🍴', '🥄', '🍽️', '🥢', '🍴', '🥄', '🍽️'];
    }

    const updatedCategories = [...categories, categoryToAdd];
    // Sort categories by order if provided
    updatedCategories.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }
  };

  const handleAddSubCategory = (newSubCategory) => {
    const parentId = parseInt(newSubCategory.parent);
    const parent = categories.find(cat => cat.id === parentId);
    
    if (!parent) return;

    const newSubCategoryId = Math.max(...categories.flatMap(cat => 
      cat.subCategories.map(sub => sub.id)
    ), 0) + 1;

    const subCategoryToAdd = {
      id: newSubCategoryId,
      name: newSubCategory.name,
      imageIndex: parent.subCategories.length % sampleImages.length,
      emojiIndex: parent.subCategories.length % sampleEmojis[parent.name].length,
      order: parseInt(newSubCategory.order)
    };

    const updatedCategories = categories.map(category => {
      if (category.id === parentId) {
        const updatedSubCategories = [...category.subCategories, subCategoryToAdd]
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        return {
          ...category,
          subCategories: updatedSubCategories
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setExpandedCategories(prev => ({ ...prev, [parentId]: true }));
  };

  const handleEditSubCategory = (updatedSubCategory) => {
    const parentId = parseInt(updatedSubCategory.parent);
    const newParent = categories.find(cat => cat.id === parentId);
    
    if (!newParent) return;

    const updatedCategories = categories.map(category => {
      // Remove from old parent if parent changed
      if (category.id === editSubCategoryModal.parentCategory.id && parentId !== category.id) {
        return {
          ...category,
          subCategories: category.subCategories.filter(sub => sub.id !== updatedSubCategory.id)
        };
      }
      
      // Add to new parent or update in current parent
      if (category.id === parentId) {
        const existingSubIndex = category.subCategories.findIndex(sub => sub.id === updatedSubCategory.id);
        const updatedSubCategories = [...category.subCategories];
        
        const newSubCategory = {
          id: updatedSubCategory.id,
          name: updatedSubCategory.name,
          order: parseInt(updatedSubCategory.order),
          imageIndex: existingSubIndex >= 0 ? category.subCategories[existingSubIndex].imageIndex : category.subCategories.length % sampleImages.length,
          emojiIndex: sampleEmojis[category.name].indexOf(updatedSubCategory.icon)
        };

        if (existingSubIndex >= 0) {
          updatedSubCategories[existingSubIndex] = newSubCategory;
        } else {
          updatedSubCategories.push(newSubCategory);
        }

        return {
          ...category,
          subCategories: updatedSubCategories.sort((a, b) => (a.order || 0) - (b.order || 0))
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setExpandedCategories(prev => ({ ...prev, [parentId]: true }));
  };

  const handleDeleteSubCategory = (categoryId, subCategoryId) => {
    if (window.confirm('Are you sure you want to delete this sub-category?')) {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            subCategories: category.subCategories.filter(sub => sub.id !== subCategoryId)
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }
  };

  // Add this function to handle category editing
  const handleEditCategory = (categoryId) => {
    const categoryToEdit = categories.find(cat => cat.id === categoryId);
    setEditCategoryModal({
      isOpen: true,
      category: categoryToEdit
    });
  };

  const handleEditCategorySubmit = (updatedCategory) => {
    const updatedCategories = categories.map(category =>
      category.id === updatedCategory.id
        ? {
            ...category,
            name: updatedCategory.name,
            order: parseInt(updatedCategory.order),
            icon: updatedCategory.icon
          }
        : category
    );

    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const filteredCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));

          return (
    <div className="categories-container">
      <div className="categories-controls">
        <div className="search-box">
          <MagnifyingGlass weight="bold" className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-category-btn" onClick={() => setIsModalOpen(true)}>
          <Plus weight="bold" />
          Add category
        </button>
      </div>

      <div className="categories-list">
        {filteredCategories.map(category => (
          <div key={category.id} className="category-item">
            <div className="category-header">
              <div className="category-info">
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </div>
              <div className="category-actions">
                {expandedCategories[category.id] ? (
                  <>
                    <button 
                      className="add-subcategory-btn"
                      onClick={() => {
                        setSelectedParentId(category.id);
                        setIsSubCategoryModalOpen(true);
                      }}
                    >
                      <Plus weight="bold" />
                      Add Sub-category
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditCategory(category.id)}
                    >
                      <PencilSimple weight="bold" />
                      Edit Category
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash weight="bold" />
                      Delete
                    </button>
                  </>
                ) : null}
                <button 
                  className="expand-btn"
                  onClick={() => toggleCategory(category.id)}
                >
                  {expandedCategories[category.id] ? (
                    <CaretUp weight="bold" />
                  ) : (
                    <CaretDown weight="bold" />
                  )}
                </button>
              </div>
            </div>
            
            {expandedCategories[category.id] && category.subCategories.length > 0 && (
              <div className="subcategories-list">
                {category.subCategories
                  .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0))
                  .map(subCategory => (
                    <div key={subCategory.id} className="subcategory-item">
                      <div className="subcategory-info">
                        {getSubCategoryIcon(category, subCategory)}
                        <span className="subcategory-name">{subCategory.name}</span>
                      </div>
                      <div className="subcategory-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => setEditSubCategoryModal({
                            isOpen: true,
                            subCategory,
                            parentCategory: category
                          })}
                        >
                          <PencilSimple weight="bold" />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteSubCategory(category.id, subCategory.id)}
                        >
                          <Trash weight="bold" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <CategoryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      <SubCategoryFormModal 
        isOpen={isSubCategoryModalOpen}
        onClose={() => {
          setIsSubCategoryModalOpen(false);
          setSelectedParentId(null);
        }}
        onSubmit={handleAddSubCategory}
        parentCategories={categories}
        selectedParentId={selectedParentId}
      />

      <EditSubCategoryModal 
        isOpen={editSubCategoryModal.isOpen}
        onClose={() => setEditSubCategoryModal({ isOpen: false, subCategory: null, parentCategory: null })}
        onSubmit={handleEditSubCategory}
        parentCategories={categories}
        subCategory={editSubCategoryModal.subCategory}
        parentCategory={editSubCategoryModal.parentCategory}
      />

      <EditCategoryModal
        isOpen={editCategoryModal.isOpen}
        onClose={() => setEditCategoryModal({ isOpen: false, category: null })}
        onSubmit={handleEditCategorySubmit}
        category={editCategoryModal.category}
      />
                    </div>
          );
};

export default CategoriesSub;
