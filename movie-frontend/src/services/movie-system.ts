import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import Config from '../Config';
import * as _ from '../helpers/is';
import { Genre, Movie, MovieWithRatingAndGenres, User } from '../interfaces/movie-system';

export interface SystemResponse<T = any> {
  code: number;
  data: T;
}

export interface SearchMoviesResult {
  total: number;
  limit: number;
  page: number;
  movies: Movie[];
}

export interface SearchMoviesQuery {
  genre_ids?: number[];
  title?: string;
  limit?: number;
  page?: number;
}

export class MovieSystemService {
  private requester: AxiosInstance;
  private token: string | null;

  constructor() {
    const token = localStorage.getItem('accessToken');
    const config: CreateAxiosDefaults = {
      baseURL: Config.MOVIE_SYSTEM_BASE_URL,
    };
    if (!_.isNil(token)) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    this.requester = axios.create(config);
    this.token = token;
  }

  public login() {
    window.location.href = `${Config.MOVIE_SYSTEM_BASE_URL}/auth/google`;
  }

  public isAuthorized() {
    return !_.isNil(this.token);
  }

  public setToken(token: string) {
    this.requester = axios.create({
      baseURL: Config.MOVIE_SYSTEM_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public async sendRequest<T = any>(config: AxiosRequestConfig) {
    const response = await this.requester<SystemResponse<T>>(config);
    return response.data.data;
  }

  public getHottestMovie() {
    return this.sendRequest<MovieWithRatingAndGenres>({
      method: 'get',
      url: '/movies/collection/hottest',
    })
  }

  public getTopMovies(limit = 10) {
    return this.sendRequest<Movie[]>({
      method: 'get',
      url: '/movies/collection/top',
      params: {
        limit,
      }
    })
  }

  public getWatchedMovies(limit = 10) {
    return this.sendRequest<Movie[]>({
      method: 'get',
      url: '/movies/collection/watched',
      params: {
        limit,
      },
    });
  }

  public getRecommendMovies(limit = 10) {
    return this.sendRequest<Movie[]>({
      method: 'get',
      url: '/movies/collection/recommend',
      params: {
        limit,
      },
    });
  }

  public getNextWatchingMovies(limit = 10) {
    return this.sendRequest<Movie[]>({
      method: 'get',
      url: '/movies/collection/next-watching',
      params: {
        limit,
      },
    });
  }

  public searchMovies(query: SearchMoviesQuery = {}) {
    const { genre_ids, title, limit = 50, page = 1 } = query;
    const vQuery = {};
    if (!_.isEmpty(genre_ids)) {
      // @ts-ignore
      vQuery['genre_ids'] = genre_ids.map(id => `${id}`).join(',');
    }
    if (!_.isEmpty(title)) {
      // @ts-ignore
      vQuery['title'] = title;
    }
    return this.sendRequest<SearchMoviesResult>({
      method: 'get',
      url: '/movies',
      params: {
        ...vQuery,
        limit,
        page,
      },
    });
  }

  public findMovieByID(id: number | string) {
    return this.sendRequest<MovieWithRatingAndGenres>({
      method: 'get',
      url: `/movies/${id}`,
    });
  }

  public getRelatedMovies(id: number | string) {
    return this.sendRequest<Movie[]>({
      method: 'get',
      url: `/movies/${id}/related`,
    });
  }

  public rateMovie(id: number | string, rating: number) {
    return this.sendRequest<Movie[]>({
      method: 'post',
      url: `/movies/${id}/ratings`,
      data: {
        rating,
      },
    });
  }

  public getUserProfile() {
    return this.sendRequest<User>({
      method: 'get',
      url: '/auth/profile',
    });
  }

  public getGenres() {
    return this.sendRequest<Genre[]>({
      method: 'get',
      url: '/genres',
    });
  }
}
