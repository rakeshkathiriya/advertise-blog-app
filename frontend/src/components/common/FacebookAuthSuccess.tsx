import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { getUserRole } from '../../utils/helper';

export const FacebookAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const params = new URLSearchParams(globalThis.window.location.search);
    // const fba = params.get('fba');
    const token = params.get('token');
    const user = params.get('user');
    const role = getUserRole();
    const userData = user ? JSON.parse(user) : null;

    // console.log('Token in faceBook Auth Success', fba);
    if (token) localStorage.setItem('accessToken', token);
    // if (fba) localStorage.setItem('fba', fba);s

    const payload = {
      _id: userData?._id,
      firstname: userData?.firstname,
      lastname: userData?.lastname,
      email: userData?.email,
      role: userData?.role,
    };

    dispatch(setUser(payload));

    // if (user) localStorage.setItem('user', user);

    if (!role) {
      navigate('/login');
    }

    if (role === 'Admin') {
      navigate('/aba-admin');
    }

    if (role === 'User') {
      navigate('/');
    }
    setTimeout(() => {
      window.history.replaceState(null, '', '/facebook-auth-success');
    }, 50);
  }, []);

  return <p>Logging you in...</p>;
};
