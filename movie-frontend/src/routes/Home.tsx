import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import CardSection from '../components/CardSection';
import * as _ from '../helpers/is';
import { Movie, MovieWithRatingAndGenres } from '../interfaces/movie-system';
import { MovieSystemService } from '../services/movie-system';
import Loading from '../views/Loading';

function Home() {
  const [hottestMovie, setHottestMovie] = useState<MovieWithRatingAndGenres>(null as any);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [recommendMovies, setRecommendMovies] = useState<Movie[]>([]);
  const limit = 10;

  const getHottestMovie = async () => {
    const movieService = new MovieSystemService();
    const movie = await movieService.getHottestMovie();
    setHottestMovie(movie);
  }

  const getTopMovies = async () => {
    const movieSystem = new MovieSystemService();
    const movies = await movieSystem.getTopMovies(limit);
    setTopMovies(movies);
  }

  async function getRecommendMovies() {
    const movieService = new MovieSystemService();
    let movies: Movie[] = [];
    if (movieService.isAuthorized()) {
      movies = await movieService.getRecommendMovies(limit);
    }
    setRecommendMovies(movies);
  }

  async function getWatchedMovies() {
    const movieService = new MovieSystemService();
    let movies: Movie[] = [];
    if (movieService.isAuthorized()) {
      movies = await movieService.getWatchedMovies(limit);
    }
    setWatchedMovies(movies);
  }

  useEffect(() => {
    getHottestMovie();
    getTopMovies();
    getRecommendMovies();
    getWatchedMovies();
  }, []);

  if (_.isNil(hottestMovie)) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="container">
        <Link
          to={`/movies/${hottestMovie.id}`}
          className="movie-hero"
          style={{
            background: `url(${hottestMovie.image}) no-repeat center / cover`,
          }}
        >
          <div className="movie-hero-drop"></div>

          <div className="movie-hero-content">
            <p className="movie-hero-title">{hottestMovie.title}</p>

            <div className="movie-hero-meta">
              <div className="movie-hero-stars">
                <Fragment>
                  <StarRatings rating={hottestMovie.rating.avg} starRatedColor="gold" numberOfStars={5} name="rating" />
                </Fragment>
              </div>

              <p className="movie-hero-year">{hottestMovie.premiere_date}</p>
            </div>

            <p className="movie-hero-desc">{hottestMovie.summary}</p>

            <button className="movie-hero-play">
              <i className="fa-solid fa-play"></i>
              <p>Play</p>
            </button>
          </div>
        </Link>

        {!_.isEmpty(topMovies) && <CardSection title="Top Rated Movies 👑" items={topMovies} />}
        {!_.isEmpty(recommendMovies) && <CardSection title="Highly recommend for you today 👑" items={recommendMovies} />}
        {!_.isEmpty(watchedMovies) && <CardSection title="Watched by you 🔥" items={watchedMovies} />}
      </div>
    </>
  );
}

export default Home;
