export interface Movie {
  id: number;
  title: string;
  premiere_date?: string;
  image?: string;
  link?: string;
  summary?: string;
  created_at?: string;
  updated_at: string;
}

export interface MovieWithRatingAndGenres extends Movie {
  genres: string[];
  rating: {
    count: number;
    avg: number;
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
}
