from pydantic import BaseModel


class MovieRating(BaseModel):
    user_id: int
    movie_id: int
    rating: float
