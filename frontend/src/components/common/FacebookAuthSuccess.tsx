import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../utils/helper';

export const FacebookAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(globalThis.window.location.search);

    const token = params.get('token');
    const user = params.get('user');
    const role = getUserRole();

    if (token) localStorage.setItem('accessToken', token);

    if (user) localStorage.setItem('user', user);

    if (!role) {
      navigate('/login');
    }

    if (role === 'Admin') {
      navigate('/aba-admin');
    }

    if (role === 'User') {
      navigate('/');
    }
  }, []);

  return <p>Logging you in...</p>;
};
