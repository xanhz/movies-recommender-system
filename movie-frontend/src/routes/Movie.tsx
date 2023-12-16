import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import YouTube from 'react-youtube';
import CardSection from '../components/CardSection';
import { isEmpty } from '../helpers/is';
import { Movie as $Movie, MovieWithRatingAndGenres } from '../interfaces/movie-system';
import { MovieSystemService } from '../services/movie-system';
import Loading from '../views/Loading';

function Movie() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [data, setData] = useState<MovieWithRatingAndGenres>(null as any);
  const [relatedMovies, setRelatedMovies] = useState<$Movie[]>([]);
  const [nextWatching, setNextWatching] = useState<$Movie[]>([]);

  const getMovie = async () => {
    const movieSystem = new MovieSystemService();
    try {
      const movie = await movieSystem.findMovieByID(id as string);
      setData(movie);
    } catch (error) {
      return navigate('/404');
    }
  };

  const getRelatedMovies = async () => {
    const movieSystem = new MovieSystemService();
    const movies = await movieSystem.findRelatedMovies(id as string);
    setRelatedMovies(movies);
  };

  const getYoutubeId = (youTubeUrl?: string) => {
    if (!youTubeUrl) return '';
    let videoId = '';
    let startIndex = youTubeUrl.indexOf('?v=');

    if (startIndex !== -1) {
      startIndex += 3;
      var endIndex = youTubeUrl.indexOf('&', startIndex);

      if (endIndex === -1) {
        endIndex = youTubeUrl.length;
      }

      videoId = youTubeUrl.substring(startIndex, endIndex);
    }

    return videoId;
  };

  const changeRating = async (rating: number) => {
    const movieSystem = new MovieSystemService();
    if (!movieSystem.isAuthorized()) {
      return movieSystem.login();
    }
    await movieSystem.rateMovie(id as string, rating);
    const movies = await movieSystem.getNextWatching();
    return setNextWatching(movies);
  };

  useEffect(() => {
    setData(null as any);
    getMovie();
    getRelatedMovies();
  }, [id]);

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>{data.title}</title>
      </Helmet>
      <div className="container">
        <div className="video-frame">
          <YouTube videoId={getYoutubeId(data.link)} />
        </div>

        <div className="video-meta">
          <p className="video-meta-title">{data.title}</p>

          <div className="video-meta-row">
            <div className="video-meta-stars">
              {data.rating && (
                <Fragment>
                  <StarRatings
                    rating={data.rating.avg}
                    starRatedColor="gold"
                    changeRating={changeRating}
                    numberOfStars={5}
                    name="rating"
                  />
                  <p>{data.rating.count} rates</p>
                </Fragment>
              )}
            </div>
            {data.premiere_date && <p className="video-meta-year">{moment(data.premiere_date).format('DD/MM/YYYY')}</p>}
          </div>

          <p className="video-meta-desc">{data.summary}</p>

          <div className="video-meta-genres">
            {!isEmpty(data.genres) &&
              data.genres.map((genre: string) => (
                <div key={genre} className="video-meta-genre">
                  <p>{genre}</p>
                </div>
              ))}
          </div>
        </div>
        {!isEmpty(nextWatching) && <CardSection title="Next watching 👍" items={nextWatching} />}

        <br />

        <CardSection title="Related Movies 👍" items={relatedMovies} />
      </div>
    </>
  );
}

export default Movie;
