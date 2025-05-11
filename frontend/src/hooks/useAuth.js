import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Ajusta la ruta si es necesario

const useAuth = () => useContext(AuthContext);

export default useAuth;