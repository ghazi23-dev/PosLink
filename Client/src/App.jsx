import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Users from './components/Users/Users';
import ProductList from './components/Products/ProductsList';
import CategoriesSub from './components/Products/categoriesSub';
import Supplements from './components/Products/Supplements';
import Login from './pages/Login';
import Clients from './components/Clients/clients';
import Purchases from './components/Stock/Purchases';
import Inventory from './components/Stock/Inventory';
import Ingredient from './components/Stock/Ingredients';
import Recipe_Mangment from './components/Stock/Recipe_Mangment';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>

      {/* <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
     
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="clients" element={<Clients />} /> */}

        
        {/* Login route outside of Layout */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="clients" element={<Clients />} />
          
          {/* Product Management Routes */}
          <Route path="products">
            <Route path="list" element={<ProductList/>} />
            <Route path="categories" element={<CategoriesSub/>} />
            <Route path="supplements" element={<Supplements/>} />
          </Route>

          {/* Stock Management Routes */}
          <Route path="stock">
            <Route path="dashboard" element={<div>Stock Dashboard</div>} />
            <Route path="purchases" element={<Purchases/>} />
            <Route path="inventory" element={<Inventory/>} />
            <Route path="ingredients" element={<Ingredient/>} />
            <Route path="recipes" element={<Recipe_Mangment/>} />
          </Route>

          {/* Table Management Routes */}
          <Route path="tables">
            <Route path="open" element={<div>Open Tables</div>} />
            <Route path="history" element={<div>Modification History</div>} />
          </Route>

          {/* Orders & Payments Routes */}
          <Route path="orders">
            <Route path="list" element={<div>Orders</div>} />
            <Route path="cash" element={<div>Cash Drawer</div>} />
            <Route path="deliveries" element={<div>Deliveries</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
