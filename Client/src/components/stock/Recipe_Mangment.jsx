import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlass,
  Plus,
  DotsThree,
  X
} from '@phosphor-icons/react';
import { MoreVertical} from 'lucide-react';

import './Recipe_Management.css';

const ActionMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef(null);

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
        <MoreVertical className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="rm-action-menu-dropdown">
          <button 
            className="rm-action-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
          >
            Edit recipe
          </button>
          <button 
            className="rm-action-menu-item delete"
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

const RecipeFormModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    cost: '',
    quantity: '',
    ingredients: [{ name: '', quantity: 0, unit: 'Kg', cost: 0 }]
  });

  useEffect(() => {
    if (mode === 'add') {
      setFormData({
        name: '',
        unit: '',
        cost: '',
        quantity: '',
        ingredients: [{ name: '', quantity: 0, unit: 'Kg', cost: 0 }]
      });
    } else if (initialData) {
      setFormData({
        name: initialData.name,
        unit: initialData.unit,
        cost: initialData.cost,
        quantity: initialData.quantity,
        ingredients: initialData.ingredients.map(ing => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          cost: ing.cost
        }))
      });
    }
  }, [initialData, mode, isOpen]);

  const handleNameChange = (e) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: 0, unit: 'Kg', cost: 0 }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleQuantityChange = (index, increment) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index 
          ? { ...ing, quantity: Math.max(0, ing.quantity + increment) }
          : ing
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      unit: '',
      cost: '',
      quantity: '',
      ingredients: [{ name: '', quantity: 0, unit: 'Kg', cost: 0 }]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rm-modal-overlay">
      <div className="rm-modal-content">
        <div className="rm-modal-header">
          <h3 className="rm-modal-title">{mode === 'add' ? 'Add Recipe' : 'Edit Recipe'}</h3>
          <button className="rm-modal-close" onClick={onClose}>
            <X weight="bold" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="rm-modal-body">
          <div className="rm-recipe-name-input">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter recipe name"
              required
            />
          </div>

          <div className="rm-recipe-details">
            <div className="rm-form-group">
              <label>Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="e.g., 200g, 1L"
                required
              />
            </div>

            <div className="rm-form-group">
              <label>Cost (DT)</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="Enter cost"
                required
                min="0"
                step="0.1"
              />
            </div>

            <div className="rm-form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
                required
                min="0"
              />
            </div>
          </div>

          <div className="rm-ingredients-header">
            <div className="left">
              <h4>List the ingredients of your recipe</h4>
              <span className="count">{formData.ingredients.length}</span>
            </div>
            <button type="button" className="rm-add-ingredient-btn" onClick={addIngredient}>
              <Plus weight="bold" />
             
            </button>
          </div>

          <table className="rm-ingredients-table">
            <thead>
              <tr>
                <th>INGREDIENTS</th>
                <th>QUANTITY</th>
                <th>UNIT</th>
                <th>COST</th>
                <th>DELETE</th>
              </tr>
            </thead>
            <tbody>
              {formData.ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td>
                    <select
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      required
                    >
                      <option value="">Select ingredient</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Onion">Onion</option>
                      <option value="Oil">Oil</option>
                      <option value="Flour">Flour</option>
                      <option value="Sugar">Sugar</option>
                      <option value="Salt">Salt</option>
                      <option value="Pepper">Pepper</option>
                      <option value="Cheese">Cheese</option>
                      <option value="Water">Water</option>
                      <option value="Yeast">Yeast</option>

                      <option value="Other">Other</option>
                    </select>
                  </td>
                  <td>
                    <div className="rm-quantity-control">
                      <button 
                        type="button"
                        onClick={() => handleQuantityChange(index, -1)}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                      <button 
                        type="button"
                        onClick={() => handleQuantityChange(index, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <select
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    >
                      <option value="Kg">Kg</option>
                      <option value="Ex:Kg">Ex:Kg</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={ingredient.cost}
                      onChange={(e) => handleIngredientChange(index, 'cost', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="rm-delete-ingredient"
                      onClick={() => removeIngredient(index)}
                    >
                      −
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="rm-modal-footer">
            <button type="button" className="rm-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rm-btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [
      { 
        id: 1, 
        name: 'Pizza Dough', 
        unit: '200 g', 
        cost: 20, 
        quantity: 32, 
        ingredients: [
          { name: 'Flour', quantity: 5, unit: 'Kg', cost: 1.2 },
          { name: 'Tomato', quantity: 5, unit: 'Kg', cost: 2.8 },
          { name: 'Oil', quantity: 2, unit: 'Kg', cost: 1.5 },
          { name: 'Onion', quantity: 3, unit: 'Kg', cost: 0.8 },
          { name: 'Water', quantity: 1, unit: 'L', cost: 0.5 },
          { name: 'Yeast', quantity: 1, unit: 'g', cost: 0.2 }
        ]
      },
      { 
        id: 2, 
        name: 'Crepe Dough', 
        unit: '120 ml', 
        cost: 120, 
        quantity: 3, 
        ingredients: [
          { name: 'Flour', quantity: 3, unit: 'Kg', cost: 1.2 },
          { name: 'Oil', quantity: 1, unit: 'Kg', cost: 1.5 },
          { name: 'Water', quantity: 1, unit: 'L', cost: 0.5 },
          { name: 'Yeast', quantity: 1, unit: 'g', cost: 0.2 }
        ]
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', data: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Save to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const currentRecipes = filteredRecipes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = (formData) => {
    if (modalState.mode === 'add') {
      const newId = Math.max(...recipes.map(r => r.id), 0) + 1;
      setRecipes([...recipes, { ...formData, id: newId }]);
    } else {
      setRecipes(recipes.map(recipe =>
        recipe.id === modalState.data.id ? { ...formData, id: recipe.id } : recipe
      ));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
    }
  };

  return (
    <div className="rm-recipes-container">
      <div className="rm-recipes-controls">
        <div className="rm-search-box">
          <MagnifyingGlass weight="bold" className="rm-search-icon" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className="rm-add-btn"
          onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
        >
          <Plus weight="bold" />
          Add Recipe
        </button>
      </div>

      <div className="rm-table-container">
        <table className="rm-data-table">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>UNIT</th>
              <th>UNIT COST</th>
              <th>QUANTITY</th>
              <th>INGREDIENTS</th>
              <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
            {currentRecipes.map(recipe => (
              <tr key={recipe.id}>
                <td>{recipe.name}</td>
              <td>{recipe.unit}</td>
              <td>{recipe.cost} DT</td>
              <td>{recipe.quantity}</td>
              <td>
                  <div className="rm-ingredients-tags">
                  {recipe.ingredients.map((ingredient, index) => (
                      <span key={index} className="rm-ingredient-tag">
                        {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                      </span>
                  ))}
                </div>
              </td>
                <td>
                  <ActionMenu
                    onEdit={() => setModalState({ isOpen: true, mode: 'edit', data: recipe })}
                    onDelete={() => handleDelete(recipe.id)}
                  />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

        {totalPages > 1 && (
          <div className="rm-pagination">
            <button 
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
            >
              ‹
                </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
            >
              ›
                </button>
          </div>
        )}
        </div>

      <RecipeFormModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSubmit={handleSubmit}
        initialData={modalState.data}
        mode={modalState.mode}
      />
    </div>
  );
};

export default RecipeManagement;
