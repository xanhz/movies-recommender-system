import { useNavigate } from 'react-router-dom';
import { MovieSystemService } from '../services/movie-system';

const Login = () => {
  const navigate = useNavigate();

  const onClick = () => {
    const movieService = new MovieSystemService();
    if (movieService.isAuthorized()) {
      navigate('/');
    } else {
      movieService.login();
    }
  };

  return (
    <div className="container login-form">
      <div className="row">
        <h2>Login to improve your experience</h2>

        <div className="col">
          <a onClick={onClick} className="google btn">
            <i className="fab fa-google fa-fw"></i> Login with Google+
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
