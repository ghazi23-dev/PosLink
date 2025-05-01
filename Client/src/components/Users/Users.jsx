import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  FileXls, 
  FilePdf,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  X,
  Check
} from '@phosphor-icons/react';
import { loadJsonData, getFromLocalStorage, saveToLocalStorage } from '../../utils/jsonUtils';
import './Users.css';

const UserFormModal = ({ isOpen, onClose, onSubmit, initialData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: initialData.password || '' // Keep password if exists, empty if new user
      });
    }
  }, [initialData]);

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
      onSubmit(formData);
      onClose();
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
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
          <h3>{mode === 'add' ? 'Add New User' : 'Update User'}</h3>
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
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              <Check weight="bold" />
              {mode === 'add' ? 'Add User' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', userData: null });
  const itemsPerPage = 10;

  useEffect(() => {
    const initializeUsers = async () => {
      const storedUsers = getFromLocalStorage('users');
      if (storedUsers && Array.isArray(storedUsers)) {
        setUsers(storedUsers);
        return;
      }

      const data = await loadJsonData('/src/data/sampleData.json');
      if (data?.users && Array.isArray(data.users)) {
        setUsers(data.users);
        saveToLocalStorage('users', data.users);
      }
    };

    initializeUsers();
  }, []);

  // Generate a unique ID for new users
  const generateUniqueId = () => {
    const existingIds = users.map(user => user.id);
    let newId = Math.max(...existingIds, 0) + 1;
    return newId;
  };

  const handleExportExcel = () => {
    console.log('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    console.log('Exporting to PDF...');
  };

  const handleAddUser = (newUser) => {
    const uniqueId = generateUniqueId();
    const userToAdd = { ...newUser, id: uniqueId };
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    saveToLocalStorage('users', updatedUsers);
  };

  const handleUpdateUser = (updatedUser) => {
    if (!updatedUser.id) return; // Prevent updates without ID
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? { ...updatedUser } : user
    );
    setUsers(updatedUsers);
    saveToLocalStorage('users', updatedUsers);
  };

  const handleDeleteUser = (userId) => {
    if (!userId) return; // Prevent deletion without ID
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      const userToDelete = users.find(user => user.id === userId);
      if (!userToDelete) {
        console.error('User not found');
        return;
      }

      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      saveToLocalStorage('users', updatedUsers);
    }
  };

  const openModal = (mode, userData = null) => {
    setModalState({ isOpen: true, mode, userData });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'add', userData: null });
  };

  const handleModalSubmit = (formData) => {
    if (modalState.mode === 'add') {
      handleAddUser(formData);
    } else {
      handleUpdateUser({ ...formData, id: modalState.userData.id });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="users-container">
      <div className="users-header">
        <div className="header-section">
          <h2>Users Management</h2>
          <p className="section-description">Manage your users and their roles</p>
        </div>
        <div className="export-section">
          <p className="export-description">Download the displayed data as an Excel or PDF file</p>
          <div className="button-group">
            <button className="export-btn excel" onClick={handleExportExcel}>
              <FileXls weight="fill" />
              Export Excel
            </button>
            <button className="export-btn pdf" onClick={handleExportPDF}>
              <FilePdf weight="fill" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="users-controls">
        <div className="search-box">
          <MagnifyingGlass className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-recipe-btn" onClick={() => openModal('add')}>
          <UserPlus weight="fill" />
          Add User
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>USER</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id}>
                <td className="user-cell">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{user.name}</span>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn edit"
                      onClick={() => openModal('edit', user)}
                      title="Edit user"
                    >
                      <PencilSimple weight="fill" />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete user"
                    >
                      <Trash weight="fill" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button 
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        >
          Next
        </button>
      </div>

      <UserFormModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialData={modalState.userData}
        mode={modalState.mode}
      />
    </div>
  );
};

export default Users; 