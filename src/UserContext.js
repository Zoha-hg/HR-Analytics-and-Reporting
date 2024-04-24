import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await axios.get('https://hr-analytics-and-reporting-production.up.railway.app/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data?.username) {
            setUser({ username: data.username, token });
          }
        } catch (error) {
          console.error('Error verifying token:', error);
        }
      }
    };
  
    verifyUser();
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
