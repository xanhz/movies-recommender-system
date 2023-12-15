interface AppConfig {
  SITE_NAME: string;
  MOVIE_SYSTEM_BASE_URL: string;
  TMDB_IMAGE_URL: string;
}

export default {
  SITE_NAME: import.meta.env.VITE_SITE_NAME || 'Movies',
  MOVIE_SYSTEM_BASE_URL: import.meta.env.VITE_MOVIE_SYSTEM_BASE_URL || 'http://localhost:5000',
  TMDB_IMAGE_URL: import.meta.env.VITE_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p',
} as AppConfig;
