import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { isEmpty, isNil } from '../helpers/is';
import { Movie } from '../interfaces/movie-system';
import { MovieSystemService } from '../services/movie-system';

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const searchBy = searchParams.get('searchBy');
  const [movies, setMovies] = useState<Movie[]>([]);

  async function getResults() {
    const movieService = new MovieSystemService();
    const query = {
      page: 1,
      limit: 20,
    };
    if (!isNil(searchBy) && !isEmpty(q)) {
      // @ts-ignore
      query[searchBy] = q;
    }
    const { movies } = await movieService.findMovies(query);
    setMovies(movies);
  }

  useEffect(() => {
    getResults();
  }, [searchBy, q]);

  return (
    <div className="container">
      <h2>Result for {q}</h2>
      <div className="movie-section-row">
        <div className="movie-section" style={{ display: 'flex' }}>
          {movies.map((movie: any) => (
            <Link
              to={`/movie/${movie.id}`}
              className="movie-card"
              style={{
                display: 'block',
                background: `url(${movie.image}) no-repeat center / cover`,
              }}
            >
              <div className="movie-card-content">
                <i className="fa-solid fa-play"></i>

                <p>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
