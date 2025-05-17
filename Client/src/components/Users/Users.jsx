import { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, 
  FileXls, 
  FilePdf,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  X,
  Check,
  FunnelSimple,
  Plus,
  CaretUp,
  CaretDown
} from '@phosphor-icons/react';
import { MoreVertical } from 'lucide-react';
import { faArrowDownShortWide } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loadJsonData, getFromLocalStorage, saveToLocalStorage } from '../../utils/jsonUtils';
import './Users.css';

// User Form Modal Component (remains the same)
const UserFormModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '', // We don't show the existing password for security
        role: initialData.role || 'user'
      });
    } else if (mode === 'add') {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
  }, [initialData, mode]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email format';
    }
    if (mode === 'add' && !formData.password) {
      newErrors.password = 'Password is required';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // If editing and password is empty, send the form data without the password
      if (mode === 'edit' && !formData.password) {
        const dataWithoutPassword = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        onSubmit(dataWithoutPassword);
      } else {
      onSubmit(formData);
      }
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
          <h3>{mode === 'add' ? 'Add New User' : 'Edit User'}</h3>
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
              placeholder="Enter user name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
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
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password {mode === 'edit' && '(Leave empty to keep current password)'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={mode === 'add' ? 'Enter password' : 'Enter new password'}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
             
              <option value="Administrator">Administrator</option>
              <option value="Manager">Manager</option>
              <option value="Waiter">Waiter</option>
              <option value="Cashier">Cashier</option>
              <option value="Chef">Chef</option>
              <option value="Barman">Barman</option>
              <option value="Moderator">Moderator</option>
              <option value="Joker">Joker</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
             
              {mode === 'add' ? 'Add User' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Role Form Modal Component
const RoleFormModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    permissions: {
      tableManagement: {
        enabled: false,
        deletion: false,
        cancelation: false,
        addSpace: false,
        creation: false,
        assignServer: false
      },
      menuConfiguration: {
        enabled: false,
        addCategory: false,
        addSubCategory: false,
        addProduct: false,
        favorites: false,
        ingredientCreation: false,
        deletion: false,
        modification: false
      },
      cashDrawer: {
        enabled: false
      },
      payment: {
        enabled: false
      }
    }
  });

  const [expandedSections, setExpandedSections] = useState({
    tableManagement: true,
    menuConfiguration: false,
    cashDrawer: false,
    payment: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePermissionChange = (section, permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: {
          ...prev.permissions[section],
          [permission]: !prev.permissions[section][permission]
        }
      }
    }));
  };

  const handleSectionToggle = (section) => {
    const sectionEnabled = !formData.permissions[section].enabled;
    const updatedSection = {};
    
    // Set all permissions in the section to the new enabled state
    Object.keys(formData.permissions[section]).forEach(key => {
      updatedSection[key] = sectionEnabled;
    });

    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: {
          ...updatedSection
        }
      }
    }));
  };

  const getSelectedCount = (section) => {
    const permissions = formData.permissions[section];
    const total = Object.keys(permissions).length - 1; // Subtract 1 to exclude 'enabled'
    const selected = Object.entries(permissions)
      .filter(([key, value]) => key !== 'enabled' && value)
      .length;
    return `(${selected}/${total})`;
  };

  const handleNameChange = (e) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  useEffect(() => {
    if (initialData && mode === 'edit') {
      // Transform the stored permissions format back to form format
      const transformedPermissions = {
        tableManagement: {
          enabled: initialData.permissions.others || false,
          deletion: false,
          cancelation: false,
          addSpace: false,
          creation: false,
          assignServer: false
        },
        menuConfiguration: {
          enabled: initialData.permissions.addMenu || false,
          addCategory: false,
          addSubCategory: false,
          addProduct: false,
          favorites: false,
          ingredientCreation: false,
          deletion: false,
          modification: false
        },
        cashDrawer: {
          enabled: initialData.permissions.cashdrawer || false
        },
        payment: {
          enabled: initialData.permissions.others || false
        }
      };

      setFormData({
        ...initialData,
        permissions: transformedPermissions
      });
    }
  }, [initialData, mode]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{mode === 'add' ? 'Add New Role' : 'Update Role'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X weight="bold" />
          </button>
        </div>
        <div className="modal-body">
          <div className="roles-section">
            <div className="form-group">
              <label>Name <span className="required">*</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Ex: Administrator.."
                className="role-name-input"
              />
            </div>

            <div className="roles-header">
              <span>Roles :</span>
              <button className="select-all-btn">Select All</button>
            </div>

            {/* Table Management Section */}
            <div className="permission-section">
              <div 
                className="section-header" 
                onClick={() => toggleSection('tableManagement')}
              >
                <div className="section-title">
                  <input
                    type="checkbox"
                    checked={formData.permissions.tableManagement.enabled}
                    onChange={() => handleSectionToggle('tableManagement')}
                  />
                  <span>Table Management</span>
                  <span className="count">{getSelectedCount('tableManagement')}</span>
                </div>
                {expandedSections.tableManagement ? (
                  <CaretUp size={16} className="expand-icon" />
                ) : (
                  <CaretDown size={16} className="expand-icon" />
                )}
              </div>
              {expandedSections.tableManagement && (
                <div className="section-content">
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.tableManagement.deletion}
                      onChange={() => handlePermissionChange('tableManagement', 'deletion')}
                    />
                    <span>Deletion</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.tableManagement.cancelation}
                      onChange={() => handlePermissionChange('tableManagement', 'cancelation')}
                    />
                    <span>Cancelation</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.tableManagement.addSpace}
                      onChange={() => handlePermissionChange('tableManagement', 'addSpace')}
                    />
                    <span>Add Space</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.tableManagement.creation}
                      onChange={() => handlePermissionChange('tableManagement', 'creation')}
                    />
                    <span>Creation</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.tableManagement.assignServer}
                      onChange={() => handlePermissionChange('tableManagement', 'assignServer')}
                    />
                    <span>Assign a server</span>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Configuration Section */}
            <div className="permission-section">
              <div 
                className="section-header" 
                onClick={() => toggleSection('menuConfiguration')}
              >
                <div className="section-title">
                  <input
                    type="checkbox"
                    checked={formData.permissions.menuConfiguration.enabled}
                    onChange={() => handleSectionToggle('menuConfiguration')}
                  />
                  <span>Menu Configuration</span>
                  <span className="count">{getSelectedCount('menuConfiguration')}</span>
                </div>
                {expandedSections.menuConfiguration ? (
                  <CaretUp size={16} className="expand-icon" />
                ) : (
                  <CaretDown size={16} className="expand-icon" />
                )}
              </div>
              {expandedSections.menuConfiguration && (
                <div className="section-content">
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.menuConfiguration.addCategory}
                      onChange={() => handlePermissionChange('menuConfiguration', 'addCategory')}
                    />
                    <span>Add category</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.menuConfiguration.addSubCategory}
                      onChange={() => handlePermissionChange('menuConfiguration', 'addSubCategory')}
                    />
                    <span>Add sub-category</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.menuConfiguration.addProduct}
                      onChange={() => handlePermissionChange('menuConfiguration', 'addProduct')}
                    />
                    <span>Add product</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.menuConfiguration.favorites}
                      onChange={() => handlePermissionChange('menuConfiguration', 'favorites')}
                    />
                    <span>Favorites</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.menuConfiguration.ingredientCreation}
                      onChange={() => handlePermissionChange('menuConfiguration', 'ingredientCreation')}
                    />
                    <span>Ingredient Creation</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.menuConfiguration.deletion}
                      onChange={() => handlePermissionChange('menuConfiguration', 'deletion')}
                    />
                    <span>Deletion</span>
                  </div>
                  <div className="permission-item">
                    <input
                      type="checkbox"
                      checked={formData.permissions.menuConfiguration.modification}
                      onChange={() => handlePermissionChange('menuConfiguration', 'modification')}
                    />
                    <span>Modification</span>
                  </div>
                </div>
              )}
            </div>

            {/* Cash Drawer Section */}
            <div className="permission-section">
              <div 
                className="section-header" 
                onClick={() => toggleSection('cashDrawer')}
              >
                <div className="section-title">
                  <input
                    type="checkbox"
                    checked={formData.permissions.cashDrawer.enabled}
                    onChange={() => handleSectionToggle('cashDrawer')}
                  />
                  <span>Cash Drawer</span>
                  <span className="count">(8/8)</span>
                </div>
                {expandedSections.cashDrawer ? (
                  <CaretUp size={16} className="expand-icon" />
                ) : (
                  <CaretDown size={16} className="expand-icon" />
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className="permission-section">
              <div 
                className="section-header" 
                onClick={() => toggleSection('payment')}
              >
                <div className="section-title">
                  <input
                    type="checkbox"
                    checked={formData.permissions.payment.enabled}
                    onChange={() => handleSectionToggle('payment')}
                  />
                  <span>Payment</span>
                  <span className="count">(3/11)</span>
                </div>
                {expandedSections.payment ? (
                  <CaretUp size={16} className="expand-icon" />
                ) : (
                  <CaretDown size={16} className="expand-icon" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            onClick={() => onSubmit(formData)}
            disabled={!formData.name.trim()}
          >
            {mode === 'add' ? 'Add Role' : 'Update Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionMenu = ({ onEdit, onDelete }) => {
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
        <MoreVertical className="w-5 h-5 mr-3"  />
      </button>
      {isOpen && (
          <div className="action-menu-dropdown">
          <button 
            className="action-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
          >
              <PencilSimple weight="bold" />
              Edit
            </button>
          <button 
            className="action-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsOpen(false);
            }}
          >
              <Trash weight="bold" />
              Delete
            </button>
          </div>
      )}
    </div>
  );
};

const Users = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userModalState, setUserModalState] = useState({ isOpen: false, mode: 'add', userData: null });
  const [roleModalState, setRoleModalState] = useState({ isOpen: false, mode: 'add', roleData: null });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const itemsPerPage = 10;

  const filterOptions = [
    'All',
    'Administrator',
    'Manager',
    'Waiter',
    'Cashier',
    'Chef',
    'Barman',
    'Moderator',
    'Joker'
  ];

  useEffect(() => {
    const initializeUsers = async () => {
      const storedUsers = getFromLocalStorage('users');
      if (storedUsers && Array.isArray(storedUsers)) {
        setUsers(storedUsers);
      } else {
        const data = await loadJsonData('data/sampleData.json');
        if (data?.users && Array.isArray(data.users)) {
          setUsers(data.users);
          saveToLocalStorage('users', data.users);
        }
      }
    };

    const initializeRoles = async () => {
      const storedRoles = getFromLocalStorage('roles');
      if (storedRoles && Array.isArray(storedRoles)) {
        setRoles(storedRoles);
      } else {
        // Sample roles data
        const defaultRoles = [
          {
            id: 1,
            name: 'Administrator',
            dateCreated: '13/02/2019',
            permissions: { all: true },
            userCount: 32
          },
          {
            id: 2,
            name: 'Barman',
            dateCreated: '13/02/2019',
            permissions: { edit: true, cashdrawer: true, addMenu: true, others: true },
            userCount: 8
          },
          {
            id: 3,
            name: 'Cashier',
            dateCreated: '13/02/2019',
            permissions: { edit: true, cashdrawer: true },
            userCount: 55
          },
          {
            id: 4,
            name: 'Chef',
            dateCreated: '13/02/2019',
            permissions: { edit: true, addMenu: true },
            userCount: 11
          },
          {
            id: 5,
            name: 'Joker',
            dateCreated: '13/02/2019',
            permissions: { edit: true, cashdrawer: true, addMenu: true, others: true },
            userCount: 2
          },
          {
            id: 6,
            name: 'Manager',
            dateCreated: '13/02/2019',
            permissions: { edit: true, cashdrawer: true, others: true },
            userCount: 9
          },
          {
            id: 7,
            name: 'Moderator',
            dateCreated: '13/02/2019',
            permissions: { edit: true, cashdrawer: true, addMenu: true, others: true },
            userCount: 0
          },
          {
            id: 8,
            name: 'Waiter',
            dateCreated: '13/02/2019',
            permissions: { addMenu: true },
            userCount: 60
          }
        ];
        setRoles(defaultRoles);
        saveToLocalStorage('roles', defaultRoles);
      }
    };

    initializeUsers();
    initializeRoles();
  }, []);

  // Generate a unique ID for new items
  const generateUniqueId = (items) => {
    const existingIds = items.map(item => item.id);
    let newId = Math.max(...existingIds, 0) + 1;
    return newId;
  };

  // User CRUD operations
  const handleAddUser = (newUser) => {
    const uniqueId = generateUniqueId(users);
    const userToAdd = { 
      ...newUser, 
      id: uniqueId,
      dateCreated: new Date().toLocaleDateString('en-GB')
    };
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    saveToLocalStorage('users', updatedUsers);
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? {
        ...user,
        ...updatedUser,
        password: updatedUser.password || user.password, // Keep existing password if not changed
        dateCreated: user.dateCreated // Preserve the original creation date
      } : user
    );
    setUsers(updatedUsers);
    saveToLocalStorage('users', updatedUsers);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      saveToLocalStorage('users', updatedUsers);
    }
  };

  // Role CRUD operations
  const handleAddRole = (newRole) => {
    const uniqueId = generateUniqueId(roles);
    
    // Transform permissions into the format expected by the table
    const transformedPermissions = {
      all: false,
      edit: false,
      cashdrawer: newRole.permissions.cashDrawer.enabled,
      addMenu: newRole.permissions.menuConfiguration.enabled,
      others: newRole.permissions.tableManagement.enabled || newRole.permissions.payment.enabled
    };

    // If all major sections are enabled, set all to true
    if (newRole.permissions.tableManagement.enabled && 
        newRole.permissions.menuConfiguration.enabled && 
        newRole.permissions.cashDrawer.enabled && 
        newRole.permissions.payment.enabled) {
      transformedPermissions.all = true;
    }

    const roleToAdd = { 
      ...newRole, 
      id: uniqueId, 
      dateCreated: new Date().toLocaleDateString('en-GB'),
      userCount: 0,
      permissions: transformedPermissions
    };
    const updatedRoles = [...roles, roleToAdd];
    setRoles(updatedRoles);
    saveToLocalStorage('roles', updatedRoles);
  };

  const handleUpdateRole = (updatedRole) => {
    if (!updatedRole.id) return;
    const updatedRoles = roles.map(role => 
      role.id === updatedRole.id ? { ...updatedRole } : role
    );
    setRoles(updatedRoles);
    saveToLocalStorage('roles', updatedRoles);
  };

  const handleDeleteRole = (roleId) => {
    if (!roleId) return;
    
    if (window.confirm('Are you sure you want to delete this role?')) {
      const updatedRoles = roles.filter(role => role.id !== roleId);
      setRoles(updatedRoles);
      saveToLocalStorage('roles', updatedRoles);
    }
  };

  // Modal handlers
  const openUserModal = (mode, userData = null) => {
    setUserModalState({ isOpen: true, mode, userData });
  };

  const closeUserModal = () => {
    setUserModalState({ isOpen: false, mode: 'add', userData: null });
  };

  const openRoleModal = (mode, roleData = null) => {
    setRoleModalState({ isOpen: true, mode, roleData });
  };

  const closeRoleModal = () => {
    setRoleModalState({ isOpen: false, mode: 'add', roleData: null });
  };

  const handleUserModalSubmit = (formData) => {
    if (userModalState.mode === 'add') {
      handleAddUser(formData);
    } else {
      handleUpdateUser({
        ...formData,
        id: userModalState.userData.id
      });
    }
    closeUserModal();
  };

  const handleRoleModalSubmit = (formData) => {
    if (roleModalState.mode === 'add') {
      handleAddRole(formData);
    } else {
      handleUpdateRole({ ...formData, id: roleModalState.roleData.id, userCount: roleModalState.roleData.userCount });
    }
  };

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    setIsFilterOpen(false);
  };

  // Update the filtered users logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedFilter === 'All' || user.role === selectedFilter;
    return matchesSearch && matchesRole;
  });

  // Filtering for Roles (search only, no role filter)
  const filteredRoles = roles.filter(role => 
    role.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startUserIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startUserIndex, startUserIndex + itemsPerPage);

  const totalRolePages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startRoleIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startRoleIndex, startRoleIndex + itemsPerPage);

  // Get permissions display
  const getPermissionsDisplay = (permissions) => {
    if (permissions.all) return <span className="permission-badge all">All</span>;
    
    const permissionsArray = [];
    if (permissions.edit) permissionsArray.push(<span key="edit" className="permission-badge">Edit</span>);
    if (permissions.cashdrawer) permissionsArray.push(<span key="cashdrawer" className="permission-badge">Cashdrawer</span>);
    if (permissions.addMenu) permissionsArray.push(<span key="addMenu" className="permission-badge">Add menu</span>);
    if (permissions.others) permissionsArray.push(<span key="others" className="permission-badge">+{Object.keys(permissions).filter(p => p !== "edit" && p !== "cashdrawer" && p !== "addMenu" && permissions[p]).length} Others</span>);
    
    return permissionsArray;
  };

  return (
    <div className="users-container">
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Roles and permissions
        </button>
      </div>

      <div className="users-controls">
        <div className="search-box">
          <MagnifyingGlass weight="bold" className="search-icon" />
          <input
            type="text"
            placeholder={activeTab === 'users' ? "Search by name..." : "Search by role name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="action-buttons-container">
          {activeTab === 'users' && (
            <div className="filter-dropdown">
              <button className="filter-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <FunnelSimple weight="bold" />
                Filter
              </button>
              {isFilterOpen && (
                <div className="filter-menu">
                  {filterOptions.map((option) => (
                    <div 
                      key={option} 
                      className={`filter-option ${selectedFilter === option ? 'selected' : ''}`}
                      onClick={() => handleFilterSelect(option)}
                    >
                      {selectedFilter === option && <Check weight="bold" className="check-icon" />}
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'users' ? (
            <button className="add-btn" onClick={() => openUserModal('add')}>
              + Add
            </button>
          ) : (
            <button className="add-btn" onClick={() => openRoleModal('add')}>
              <Plus weight="bold" />
              Add new role
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        {activeTab === 'users' ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <div className="sortable">
                    NAME <FontAwesomeIcon icon={faArrowDownShortWide} className="sort-icon" />
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    DATE OF CREATION 
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    ROLE 
                  </div>
                </th>
                <th style={{ width: '60px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user.id}>
                  <td className="user-cell">
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                    </div>
                  </td>
                  <td>{user.dateCreated || '13/02/2019'}</td>
                  <td>
                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                    </span>
                  </td>
                  <td>
                    <ActionMenu
                      onEdit={() => {
                        console.log('Edit clicked for user:', user); // Add logging
                        setUserModalState({
                          isOpen: true,
                          mode: 'edit',
                          userData: user
                        });
                      }}
                      onDelete={() => {
                        console.log('Delete clicked for user:', user); // Add logging
                        handleDeleteUser(user.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="data-table roles-table">
            <thead>
              <tr>
                <th>
                  <div className="sortable">
                    ROLE 
                  </div>
                </th>
                <th>
                  <div className="sortable">
                    DATE OF CREATION 
                  </div>
                </th>
                <th>PERMISSIONS</th>
                <th>
                  <div className="sortable">
                    USERS 
                  </div>
                </th>
                <th style={{ width: '60px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRoles.map(role => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>{role.dateCreated}</td>
                  <td className="permissions-cell">
                    <div className="permissions-container">
                      {getPermissionsDisplay(role.permissions)}
                    </div>
                  </td>
                  <td>{role.userCount}</td>
                  <td>
                    <ActionMenu
                      onEdit={() => openRoleModal('edit', role)}
                      onDelete={() => handleDeleteRole(role.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {activeTab === 'users' ? (
        totalUserPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            {[...Array(totalUserPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalUserPages}
            >
              ›
            </button>
          </div>
        )
      ) : (
        totalRolePages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            {[...Array(totalRolePages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalRolePages}
            >
              ›
            </button>
          </div>
        )
      )}

      <UserFormModal 
        isOpen={userModalState.isOpen}
        onClose={closeUserModal}
        onSubmit={handleUserModalSubmit}
        initialData={userModalState.userData}
        mode={userModalState.mode}
      />

      <RoleFormModal
        isOpen={roleModalState.isOpen}
        onClose={closeRoleModal}
        onSubmit={handleRoleModalSubmit}
        initialData={roleModalState.roleData}
        mode={roleModalState.mode}
      />
    </div>
  );
};

export default Users;