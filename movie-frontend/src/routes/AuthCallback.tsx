import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MovieSystemService } from '../services/movie-system';
import Loading from '../views/Loading';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loadUser = async () => {
    const accessToken = searchParams.get('access_token') as string;
    const refreshToken = searchParams.get('refresh_token') as string;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    const movieService = new MovieSystemService();
    const user = await movieService.getUserProfile();
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/');
  };

  useEffect(() => {
    loadUser();
  }, []);

  return <Loading />;
};

export default AuthCallback;
