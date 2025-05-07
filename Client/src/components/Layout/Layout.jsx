import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  SquaresFour,
  User,
  ShoppingCart,
  Storefront,
  Table,
  ClipboardText,
  CaretRight,
  X,
  House,
  Globe,
  List,
  CaretUp,
  CaretDown,
  Buildings,
  SignOut
} from "@phosphor-icons/react";
import './Layout.css';

const FrenchFlag = () => (
  <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="10" height="20" fill="#0055A4"/>
    <rect x="10" y="0" width="10" height="20" fill="#FFFFFF"/>
    <rect x="20" y="0" width="10" height="20" fill="#EF4135"/>
  </svg>
);

const EnglishFlag = () => (
  <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="20" fill="#012169"/>
    <path d="M0 0 L30 20 M30 0 L0 20" stroke="#FFFFFF" strokeWidth="4"/>
    <path d="M15 0V20M0 10H30" stroke="#FFFFFF" strokeWidth="6"/>
    <path d="M15 0V20M0 10H30" stroke="#C8102E" strokeWidth="4"/>
    <path d="M0 0 L30 20 M30 0 L0 20" stroke="#C8102E" strokeWidth="2"/>
  </svg>
);

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShopMenu, setShowShopMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const userMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const [expandedMenus, setExpandedMenus] = useState({
    products: false,
    stock: false,
    table: false,
    orders: false
  });

  // Simplified to only include logo
  const currentRestaurant = {
    logo: "/logo_image.png"
  };

  // Navigation map for breadcrumb labels
  const navigationMap = {
    users: {
      label: 'Users Management'
    },
    clients: {
      label: 'Client Management'
    },
    products: {
      label: 'Product Management',
      children: {
        list: 'Products List',
        categories: 'Categories & Sub-categories',
        supplements: 'Supplements Management'
      }
    },
    stock: {
      label: 'Stock Management',
      children: {
        dashboard: 'Stock Dashboard',
        purchases: 'Purchases',
        gain: 'Gain Per Product',
        inventory: 'Inventory',
        ingredients: 'Ingredient Management',
        recipes: 'Recipe Management'
      }
    },
    tables: {
      label: 'Table Management',
      children: {
        open: 'Open Tables',
        history: 'Modification History'
      }
    },
    orders: {
      label: 'Orders & Payments',
      children: {
        list: 'Orders',
        cash: 'Cash Drawer',
        deliveries: 'Deliveries'
      }
    }
  };

  // Function to generate breadcrumb items
  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    if (pathSegments.length === 0) {
      return [{ label: 'Dashboard', path: '/' }];
    }

    const breadcrumbItems = [{ label: 'Dashboard', path: '/' }];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      if (navigationMap[segment]) {
        breadcrumbItems.push({
          label: navigationMap[segment].label,
          path: currentPath
        });
      } else if (index > 0 && navigationMap[pathSegments[index - 1]]?.children[segment]) {
        breadcrumbItems.push({
          label: navigationMap[pathSegments[index - 1]].children[segment],
          path: currentPath
        });
      }
    });

    return breadcrumbItems;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="layout">
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo-container">
          <div className="logo">
            <img src={currentRestaurant.logo} alt="Logo" className="logo-image" />
          </div>
        </div>
        
        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <SquaresFour weight="fill" className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <User weight="fill" className="nav-icon" />
            <span>User Management</span>
          </NavLink>

          <div className={`menu-group ${expandedMenus.products ? 'expanded' : ''}`}>
            <button 
              className={`menu-trigger ${location.pathname.startsWith('/products') ? 'active' : ''}`}
              onClick={() => toggleMenu('products')}
            >
              <ShoppingCart weight="fill" className="nav-icon" />
              <span>Product Management</span>
              {expandedMenus.products ? (
                <CaretUp weight="bold" className="arrow-icon" />
              ) : (
                <CaretDown weight="bold" className="arrow-icon" />
              )}
            </button>
            <div className="sub-menu">
              <NavLink to="/products/list" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Products List
              </NavLink>
              <NavLink to="/products/categories" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Categories & Sub-categories
              </NavLink>
              <NavLink to="/products/supplements" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Supplements Management
              </NavLink>
            </div>
          </div>

          <div className={`menu-group ${expandedMenus.stock ? 'expanded' : ''}`}>
            <button 
              className={`menu-trigger ${location.pathname.startsWith('/stock') ? 'active' : ''}`}
              onClick={() => toggleMenu('stock')}
            >
              <Storefront weight="fill" className="nav-icon" />
              <span>Stock Management</span>
              {expandedMenus.stock ? (
                <CaretUp weight="bold" className="arrow-icon" />
              ) : (
                <CaretDown weight="bold" className="arrow-icon" />
              )}
            </button>
            <div className="sub-menu">
              <NavLink to="/stock/purchases" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Purchases
              </NavLink>
              <NavLink to="/stock/inventory" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Inventory
              </NavLink>
              <NavLink to="/stock/ingredients" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Ingredient Management
              </NavLink>
              <NavLink to="/stock/recipes" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Recipe Management
              </NavLink>
            </div>
          </div>

          <div className="menu-group">
            <NavLink 
              to="/tables/tableManagement"
              className={`menu-trigger ${location.pathname.startsWith('/tables') ? 'active' : ''}`}
            >
              <Table weight="fill" className="nav-icon" />
              <span>Table Management</span>
            </NavLink>
          </div>

          <div className={`menu-group ${expandedMenus.orders ? 'expanded' : ''}`}>
            <button 
              className={`menu-trigger ${location.pathname.startsWith('/orders') ? 'active' : ''}`}
              onClick={() => toggleMenu('orders')}
            >
              <ClipboardText weight="fill" className="nav-icon" />
              <span>Orders & Payments</span>
              {expandedMenus.orders ? (
                <CaretUp weight="bold" className="arrow-icon" />
              ) : (
                <CaretDown weight="bold" className="arrow-icon" />
              )}
            </button>
            <div className="sub-menu">
              <NavLink to="/orders/list" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Orders
              </NavLink>
              <NavLink to="/orders/cash" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Cash Drawer
              </NavLink>
              <NavLink to="/orders/deliveries" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Deliveries
              </NavLink>
            </div>
          </div>

          <NavLink to="/clients" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Globe weight="fill" className="nav-icon" />
            <span>Client Management</span>
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <List weight="bold" />
            </button>
            <div className="breadcrumb">
              <House className="home-icon" weight="fill" />
              {getBreadcrumbItems().map((item, index, array) => (
                <div key={item.path} className="breadcrumb-item">
                  {index > 0 && <CaretRight className="separator" weight="bold" style={{ color: 'red' , fontSize: '1.0rem' }} />}
                  {item.path === '/' || (index === array.length - 1) ? (
                    <NavLink 
                      to={item.path}
                      className={index === array.length - 1 ? 'current-page' : ''}
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <span className="parent-label">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="user-menu">
            <div className="language-menu-container" ref={languageMenuRef}>
              <button
                onMouseEnter={() => setShowLanguageMenu(true)}
                onMouseLeave={() => setShowLanguageMenu(false)}
              >
                <Globe weight="fill" className="icon" />
              </button>
              {showLanguageMenu && (
                <div 
                  className="dropdown-menu language-dropdown"
                  onMouseEnter={() => setShowLanguageMenu(true)}
                  onMouseLeave={() => setShowLanguageMenu(false)}
                >
                  <div className="menu-item">
                    <EnglishFlag />
                    <span>English</span>
                  </div>
                  <div className="menu-item">
                    <FrenchFlag />
                    <span>French</span>
                  </div>
                </div>
              )}
            </div>
            <div className="user-menu-container" ref={userMenuRef}>
              <button 
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <User weight="fill" className="icon" />
              </button>
              {showUserMenu && (
                <div 
                  className="dropdown-menu user-dropdown"
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div 
                    className="menu-item shop-item"
                    onMouseEnter={() => setShowShopMenu(true)}
                    onMouseLeave={() => setShowShopMenu(false)}
                  >
                    <Storefront weight="fill" />
                    <span>Shops</span>
                    <CaretRight className="submenu-arrow" weight="bold" />
                    {showShopMenu && (
                      <div className="submenu shop-submenu">
                        <div className="menu-item">Shop 1</div>
                        <div className="menu-item">Shop 2</div>
                        <div className="menu-item">Shop 3</div>
                      </div>
                    )}
                  </div>
                  <div className="menu-item logout-item">
                    <SignOut weight="bold" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;