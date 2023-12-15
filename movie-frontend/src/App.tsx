import { Route, Routes } from 'react-router-dom';
import AuthCallback from './routes/AuthCallback';
import E404 from './routes/E404';
import Home from './routes/Home';
import Login from './routes/Login';
import Movie from './routes/Movie';
import Search from './routes/Search';
import Footer from './views/Footer';
import TopBar from './views/TopBar';

function App() {
  return (
    <>
      <TopBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/callback" element={<AuthCallback />} />
        <Route path="*" element={<E404 />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
