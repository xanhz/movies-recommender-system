import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import CardSection from '../components/CardSection';
import { Movie, MovieWithRatingAndGenres } from '../interfaces/movie-system';
import { MovieSystemService } from '../services/movie-system';
import Loading from '../views/Loading';

function Home() {
  const [featured, setFeatured] = useState<MovieWithRatingAndGenres>(null as any);

  const [recommendToday, setRecommendToday] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  async function getFeatured() {
    const movieService = new MovieSystemService();
    const movie = await movieService.findMovieByID(1);
    setFeatured(movie);
  }

  async function getRecommendToday() {
    const movieService = new MovieSystemService();
    if (!movieService.isAuthorized()) {
      return;
    }
    const movies = await movieService.getRecommendToday();
    setRecommendToday(
      movies.map(movie => ({
        ...movie,
        type: 'movie',
      }))
    );
  }

  async function getPopularMovies() {
    const movieSystem = new MovieSystemService();
    const { movies } = await movieSystem.findMovies({
      limit: 10,
      page: 1,
      genre_ids: [1, 2, 3],
    });
    setPopularMovies(
      movies.map(movie => ({
        ...movie,
        type: 'movie',
      }))
    );
  }

  async function getTopMovies() {
    const movieSystem = new MovieSystemService();
    const { movies } = await movieSystem.findMovies({
      limit: 10,
      page: 1,
      genre_ids: [4, 7, 8],
    });
    setTopMovies(
      movies.map(movie => ({
        ...movie,
        type: 'movie',
      }))
    );
  }

  useEffect(() => {
    getFeatured();
    getRecommendToday();
    getPopularMovies();
    getTopMovies();
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
                  <StarRatings
                    rating={featured.rating.avg}
                    starRatedColor="gold"
                    numberOfStars={5}
                    name="rating"
                  />
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

        {recommendToday && recommendToday.length > 0 && (
          <CardSection title="Top Rated Movies 👑" items={recommendToday} />
        )}

        {!topMovies ? (
          <div className="movie-section">
            <p className="movie-section-title">Top Rated Movies 🔥</p>

            <div className="movie-section-loading">
              <i className="fa-solid fa-spinner-third"></i>
            </div>
          </div>
        ) : (
          <CardSection title="Top Rated Movies 🔥" items={topMovies} />
        )}

        {!popularMovies ? (
          <div className="movie-section">
            <p className="movie-section-title">Popular Movies 🔥</p>

            <div className="movie-section-loading">
              <i className="fa-solid fa-spinner-third"></i>
            </div>
          </div>
        ) : (
          <CardSection title="Popular Movies 🔥" items={popularMovies} />
        )}
      </div>
    </>
  );
}

export default Home;
