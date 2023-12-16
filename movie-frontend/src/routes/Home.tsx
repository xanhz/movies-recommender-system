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
  const [featured, setFeatured] = useState<MovieWithRatingAndGenres>(null as any);
  const [recommendMovies, setRecommendToday] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [hotMovies, setHotMovies] = useState<Movie[]>([]);
  const limit = 10;

  async function getFeatured() {
    const movieService = new MovieSystemService();
    const movie = await movieService.findMovieByID(1);
    setFeatured(movie);
  }

  async function getHotMovies() {
    const movieSystem = new MovieSystemService();
    const movies = await movieSystem.getHotMovies(limit);
    setHotMovies(
      movies.map(movie => ({
        ...movie,
        type: 'movie',
      }))
    );
  }

  async function getRecommendToday() {
    const movieService = new MovieSystemService();
    let movies: Movie[] = [];
    if (movieService.isAuthorized()) {
      movies = await movieService.getRecommendToday(limit);
    }
    setRecommendToday(
      movies.map(movie => ({
        ...movie,
        type: 'movie',
      }))
    );
  }

  async function getWatchedMovies() {
    const movieService = new MovieSystemService();
    let movies: Movie[] = [];
    if (movieService.isAuthorized()) {
      movies = await movieService.getWatchedMovies(limit);
    }
    setWatchedMovies(
      movies.map(movie => ({
        ...movie,
        type: 'movie',
      }))
    );
  }

  useEffect(() => {
    getFeatured();
    getHotMovies();
    getRecommendToday();
    getWatchedMovies();
  }, []);

  if (!featured) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="container">
        <Link
          to={`/movie/${featured.id}`}
          className="movie-hero"
          style={{
            background: `url(${featured.image}) no-repeat center / cover`,
          }}
        >
          <div className="movie-hero-drop"></div>

          <div className="movie-hero-content">
            <p className="movie-hero-title">{featured.title}</p>

            <div className="movie-hero-meta">
              <div className="movie-hero-stars">
                <Fragment>
                  <StarRatings rating={featured.rating.avg} starRatedColor="gold" numberOfStars={5} name="rating" />
                </Fragment>
              </div>

              <p className="movie-hero-year">{featured.premiere_date}</p>
            </div>

            <p className="movie-hero-desc">{featured.summary}</p>

            <button className="movie-hero-play">
              <i className="fa-solid fa-play"></i>
              <p>Play</p>
            </button>
          </div>
        </Link>

        {!_.isEmpty(hotMovies) && <CardSection title="Top Rated Movies 👑" items={hotMovies} />}
        {!_.isEmpty(recommendMovies) && <CardSection title="Highly recommend for you today 👑" items={recommendMovies} />}
        {!_.isEmpty(watchedMovies) && <CardSection title="Watched by you 🔥" items={watchedMovies} />}
      </div>
    </>
  );
}

export default Home;
