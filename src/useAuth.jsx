import { useContext } from 'react';
import { UserContext } from './UserContext';

const useAuth = () => {
  const {user} = useContext(UserContext);

  const isAuthenticated = user?.token;
  
  return isAuthenticated;
};

export default useAuth;
