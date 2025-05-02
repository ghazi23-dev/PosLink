import { useState, useEffect } from 'react';
import { 
  MagnifyingGlass, 
  Plus, 
  PencilSimple, 
  Trash,
  CaretDown,
  CaretUp,
  X,
  Minus
} from '@phosphor-icons/react';
import './supplements.css';

// Add Family Supplement Modal Component
const FamilySupplementFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    selectedCategories: new Set(),
    expandedCategories: new Set()
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  // Load categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert selected categories to a structured format
      const selectedCategoriesData = Array.from(formData.selectedCategories).map(key => {
        const [categoryId, subCategoryIndex] = key.split('-');
        return {
          categoryId: parseInt(categoryId),
          subCategoryIndex: subCategoryIndex ? parseInt(subCategoryIndex) : null
        };
      });

      onSubmit({
        name: formData.name,
        selectedCategories: selectedCategoriesData
      });
      onClose();
      setFormData({
        name: '',
        selectedCategories: new Set(),
        expandedCategories: new Set()
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

  const toggleCategory = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      expandedCategories: new Set(
        prev.expandedCategories.has(categoryId)
          ? Array.from(prev.expandedCategories).filter(id => id !== categoryId)
          : [...prev.expandedCategories, categoryId]
      )
    }));
  };

  const handleCategorySelect = (categoryId, subCategoryIndex = null) => {
    const key = subCategoryIndex !== null 
      ? `${categoryId}-${subCategoryIndex}` 
      : `${categoryId}`;

    setFormData(prev => {
      const newSelectedCategories = new Set(prev.selectedCategories);
      
      if (subCategoryIndex === null) {
        // If selecting/deselecting a main category
        const category = categories.find(cat => cat.id === categoryId);
        const isSelected = !prev.selectedCategories.has(key);
        
        // Remove all subcategories of this category
        Array.from(prev.selectedCategories).forEach(selectedKey => {
          if (selectedKey.startsWith(`${categoryId}-`)) {
            newSelectedCategories.delete(selectedKey);
          }
        });

        // If selecting the main category, add all its subcategories
        if (isSelected && category) {
          category.subCategories.forEach((_, index) => {
            newSelectedCategories.add(`${categoryId}-${index}`);
          });
        }
      }

      // Toggle the selected item
      if (newSelectedCategories.has(key)) {
        newSelectedCategories.delete(key);
      } else {
        newSelectedCategories.add(key);
      }

      return {
        ...prev,
        selectedCategories: newSelectedCategories
      };
    });
  };

  const getSelectedCount = (category) => {
    const prefix = `${category.id}-`;
    const selectedSubCategories = Array.from(formData.selectedCategories)
      .filter(key => key.startsWith(prefix)).length;
    return `(${selectedSubCategories}/${category.subCategories.length})`;
  };

  const isCategorySelected = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return false;

    const selectedSubCategories = Array.from(formData.selectedCategories)
      .filter(key => key.startsWith(`${categoryId}-`)).length;
    
    return selectedSubCategories === category.subCategories.length;
  };

  const isSubCategorySelected = (categoryId, subCategoryIndex) => {
    return formData.selectedCategories.has(`${categoryId}-${subCategoryIndex}`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Family Supplement</h3>
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
              placeholder="Enter family supplement name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="categories-selection">
            {categories.map(category => (
              <div key={category.id} className="category-group">
                <div 
                  className="category-header"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="category-title">
                    <input
                      type="checkbox"
                      checked={isCategorySelected(category.id)}
                      onChange={() => handleCategorySelect(category.id)}
                      onClick={e => e.stopPropagation()}
                    />
                    <span>{category.icon} {category.name}</span>
                    <span className="count">{getSelectedCount(category)}</span>
                  </div>
                  {formData.expandedCategories.has(category.id) ? (
                    <CaretUp weight="bold" className="caret-icon" />
                  ) : (
                    <CaretDown weight="bold" className="caret-icon" />
                  )}
                </div>
                {formData.expandedCategories.has(category.id) && (
                  <div className="subcategories-list">
                    {category.subCategories.map((subCategory, index) => (
                      <div key={index} className="subcategory-item">
                        <div className="subcategory-label">
                          {subCategory.icon || category.icon} {subCategory.name}
                        </div>
                        <div className="subcategory-checkbox">
                          <input
                            type="checkbox"
                            checked={isSubCategorySelected(category.id, index)}
                            onChange={() => handleCategorySelect(category.id, index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!formData.name.trim()}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Supplement Modal Component
const SupplementFormModal = ({ isOpen, onClose, onSubmit, familyId }) => {
  const [formData, setFormData] = useState({
    name: '',
    order: '',
    price: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.order.trim()) newErrors.order = 'Order is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, familyId });
      onClose();
      setFormData({
        name: '',
        order: '',
        price: ''
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
          <h3>Add Supplement</h3>
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
              placeholder="Enter supplement name"
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
            <label htmlFor="price">
              Price <span className="required">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className={errors.price ? 'error' : ''}
              step="0.01"
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!formData.name.trim() || !formData.order.trim() || !formData.price.trim()}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Edit Supplement Modal Component
const EditSupplementModal = ({ isOpen, onClose, onSubmit, supplement }) => {
  const [formData, setFormData] = useState({
    name: '',
    order: '',
    price: '',
    tva: '',
    active: true,
    ingredients: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplement && isOpen) {
      setFormData({
        name: supplement.name || '',
        order: supplement.order?.toString() || '',
        price: supplement.price?.toString() || '',
        tva: supplement.tva?.toString() || '',
        active: supplement.active ?? true,
        ingredients: supplement.ingredients || []
      });
    }
  }, [supplement, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.order.trim()) newErrors.order = 'Order is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.tva.trim()) newErrors.tva = 'TVA is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...supplement,
        name: formData.name,
        order: parseInt(formData.order),
        price: parseFloat(formData.price),
        tva: parseFloat(formData.tva),
        active: formData.active,
        ingredients: formData.ingredients
      });
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: value === 'yes'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, {
        ingredient: '',
        unit: '',
        quantity: '',
        mandatory: false,
        defaultValue: ''
      }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Supplement</h3>
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
              placeholder="Enter supplement name"
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
            <label htmlFor="price">
              Price (DT) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className={errors.price ? 'error' : ''}
              step="0.01"
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tva">
              TVA <span className="required">*</span>
            </label>
            <input
              type="number"
              id="tva"
              name="tva"
              value={formData.tva}
              onChange={handleChange}
              placeholder="Enter TVA"
              className={errors.tva ? 'error' : ''}
              step="0.01"
            />
            {errors.tva && <span className="error-text">{errors.tva}</span>}
          </div>

          <div className="form-group">
            <label className="radio-label">
              Active <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="active"
                  value="yes"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <span>Yes</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="active"
                  value="no"
                  checked={!formData.active}
                  onChange={handleChange}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="ingredients-section">
            <div className="ingredients-header">
              <h4>Ingredients Management for Supplement</h4>
              <button 
                type="button" 
                className="add-ingredient-btn"
                onClick={addIngredient}
              >
                <Plus weight="bold" />
              </button>
            </div>
            
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <div className="ingredient-fields">
                  <select
                    value={ingredient.ingredient}
                    onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                    className="ingredient-select"
                  >
                    <option value="">Ingredients</option>
                    {/* Add your ingredients options here */}
                  </select>
                  
                  <select
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="unit-select"
                  >
                    <option value="">Unit</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                  </select>
                  
                  <input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    placeholder="Quantities"
                    className="quantity-input"
                  />
                  
                  <select
                    value={ingredient.mandatory}
                    onChange={(e) => handleIngredientChange(index, 'mandatory', e.target.value === 'true')}
                    className="mandatory-select"
                  >
                    <option value="">Mandatory?</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                  
                  <input
                    type="number"
                    value={ingredient.defaultValue}
                    onChange={(e) => handleIngredientChange(index, 'defaultValue', e.target.value)}
                    placeholder="Default value"
                    className="default-value-input"
                  />
                </div>
                
                <button 
                  type="button"
                  className="remove-ingredient-btn"
                  onClick={() => removeIngredient(index)}
                >
                  <Minus weight="bold" />
                </button>
              </div>
            ))}
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

const Supplements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFamilies, setExpandedFamilies] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [families, setFamilies] = useState([]);
  const [isSupplementModalOpen, setIsSupplementModalOpen] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState(null);
  const [editSupplementModal, setEditSupplementModal] = useState({
    isOpen: false,
    supplement: null,
    familyId: null
  });

  // Load families from localStorage on component mount
  useEffect(() => {
    const savedFamilies = localStorage.getItem('supplementFamilies');
    if (savedFamilies) {
      setFamilies(JSON.parse(savedFamilies));
    } else {
      // Initialize with default families if none exist
      const defaultFamilies = [
        {
          id: 1,
          name: 'Sauces',
          order: 1,
          supplements: [
            { id: 1, name: 'Ketchup', order: 1, price: 0.5 },
            { id: 2, name: 'Mayonnaise', order: 2, price: 0.5 },
            { id: 3, name: 'BBQ Sauce', order: 3, price: 0.75 },
          ]
        },
        {
          id: 2,
          name: 'Toppings',
          order: 2,
          supplements: [
            { id: 4, name: 'Extra Cheese', order: 1, price: 1.0 },
            { id: 5, name: 'Mushrooms', order: 2, price: 0.75 },
            { id: 6, name: 'Bacon', order: 3, price: 1.5 },
          ]
        }
      ];
      setFamilies(defaultFamilies);
      localStorage.setItem('supplementFamilies', JSON.stringify(defaultFamilies));
    }
  }, []);

  const toggleFamily = (familyId) => {
    setExpandedFamilies(prev => ({
      ...prev,
      [familyId]: !prev[familyId]
    }));
  };

  const handleAddFamily = (newFamily) => {
    const newId = Math.max(...families.map(fam => fam.id), 0) + 1;
    const familyToAdd = {
      id: newId,
      name: newFamily.name,
      order: parseInt(newFamily.order),
      supplements: []
    };

    const updatedFamilies = [...families, familyToAdd]
      .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
    
    setFamilies(updatedFamilies);
    localStorage.setItem('supplementFamilies', JSON.stringify(updatedFamilies));
  };

  const handleDeleteFamily = (familyId) => {
    if (window.confirm('Are you sure you want to delete this family supplement?')) {
      const updatedFamilies = families.filter(fam => fam.id !== familyId);
      setFamilies(updatedFamilies);
      localStorage.setItem('supplementFamilies', JSON.stringify(updatedFamilies));
    }
  };

  const handleAddSupplement = (newSupplement) => {
    const familyId = parseInt(newSupplement.familyId);
    const parent = families.find(fam => fam.id === familyId);
    
    if (!parent) return;

    const newSupplementId = Math.max(...families.flatMap(fam => 
      fam.supplements.map(sup => sup.id)
    ), 0) + 1;

    const supplementToAdd = {
      id: newSupplementId,
      name: newSupplement.name,
      order: parseInt(newSupplement.order),
      price: parseFloat(newSupplement.price)
    };

    const updatedFamilies = families.map(family => {
      if (family.id === familyId) {
        const updatedSupplements = [...family.supplements, supplementToAdd]
          .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
        
        return {
          ...family,
          supplements: updatedSupplements
        };
      }
      return family;
    });

    setFamilies(updatedFamilies);
    localStorage.setItem('supplementFamilies', JSON.stringify(updatedFamilies));
    setExpandedFamilies(prev => ({ ...prev, [familyId]: true }));
  };

  const handleDeleteSupplement = (familyId, supplementId) => {
    if (window.confirm('Are you sure you want to delete this supplement?')) {
      const updatedFamilies = families.map(family => {
        if (family.id === familyId) {
          return {
            ...family,
            supplements: family.supplements.filter(sup => sup.id !== supplementId)
          };
        }
        return family;
      });

      setFamilies(updatedFamilies);
      localStorage.setItem('supplementFamilies', JSON.stringify(updatedFamilies));
    }
  };

  const handleEditSupplement = (familyId, supplement) => {
    setEditSupplementModal({
      isOpen: true,
      supplement,
      familyId
    });
  };

  const handleEditSupplementSubmit = (updatedSupplement) => {
    const updatedFamilies = families.map(family => {
      if (family.id === editSupplementModal.familyId) {
        return {
          ...family,
          supplements: family.supplements.map(supplement =>
            supplement.id === updatedSupplement.id ? updatedSupplement : supplement
          ).sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0))
        };
      }
      return family;
    });

    setFamilies(updatedFamilies);
    localStorage.setItem('supplementFamilies', JSON.stringify(updatedFamilies));
  };

  const filteredFamilies = families
    .filter(family =>
      family.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));

          return (
    <div className="supplements-container">
      <div className="supplements-controls">
        <div className="search-box">
          <MagnifyingGlass weight="bold" className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-family-btn" onClick={() => setIsModalOpen(true)}>
          <Plus weight="bold" />
          Add Family Supplement
        </button>
      </div>

      <div className="families-list">
        {filteredFamilies.map(family => (
          <div key={family.id} className="family-item">
            <div className="family-header">
              <div className="family-info">
                <span className="family-name">{family.name}</span>
              </div>
              <div className="family-actions">
                {expandedFamilies[family.id] ? (
                  <>
                    <button 
                      className="add-supplement-btn"
                      onClick={() => {
                        setSelectedFamilyId(family.id);
                        setIsSupplementModalOpen(true);
                      }}
                    >
                      <Plus weight="bold" />
                      Add Supplement
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteFamily(family.id)}
                    >
                      <Trash weight="bold" />
                      Delete
                    </button>
                  </>
                ) : null}
                <button 
                  className="expand-btn"
                  onClick={() => toggleFamily(family.id)}
                >
                  {expandedFamilies[family.id] ? (
                    <CaretUp weight="bold" />
                  ) : (
                    <CaretDown weight="bold" />
                  )}
                </button>
              </div>
            </div>
            
            {expandedFamilies[family.id] && family.supplements.length > 0 && (
              <div className="supplements-list">
                {family.supplements
                  .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0))
                  .map(supplement => (
                    <div key={supplement.id} className="supplement-item">
                      <div className="supplement-info">
                        <span className="supplement-name">{supplement.name}</span>
                        <span className="supplement-price">{supplement.price.toFixed(2)}&nbsp;TND</span>
                      </div>
                      <div className="supplement-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditSupplement(family.id, supplement)}
                        >
                          <PencilSimple weight="bold" />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteSupplement(family.id, supplement.id)}
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

      <FamilySupplementFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddFamily}
      />

      <SupplementFormModal 
        isOpen={isSupplementModalOpen}
        onClose={() => {
          setIsSupplementModalOpen(false);
          setSelectedFamilyId(null);
        }}
        onSubmit={handleAddSupplement}
        familyId={selectedFamilyId}
      />

      <EditSupplementModal 
        isOpen={editSupplementModal.isOpen}
        onClose={() => setEditSupplementModal({ isOpen: false, supplement: null, familyId: null })}
        onSubmit={handleEditSupplementSubmit}
        supplement={editSupplementModal.supplement}
      />
                    </div>
          );
};

export default Supplements;
