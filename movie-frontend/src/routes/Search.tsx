import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as _ from '../helpers/is';
import { Movie } from '../interfaces/movie-system';
import { SearchMoviesQuery, MovieSystemService } from '../services/movie-system';
import Loading from '../views/Loading';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>();
  const [total, setTotal] = useState<number>(0);

  const buildQuery = () => {
    const query: SearchMoviesQuery = {};

    const page = searchParams.get('page');
    if (!_.isNil(page) && _.isNumeric(page)) {
      query['page'] = parseInt(page);
    }

    const limit = searchParams.get('limit');
    if (!_.isNil(limit) && _.isNumeric(limit)) {
      query['limit'] = parseInt(limit);
    }

    const title = searchParams.get('title');
    if (!_.isNil(title) && !_.isEmpty(title)) {
      query['title'] = title;
    }

    const genreIDs = searchParams.get('genre_ids');
    if (!_.isNil(genreIDs)) {
      const _genreIDs = genreIDs
        .split(',')
        .filter((genreID) => _.isNumeric(genreID))
        .map((genreID) => parseInt(genreID));
      if (!_.isEmpty(_genreIDs)) {
        query['genre_ids'] = _genreIDs;
      }
    }
    return query;
  }

  const fetchMovies = async () => {
    const movieService = new MovieSystemService();
    const query = buildQuery();
    const { movies, total } = await movieService.searchMovies(query);
    setMovies(movies);
    setTotal(total);
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  if (_.isNil(movies)) {
    return <Loading />
  }

  return (
    <div className="container">
      <h2>Found {total} movies</h2>
      <div
        className="movie-section"
        style={{
          display: 'grid',        
          gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
          gap: '10px',
        }}
      >
        {movies.map((movie: any) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
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
  );
};

export default Search;
