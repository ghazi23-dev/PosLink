// import React, { useState } from 'react';
// import { Eye, CaretLeft, CaretRight, X } from '@phosphor-icons/react';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import IconButton from '@mui/material/IconButton';
// import './OrdersContent.css';

// const OrdersContent = () => {
//   const [activeTab, setActiveTab] = useState('orders');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const itemsPerPage = 6;

//   const ordersData = [
//     { id: 1001, waiter: 'John Doe', total: 120.50, date: '2023-05-15', client: 'Michael Johnson', status: 'completed', items: [{name: 'Pizza', quantity: 2, price: 25}, {name: 'Pasta', quantity: 1, price: 15}] },
//     { id: 1002, waiter: 'Jane Smith', total: 85.75, date: '2023-05-15', client: 'Sarah Williams', status: 'completed', items: [{name: 'Salad', quantity: 1, price: 12}, {name: 'Steak', quantity: 1, price: 30}] },
//     { id: 1003, waiter: 'Mike Johnson', total: 45.00, date: '2023-05-14', client: 'David Brown', status: 'completed', items: [{name: 'Burger', quantity: 2, price: 10}, {name: 'Fries', quantity: 1, price: 5}] },
//     { id: 1004, waiter: 'Emily Davis', total: 92.30, date: '2023-05-14', client: 'Robert Wilson', status: 'cancelled', items: [{name: 'Sushi', quantity: 3, price: 15}, {name: 'Miso Soup', quantity: 1, price: 6}] },
//     { id: 1005, waiter: 'Chris Martin', total: 67.80, date: '2023-05-13', client: 'Jennifer Lee', status: 'completed', items: [{name: 'Tacos', quantity: 2, price: 12}, {name: 'Margarita', quantity: 1, price: 8}] },
//     { id: 1006, waiter: 'Alex Turner', total: 110.00, date: '2023-05-13', client: 'Thomas Moore', status: 'completed', items: [{name: 'Ribeye', quantity: 1, price: 35}, {name: 'Wine', quantity: 2, price: 15}] },
//     { id: 1007, waiter: 'Sarah Connor', total: 75.25, date: '2023-05-12', client: 'Lisa Ray', status: 'cancelled', items: [{name: 'Chicken Wings', quantity: 2, price: 12}, {name: 'Beer', quantity: 3, price: 5}] },
//     { id: 1008, waiter: 'John Doe', total: 58.90, date: '2023-05-12', client: 'Paul Allen', status: 'completed', items: [{name: 'Fish & Chips', quantity: 1, price: 18}, {name: 'Soda', quantity: 2, price: 3}] },
//     { id: 1009, waiter: 'Jane Smith', total: 132.40, date: '2023-05-11', client: 'Mark Taylor', status: 'completed', items: [{name: 'Lobster', quantity: 1, price: 45}, {name: 'Champagne', quantity: 1, price: 25}] },
//     { id: 1010, waiter: 'Mike Johnson', total: 43.50, date: '2023-05-11', client: 'Emma Stone', status: 'completed', items: [{name: 'Caesar Salad', quantity: 1, price: 12}, {name: 'Soup', quantity: 1, price: 8}] },
//   ];

//   const filteredOrders = activeTab === 'orders' 
//     ? ordersData 
//     : ordersData.filter(order => order.status === 'cancelled');

//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const currentOrders = filteredOrders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handlePreviewClick = (order) => {
//     setSelectedOrder(order);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   return (
//     <div className="tables-container">
//       <div className="tables-header">
//         <h2>Orders Management</h2>
//       </div>

//       <div className="orders-tabs">
//         <button
//           className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
//           onClick={() => {
//             setActiveTab('orders');
//             setCurrentPage(1);
//           }}
//         >
//           Orders
//         </button>
//         <button
//           className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
//           onClick={() => {
//             setActiveTab('cancelled');
//             setCurrentPage(1);
//           }}
//         >
//           Cancelled Orders
//         </button>
//       </div>

//       <div className="table-list-container">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>NUM ORDER</th>
//               <th>WAITER</th>
//               <th>TOTAL</th>
//               <th>DATE</th>
//               <th>CLIENT</th>
//               <th>ACTIONS</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentOrders.map((order, index) => (
//               <tr key={order.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
//                 <td>#{order.id}</td>
//                 <td>{order.waiter}</td>
//                 <td>{order.total.toFixed(2)} DT</td>
//                 <td>{order.date}</td>
//                 <td>{order.client}</td>
//                 <td>
//                   <div className="table-actions">
//                     <button 
//                       className="action-btn"
//                       onClick={() => handlePreviewClick(order)}
//                     >
//                       <Eye size={20} weight="bold" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <div className="pagination">
//           <button 
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="pagination-btn"
//           >
//             <CaretLeft size={18} weight="bold" />
//           </button>
          
//           <div className="page-indicator">
//             Page {currentPage} of {totalPages}
//           </div>
          
//           <button 
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="pagination-btn"
//           >
//             <CaretRight size={18} weight="bold" />
//           </button>
//         </div>
//       )}

//     <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <span>Order Details</span>
//           <IconButton onClick={handleCloseDialog}>
//             <X size={20} weight="bold" />
//           </IconButton>
//         </div>
//       </DialogTitle>
//       <DialogContent>
//         {selectedOrder && (
//           <div style={{ padding: '8px' }}>
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               padding: '12px',
//               backgroundColor: '#f8f8f8'
//             }}>
//               <span>Order #:</span>
//               <span>{selectedOrder.id}</span>
//             </div>
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               padding: '12px',
//               backgroundColor: 'white'
//             }}>
//               <span>Waiter:</span>
//               <span>{selectedOrder.waiter}</span>
//             </div>
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               padding: '12px',
//               backgroundColor: '#f8f8f8'
//             }}>
//               <span>Total:</span>
//               <span>{selectedOrder.total.toFixed(2)} DT</span>
//             </div>
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               padding: '12px',
//               backgroundColor: 'white'
//             }}>
//               <span>Date:</span>
//               <span>{selectedOrder.date}</span>
//             </div>
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'space-between',
//               padding: '12px',
//               backgroundColor: '#f8f8f8'
//             }}>
//               <span>Client:</span>
//               <span>{selectedOrder.client}</span>
//             </div>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//     </div>
//   );
// };

// export default OrdersContent;


// import React, { useState } from 'react';
// import { Eye, CaretLeft, CaretRight, X, DotsThreeVertical, Trash } from '@phosphor-icons/react';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import IconButton from '@mui/material/IconButton';
// import './OrdersContent.css';

// const OrdersContent = () => {
//   const [activeTab, setActiveTab] = useState('orders');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [orders, setOrders] = useState([
//     { id: 1001, waiter: 'John Doe', total: 120.50, date: '2023-05-15', client: 'Michael Johnson', status: 'completed', items: [] },
//     { id: 1002, waiter: 'Jane Smith', total: 85.75, date: '2023-05-15', client: 'Sarah Williams', status: 'completed', items: [] },
//     { id: 1003, waiter: 'Mike Johnson', total: 45.00, date: '2023-05-14', client: 'David Brown', status: 'completed', items: [] },
//     { id: 1004, waiter: 'Emily Davis', total: 92.30, date: '2023-05-14', client: 'Robert Wilson', status: 'cancelled', items: [] },
//     { id: 1005, waiter: 'Chris Martin', total: 67.80, date: '2023-05-13', client: 'Jennifer Lee', status: 'completed', items: [] },
//     { id: 1006, waiter: 'Alex Turner', total: 110.00, date: '2023-05-13', client: 'Thomas Moore', status: 'completed', items: [] },
//     { id: 1007, waiter: 'Sarah Connor', total: 75.25, date: '2023-05-12', client: 'Lisa Ray', status: 'cancelled', items: [] },
//     { id: 1008, waiter: 'John Doe', total: 58.90, date: '2023-05-12', client: 'Paul Allen', status: 'completed', items: [] },
//   ]);

//   const itemsPerPage = 6;
//   const filteredOrders = activeTab === 'orders'
//     ? orders.filter(order => order.status === 'completed')
//     : orders.filter(order => order.status === 'cancelled');

//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const currentOrders = filteredOrders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handlePreviewClick = (order) => {
//     setSelectedOrder(order);
//     setOpenDialog(true);
//     setOpenMenuId(null); // Fermer le menu
//   };

//   const handleDelete = (orderId) => {
//     setOrders(prev => prev.filter(order => order.id !== orderId));
//     setOpenMenuId(null); // Fermer le menu
//   };

//   const toggleMenu = (id) => {
//     setOpenMenuId(prev => (prev === id ? null : id));
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   return (
//     <div className="tables-container">
  

//       <div className="orders-tabs">
//         <button
//           className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
//           onClick={() => {
//             setActiveTab('orders');
//             setCurrentPage(1);
//           }}
//         >
//           Orders
//         </button>
//         <button
//           className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
//           onClick={() => {
//             setActiveTab('cancelled');
//             setCurrentPage(1);
//           }}
//         >
//           Cancelled Orders
//         </button>
//       </div>

//       <div className="table-list-container">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>NUM ORDER</th>
//               <th>WAITER</th>
//               <th>TOTAL</th>
//               <th>DATE</th>
//               <th>CLIENT</th>
//               <th>ACTIONS</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentOrders.map((order, index) => (
//               <tr key={order.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
//                 <td>#{order.id}</td>
//                 <td>{order.waiter}</td>
//                 <td>{order.total.toFixed(2)} DT</td>
//                 <td>{order.date}</td>
//                 <td>{order.client}</td>
//                 <td>
//                   <div className="table-actions" style={{ position: 'relative' }}>
//                     {activeTab === 'orders' ? (
//                       <>
//                         <button className="action-btn" onClick={() => toggleMenu(order.id)}>
//                           <DotsThreeVertical size={20} color="red" weight="bold" />
//                         </button>
//                         {openMenuId === order.id && (
//                           <div className="dropdown-menu">
//                             <button onClick={() => handlePreviewClick(order)}>
//                              Preview
//                             </button>
//                             <button onClick={() => handleDelete(order.id)}>
//                               Delete
//                             </button>
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <button className="action-btn" onClick={() => handlePreviewClick(order)}>
//                         <Eye size={20} weight="bold" />
//                       </button>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <div className="pagination">
//           <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
//             <CaretLeft size={18} weight="bold" />
//           </button>
//           <div className="page-indicator">
//             Page {currentPage} of {totalPages}
//           </div>
//           <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">
//             <CaretRight size={18} weight="bold" />
//           </button>
//         </div>
//       )}

//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <span>Order Details</span>
//             <IconButton onClick={handleCloseDialog}>
//               <X size={20} weight="bold" />
//             </IconButton>
//           </div>
//         </DialogTitle>
//         <DialogContent>
//           {selectedOrder && (
//             <div style={{ padding: '8px' }}>
//               <div className="dialog-row"><span>Order #:</span><span>{selectedOrder.id}</span></div>
//               <div className="dialog-row"><span>Waiter:</span><span>{selectedOrder.waiter}</span></div>
//               <div className="dialog-row"><span>Total:</span><span>{selectedOrder.total.toFixed(2)} DT</span></div>
//               <div className="dialog-row"><span>Date:</span><span>{selectedOrder.date}</span></div>
//               <div className="dialog-row"><span>Client:</span><span>{selectedOrder.client}</span></div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default OrdersContent;


import React, { useState } from 'react';
import { Eye, CaretLeft, CaretRight, X, DotsThreeVertical, Trash } from '@phosphor-icons/react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import './OrdersContent.css';

const OrdersContent = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [orders, setOrders] = useState([
    { id: 1001, waiter: 'John Doe', total: 120.50, date: '2023-05-15', client: 'Michael Johnson', status: 'completed', table: 3, paymentMethod: 'Cash', items: [] },
    { id: 1002, waiter: 'Jane Smith', total: 85.75, date: '2023-05-15', client: 'Sarah Williams', status: 'completed', table: 5, paymentMethod: 'Card', items: [] },
    { id: 1003, waiter: 'Mike Johnson', total: 45.00, date: '2023-05-14', client: 'David Brown', status: 'completed', table: 1, paymentMethod: 'Cash', items: [] },
    { id: 1004, waiter: 'Emily Davis', total: 92.30, date: '2023-05-14', client: 'Robert Wilson', status: 'cancelled', table: 2, paymentMethod: 'Card', items: [] },
    { id: 1005, waiter: 'Chris Martin', total: 67.80, date: '2023-05-13', client: 'Jennifer Lee', status: 'completed', table: 6, paymentMethod: 'Cash', items: [] },
    { id: 1006, waiter: 'Alex Turner', total: 110.00, date: '2023-05-13', client: 'Thomas Moore', status: 'completed', table: 4, paymentMethod: 'Card', items: [] },
    { id: 1007, waiter: 'Sarah Connor', total: 75.25, date: '2023-05-12', client: 'Lisa Ray', status: 'cancelled', table: 7, paymentMethod: 'Cash', items: [] },
    { id: 1008, waiter: 'John Doe', total: 58.90, date: '2023-05-12', client: 'Paul Allen', status: 'completed', table: 2, paymentMethod: 'Card', items: [] },
    { id: 1009, waiter: 'Anna Bell', total: 105.20, date: '2023-05-11', client: 'George Adams', status: 'completed', table: 3, paymentMethod: 'Cash', items: [] },
    { id: 1010, waiter: 'George Lane', total: 91.60, date: '2023-05-11', client: 'Nina Parker', status: 'completed', table: 5, paymentMethod: 'Card', items: [] },
    { id: 1011, waiter: 'Laura Hill', total: 130.00, date: '2023-05-10', client: 'Carl Thompson', status: 'completed', table: 1, paymentMethod: 'Cash', items: [] },
    { id: 1012, waiter: 'Robert Young', total: 77.45, date: '2023-05-10', client: 'Eva Scott', status: 'cancelled', table: 4, paymentMethod: 'Card', items: [] },
    { id: 1013, waiter: 'Nina Cruz', total: 99.99, date: '2023-05-09', client: 'Jason Ford', status: 'completed', table: 6, paymentMethod: 'Card', items: [] },
    { id: 1014, waiter: 'Peter Nash', total: 64.30, date: '2023-05-09', client: 'Emily White', status: 'completed', table: 2, paymentMethod: 'Cash', items: [] },
    { id: 1015, waiter: 'Karen Reed', total: 81.20, date: '2023-05-08', client: 'Brian Green', status: 'completed', table: 7, paymentMethod: 'Cash', items: [] },
    { id: 1016, waiter: 'Steve Grant', total: 73.00, date: '2023-05-08', client: 'Olivia Black', status: 'completed', table: 1, paymentMethod: 'Card', items: [] },
    { id: 1017, waiter: 'Tina West', total: 88.40, date: '2023-05-07', client: 'Patrick Gray', status: 'cancelled', table: 3, paymentMethod: 'Cash', items: [] },
    { id: 1018, waiter: 'Victor Rose', total: 112.10, date: '2023-05-07', client: 'Nancy Stone', status: 'completed', table: 5, paymentMethod: 'Card', items: [] },
    { id: 1019, waiter: 'Donna King', total: 69.00, date: '2023-05-06', client: 'Henry Wood', status: 'completed', table: 6, paymentMethod: 'Cash', items: [] },
    { id: 1020, waiter: 'Kevin Page', total: 140.50, date: '2023-05-06', client: 'Laura Fox', status: 'completed', table: 4, paymentMethod: 'Card', items: [] }
    // { id: 1008, waiter: 'John Doe', total: 58.90, date: '2023-05-12', client: 'Paul Allen', status: 'completed', items: [] },
    // { id: 1008, waiter: 'John Doe', total: 58.90, date: '2023-05-12', client: 'Paul Allen', status: 'completed', items: [] },
    // { id: 1008, waiter: 'John Doe', total: 58.90, date: '2023-05-12', client: 'Paul Allen', status: 'completed', items: [] },
    
  ]);

  const itemsPerPage = 6;
  const filteredOrders = activeTab === 'orders'
    ? orders.filter(order => order.status === 'completed')
    : orders.filter(order => order.status === 'cancelled');

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePreviewClick = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
    setOpenMenuId(null); // Close the menu
  };

  const handleDelete = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    setOpenMenuId(null); // Close the menu
  };

  const toggleMenu = (id) => {
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="tables-container">
      <div className="orders-tabs">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('orders');
            setCurrentPage(1);
          }}
        >
          Orders
        </button>
        <button
          className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('cancelled');
            setCurrentPage(1);
          }}
        >
          Cancelled Orders
        </button>
      </div>

      <div className="table-list-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>NUM ORDER</th>
              <th>WAITER</th>
              <th>TOTAL</th>
              <th>DATE</th>
              <th>CLIENT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>#{order.id}</td>
                <td>{order.waiter}</td>
                <td>{order.total.toFixed(2)} DT</td>
                <td>{order.date}</td>
                <td>{order.client}</td>
                <td>
                  <div className="table-actions">
                    {activeTab === 'orders' ? (
                      <>
                        <button className="action-btn" onClick={() => toggleMenu(order.id)}>
                          <DotsThreeVertical size={20} color="red" weight="bold" />
                        </button>
                        {openMenuId === order.id && (
                          <div className="dropdown-menu">
                            <button onClick={() => handlePreviewClick(order)}>
                              Preview
                            </button>
                            <button onClick={() => handleDelete(order.id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <button className="action-btn" onClick={() => handlePreviewClick(order)}>
                        <Eye size={20} weight="bold" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className="pagination-btn"
  >
    <CaretLeft size={18} weight="bold" />
  </button>

  {[...Array(totalPages)].map((_, index) => {
    const page = index + 1;
    return (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
      >
        {page}
      </button>
    );
  })}

  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="pagination-btn"
  >
    <CaretRight size={18} weight="bold" />
  </button>
</div>

)}


      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Order Details</span>
            <IconButton onClick={handleCloseDialog}>
              <X size={20} weight="bold" />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div style={{ padding: '8px' }}>
              <div className="dialog-row"><span>Order #:</span><span>{selectedOrder.id}</span></div>
              <div className="dialog-row"><span>Waiter:</span><span>{selectedOrder.waiter}</span></div>
              <div className="dialog-row"><span>Total:</span><span>{selectedOrder.total.toFixed(2)} DT</span></div>
              <div className="dialog-row"><span>Date:</span><span>{selectedOrder.date}</span></div>
              <div className="dialog-row"><span>Client:</span><span>{selectedOrder.client}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersContent;
