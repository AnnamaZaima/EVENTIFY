// NotificationIcon.js
import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from './NotificationContext';

const NotificationIcon = () => {
  const { unreadCount, markAsRead, notifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAsRead();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      cursor: 'pointer'
    }}>
      <div style={{ position: 'relative' }} onClick={toggleNotifications}>
        <FaBell size={24} />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            {unreadCount}
          </div>
        )}
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          right: '0',
          top: '40px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          width: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h4>Notifications</h4>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {notifications.map((notification, index) => (
                <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  {notification.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;