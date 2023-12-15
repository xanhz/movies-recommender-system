import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import Config from '../Config';
import { isEmpty, isNil } from '../helpers/is';
import { Movie, MovieWithRatingAndGenres, User } from '../interfaces/movie-system';

export interface SystemResponse<T = any> {
  code: number;
  data: T;
}

export interface FindMoviesResult {
  total: number;
  limit: number;
  page: number;
  movies: Movie[];
}

export interface FindMoviesQuery {
  genre_ids?: number[];
  title?: string;
  fields?: string[];
  limit?: number;
  page?: number;
  order_by?: Record<string, 'asc' | 'desc'>;
}

export class MovieSystemService {
  private requester: AxiosInstance;
  private token: string | null;

  constructor() {
    const token = localStorage.getItem('accessToken');
    const config: CreateAxiosDefaults = {
      baseURL: Config.MOVIE_SYSTEM_BASE_URL,
    };
    if (!isNil(token)) {
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
    return !isNil(this.token);
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

  public getRecommendToday(k = 10) {
    return this.sendRequest<Movie[]>({
      method: 'get',
      url: '/recommender/movies/today',
      params: {
        k,
      },
    });
  }

  public getNextWatching(k = 10) {
    return this.sendRequest<Movie[]>({
      method: 'get',
      url: '/recommender/movies/next-watching',
      params: {
        k,
      },
    });
  }

  public findMovies(query: FindMoviesQuery = {}) {
    const { fields, genre_ids, order_by, title, limit = 10, page = 1 } = query;
    const vQuery = {};
    if (!isEmpty(fields)) {
      // @ts-ignore
      vQuery['fields'] = fields.join(',');
    }
    if (!isEmpty(genre_ids)) {
      // @ts-ignore
      vQuery['genre_ids'] = genre_ids.map(id => id.toString()).join(',');
    }
    if (!isEmpty(title)) {
      // @ts-ignore
      vQuery['title'] = title;
    }
    if (!isEmpty(order_by)) {
      // @ts-ignore
      vQuery['order_by'] = Object.entries(order_by)
        .map(pair => `${pair[0]}:${pair[1]}`)
        .join(',');
    }
    return this.sendRequest<FindMoviesResult>({
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

  public findRelatedMovies(id: number | string) {
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
}
