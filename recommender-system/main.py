from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from helpers import file
from mf import Dataset, StochasticGradientDescent
from models import MovieRating
from services import drive, env, logging

env.init()
logging.init()

model = StochasticGradientDescent(
    n_factors=50,
    learning_rate=0.0005,
    regularization=0.03,
    n_epochs=100,
    use_bias=True,
)

logger = logging.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('[APP]: Loading dataset...')
    dataset_path = drive.download_file(fileID=env.get('DATASET_FILE_ID'))
    model.dataset = Dataset.from_csv(
        filepath=dataset_path,
        user_field='UserID',
        item_field='MovieID',
        rating_field='Rating',
    )
    file.remove(dataset_path)

    logger.info('[APP]: Loading user factors...')
    user_factors = drive.download_file(fileID=env.get('USER_FACTORS_FILE_ID'))
    model.load_user_factors(user_factors)

    logger.info('[APP]: Removing file %s', user_factors)
    file.remove(user_factors)

    logger.info('[APP]: Loading item factors...')
    item_factors = drive.download_file(fileID=env.get('ITEM_FACTORS_FILE_ID'))
    model.load_item_factors(item_factors)

    logger.info('[APP]: Removing file %s', item_factors)
    file.remove(item_factors)

    yield

app = FastAPI(lifespan=lifespan)


@app.get('/recommend/{user_id}/movies/today')
def recommend_today(user_id: int, k: int = 10):
    logger.info('[APP]: Making today recommendation for user %d with %d movies', user_id, k)
    return model.make_recommendation_for_user(user_id, k)


@app.get('/recommend/{user_id}/movies/next-watching')
def recommend_next_watching(user_id: int, k: int = 10):
    logger.info('[APP]: Making next watching recommendation for user %d with %d movies', user_id, k)
    return model.make_recommendation_for_user(user_id, k)


@app.post('/movie-ratings')
def rate_movie(movie_rating: MovieRating):
    return movie_rating


if __name__ == '__main__':
    uvicorn.run(
        app=app,
        host=env.get('HOST', '0.0.0.0'),
        port=int(env.get('PORT', 8000))
    )
