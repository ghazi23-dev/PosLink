import { useState, useEffect } from 'react';
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
  List
} from "@phosphor-icons/react";
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    products: false,
    stock: false,
    table: false,
    orders: false
  });

  // Navigation map for breadcrumb labels
  const navigationMap = {
    users: {
      label: 'Users Management'
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

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        <div className="logo">
          <img src="/logo_image.png" alt="Logo" className="logo-image" />
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
              <CaretRight weight="bold" className="arrow-icon" />
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
              <CaretRight weight="bold" className="arrow-icon" />
            </button>
            <div className="sub-menu">
              <NavLink to="/stock/dashboard" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Stock Dashboard
              </NavLink>
              <NavLink to="/stock/purchases" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Purchases
              </NavLink>
              <NavLink to="/stock/gain" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Gain Per Product
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

          <div className={`menu-group ${expandedMenus.table ? 'expanded' : ''}`}>
            <button 
              className={`menu-trigger ${location.pathname.startsWith('/tables') ? 'active' : ''}`}
              onClick={() => toggleMenu('table')}
            >
              <Table weight="fill" className="nav-icon" />
              <span>Table Management</span>
              <CaretRight weight="bold" className="arrow-icon" />
            </button>
            <div className="sub-menu">
              <NavLink to="/tables/open" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Open Tables
              </NavLink>
              <NavLink to="/tables/history" className={({ isActive }) => isActive ? 'sub-link active' : 'sub-link'}>
                Modification History
              </NavLink>
            </div>
          </div>

          <div className={`menu-group ${expandedMenus.orders ? 'expanded' : ''}`}>
            <button 
              className={`menu-trigger ${location.pathname.startsWith('/orders') ? 'active' : ''}`}
              onClick={() => toggleMenu('orders')}
            >
              <ClipboardText weight="fill" className="nav-icon" />
              <span>Orders & Payments</span>
              <CaretRight weight="bold" className="arrow-icon" />
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
            <button>
              <Globe className="icon" weight="fill" />
            </button>
            <button>
              <User className="icon" weight="fill" />
            </button>
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