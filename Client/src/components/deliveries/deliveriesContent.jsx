import React, { useState } from 'react';
import { Eye, CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../orders/OrdersContent.css';

const DeliveriesContent = () => {
  const [activeTab, setActiveTab] = useState('deliveries');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const itemsPerPage = 6;

  const deliveriesData = [
    { id: 2001, driver: 'John Doe', total: 120.50, date: '2023-05-15', client: 'Michael Johnson', status: 'delivered', address: '123 Main St', items: [{name: 'Pizza', quantity: 2, price: 25}, {name: 'Pasta', quantity: 1, price: 15}] },
    { id: 2002, driver: 'Jane Smith', total: 85.75, date: '2023-05-15', client: 'Sarah Williams', status: 'on the way', address: '456 Oak Ave', items: [{name: 'Salad', quantity: 1, price: 12}, {name: 'Steak', quantity: 1, price: 30}] },
    { id: 2003, driver: 'Mike Johnson', total: 45.00, date: '2023-05-14', client: 'David Brown', status: 'preparing', address: '789 Pine Rd', items: [{name: 'Burger', quantity: 2, price: 10}, {name: 'Fries', quantity: 1, price: 5}] },
    { id: 2004, driver: 'Emily Davis', total: 92.30, date: '2023-05-14', client: 'Robert Wilson', status: 'cancelled', address: '101 Elm St', items: [{name: 'Sushi', quantity: 3, price: 15}, {name: 'Miso Soup', quantity: 1, price: 6}] },
    { id: 2005, driver: 'Chris Martin', total: 67.80, date: '2023-05-13', client: 'Jennifer Lee', status: 'delivered', address: '202 Maple Dr', items: [{name: 'Tacos', quantity: 2, price: 12}, {name: 'Margarita', quantity: 1, price: 8}] },
    { id: 2006, driver: 'Alex Turner', total: 110.00, date: '2023-05-13', client: 'Thomas Moore', status: 'delivered', address: '303 Cedar Ln', items: [{name: 'Ribeye', quantity: 1, price: 35}, {name: 'Wine', quantity: 2, price: 15}] },
    { id: 2007, driver: 'Sarah Connor', total: 75.25, date: '2023-05-12', client: 'Lisa Ray', status: 'cancelled', address: '404 Birch Blvd', items: [{name: 'Chicken Wings', quantity: 2, price: 12}, {name: 'Beer', quantity: 3, price: 5}] },
    { id: 2008, driver: 'John Doe', total: 58.90, date: '2023-05-12', client: 'Paul Allen', status: 'on the way', address: '505 Spruce Way', items: [{name: 'Fish & Chips', quantity: 1, price: 18}, {name: 'Soda', quantity: 2, price: 3}] },
    { id: 2009, driver: 'Jane Smith', total: 132.40, date: '2023-05-11', client: 'Mark Taylor', status: 'delivered', address: '606 Redwood Cir', items: [{name: 'Lobster', quantity: 1, price: 45}, {name: 'Champagne', quantity: 1, price: 25}] },
    { id: 2010, driver: 'Mike Johnson', total: 43.50, date: '2023-05-11', client: 'Emma Stone', status: 'preparing', address: '707 Willow Ct', items: [{name: 'Caesar Salad', quantity: 1, price: 12}, {name: 'Soup', quantity: 1, price: 8}] },
  ];

  const filteredDeliveries = activeTab === 'deliveries' 
    ? deliveriesData.filter(delivery => delivery.status !== 'cancelled')
    : deliveriesData.filter(delivery => delivery.status === 'cancelled');

  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const currentDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviewClick = (delivery) => {
    setSelectedDelivery(delivery);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'delivered':
        return 'status-delivered';
      case 'on the way':
        return 'status-ontheway';
      case 'preparing':
        return 'status-preparing';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="tables-container">
      {/* <div className="tables-header">
        <h2>Deliveries Management</h2>
      </div> */}

      <div className="orders-tabs">
        <button
          className={`tab-btn ${activeTab === 'deliveries' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('deliveries');
            setCurrentPage(1);
          }}
        >
          Deliveries
        </button>
        <button
          className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('cancelled');
            setCurrentPage(1);
          }}
        >
          Cancelled Deliveries
        </button>
      </div>

      <div className="table-list-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <div className="sortable">
                  NUM ORDER
                </div>
              </th>
              <th>
                <div className="sortable">
                  WAITER
                </div>
              </th>
              <th>
                <div className="sortable">
                  TOTAL
                </div>
              </th>
              <th>
                <div className="sortable">
                  DATE
                </div>
              </th>
              <th>
                <div className="sortable">
                  CLIENT
                </div>
              </th>
              <th>
                <div className="sortable">
                  STATUS
                </div>
              </th>
              <th>
                <div className="sortable">
                  ACTIONS
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDeliveries.map(delivery => (
              <tr key={delivery.id}>
                <td>#{delivery.id}</td>
                <td>{delivery.driver}</td>
                <td>{delivery.total.toFixed(2)} DT</td>
                <td>{delivery.date}</td>
                <td>{delivery.client}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="action-btn"
                      onClick={() => handlePreviewClick(delivery)}
                    >
                      <Eye size={20} weight="bold" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          
          <div className="page-indicator">
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
      )} */}
      <div className="pagination-container">
  <button
    className="pagination-btn"
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    &lt; {/* Symbole de la flèche gauche */}
  </button>
  
  {/* Afficher les numéros de page */}
  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index + 1}
      className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
      onClick={() => setCurrentPage(index + 1)}
    >
      {index + 1}
    </button>
  ))}

  <button
    className="pagination-btn"
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    &gt; {/* Symbole de la flèche droite */}
  </button>
</div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Delivery Details</span>
            <IconButton onClick={handleCloseDialog}>
              <X size={20} weight="bold" />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedDelivery && (
            <div style={{ padding: '8px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8f8f8'
              }}>
                <span>Order #:</span>
                <span>{selectedDelivery.id}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: 'white'
              }}>
                <span>WAITER:</span>
                <span>{selectedDelivery.driver}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8f8f8'
              }}>
                <span>Total:</span>
                <span>{selectedDelivery.total.toFixed(2)} DT</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: 'white'
              }}>
                <span>Date:</span>
                <span>{selectedDelivery.date}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8f8f8'
              }}>
                <span>Client:</span>
                <span>{selectedDelivery.client}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: 'white'
              }}>
                <span>Address:</span>
                <span>{selectedDelivery.address}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8f8f8'
              }}>
                <span>Status:</span>
                <span className={`status-badge ${getStatusClass(selectedDelivery.status)}`}>
                  {selectedDelivery.status}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveriesContent;