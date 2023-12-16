import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Config from '../Config';

function TopBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const [mobileSearch, setMobileSearch] = useState<boolean>(false);
  const [searchBy, setSearchBy] = useState<string>('title');
  const user = JSON.parse(localStorage.getItem('user') as string);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  const onChangeSearchBy = async (event: any) => {
    setSearchBy(event.target.value);
  };

  const submit = (event: any) => {
    event.preventDefault();
    navigate(`/search?searchBy=${searchBy}&q=${search}`);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  return (
    <>
      <div className="top-bar">
        <Link to="/" className="top-bar-logo">
          <img src="/logo.png" alt={Config.SITE_NAME} />
        </Link>

        <div className="top-bar-search">
          <form onSubmit={submit}>
            <select onChange={onChangeSearchBy} value={searchBy}>
              <option value="title">Title</option>
              <option value="genre_ids">Genre</option>
            </select>
            <input type="text" value={search} placeholder="Search" onChange={e => onChange(e)} />

            <i className="fa-solid fa-search"></i>
            <button type="submit" hidden></button>
          </form>
        </div>

        <div className="top-bar-mobile">
          <i className="fa-solid fa-search" onClick={() => setMobileSearch(true)}></i>
        </div>
        {user?.email ? (
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
              <input type="text" value={search} placeholder="Search" onChange={e => onChange(e)} />

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
