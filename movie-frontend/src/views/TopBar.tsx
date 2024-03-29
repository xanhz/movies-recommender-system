import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Config from '../Config';
import * as _ from '../helpers/is';
import { Genre, User } from '../interfaces/movie-system';
import { MovieSystemService } from '../services/movie-system';

function TopBar() {
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [mobileSearch, setMobileSearch] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  const user = JSON.parse(localStorage.getItem('user') ?? 'null') as User;

  const getGenres = async () => {
    const movieSystem = new MovieSystemService();
    const genres = await movieSystem.getGenres();
    setGenres(genres);
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (_.isEmpty(searchTitle)) {
      return;
    }
    window.location.href = `/search?title=${searchTitle}`;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  useEffect(() => {
    getGenres()
  }, []);

  return (
    <>
      <div className="top-bar">
        <Link to="/" className="top-bar-logo">
          <img src="/logo.png" alt={Config.SITE_NAME} />
        </Link>

        <div className="top-bar-search">
          <form onSubmit={submit}>
            <input
              type="text"
              value={searchTitle}
              placeholder="Search"
              onChange={e => setSearchTitle(e.target.value)}
            />
            <i className="fa-solid fa-search"></i>
            <button type="submit" hidden></button>
          </form>
        </div>

        <div className="top-bar-mobile">
          <i className="fa-solid fa-search" onClick={() => setMobileSearch(true)}></i>
        </div>

        {!_.isNil(user) ? (
          <a onClick={logout} style={{ cursor: 'pointer' }}>
            Logout
          </a>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      {mobileSearch && (
        <div className="mobile-search">
          <div className="mobile-search-close" onClick={() => setMobileSearch(false)}>
            <i className="fa-solid fa-times"></i>
          </div>
          <form onSubmit={submit}>
            <div className="mobile-search-input">
              <input
                type="text"
                value={searchTitle}
                placeholder="Search"
                onChange={e => setSearchTitle(e.target.value)}
              />
              <i className="fa-solid fa-search"></i>
            </div>
            <button type="submit" hidden></button>
          </form>
        </div>
      )}
    </>
  );
}

export default TopBar;
