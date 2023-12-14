from typing import List, Tuple

import numpy as np

from services import logging

from .dataset import Dataset


class StochasticGradientDescent:
    def __init__(
        self,
        n_factors: int,
        learning_rate: float = 0.0005,
        regularization: float = 0.0,
        n_epochs: int = 20,
        use_bias: bool = False,
        verbose_step: int = 5,
    ) -> None:
        super().__init__()
        self.n_factors = n_factors
        self.n_epochs = n_epochs
        self.use_bias = use_bias
        self.regularization = regularization
        self.learning_rate = learning_rate
        self.verbose_step = verbose_step
        self.dataset: Dataset = None
        self.U: np.ndarray = None
        self.V: np.ndarray = None

    def fit(self, dataset: Dataset):
        logger = logging.get_logger()

        self.dataset = dataset
        U, V = self._init_matrices()
        self.U = U
        self.V = V
        epoch = 0
        global_mean = self.dataset.global_mean if self.use_bias else 0

        while epoch < self.n_epochs:
            for i, j, r_ij in self.dataset.shuffle():
                r_hat_ij = np.dot(self.U[i, :], self.V[j, :]) + global_mean
                e_ij = r_ij - r_hat_ij

                gradient_Ui = -(e_ij * self.V[j, :] - self.regularization * self.U[i, :])
                gradient_Vj = -(e_ij * self.U[i, :] - self.regularization * self.V[j, :])

                self.U[i, :] -= self.learning_rate * gradient_Ui
                self.V[j, :] -= self.learning_rate * gradient_Vj

            if self.use_bias:
                self.U[:, -1] = 1.0
                self.V[:, -2] = 1.0

            epoch += 1
            if epoch % self.verbose_step == 0:
                logger.info(f'[SGD]: Epoch={epoch}/{self.n_epochs} | RMSE={self._compute_rmse()}')

        return self

    def _init_matrices(self):
        n_users, n_items = self.dataset.shape
        n_factors = self.n_factors

        rng = np.random.RandomState()
        U = rng.normal(0, 0.1, (n_users, n_factors))
        V = rng.normal(0, 0.1, (n_items, n_factors))

        if self.use_bias:
            U = np.column_stack([
                U,
                np.full(shape=(n_users, ), fill_value=0.0),
                np.full(shape=(n_users, ), fill_value=1.0),
            ])

            V = np.column_stack([
                V,
                np.full(shape=(n_items, ), fill_value=1.0),
                np.full(shape=(n_items, ), fill_value=0.0),
            ])

        return U, V

    def _compute_error_matrix(self):
        user_ids = self.dataset.user_ids
        item_ids = self.dataset.item_ids
        global_mean = self.dataset.global_mean if self.use_bias else 0

        R = self.dataset.rating_matrix
        R_hat = self.U @ self.V.T + global_mean

        E = np.zeros(self.dataset.shape)
        E[user_ids, item_ids] = R[user_ids, item_ids] - R_hat[user_ids, item_ids]

        return E

    def _compute_rmse(self) -> float:
        E = self._compute_error_matrix()
        mse = np.mean(E ** 2, where=E != 0)
        return np.sqrt(mse)

    def predict_rating(self, user_id: int, item_id: int, clip: bool = True) -> float:
        n_users, n_items = self.dataset.shape

        if user_id >= n_users or item_id >= n_items:
            return self.dataset.global_mean

        predicted = np.dot(self.U[user_id, :], self.V[item_id, :])

        if self.use_bias:
            predicted += self.dataset.global_mean

        return predicted if not clip else np.clip(predicted, *self.dataset.rating_range)

    def make_recommendation_for_user(self, user_id: int, n_items: int = 10) -> List[Tuple[int, float]]:
        ratings = self.U[user_id, :] @ self.V.T

        # Sort indices in descending order
        item_ids = np.argsort(ratings)[::-1]
        sorted_ratings = np.array(list(zip(item_ids, ratings[item_ids])))

        rated_item_ids = self.dataset.rated_items_by_user(user_id)

        unrated = sorted_ratings[~np.isin(sorted_ratings[:, 0], rated_item_ids)]
        k = min(len(unrated), n_items)

        recommendations = unrated[:k]
        items = recommendations[:, 0].astype(np.int32).tolist()
        ratings = recommendations[:, 1].tolist()

        return list(zip(items, ratings))

    def make_recommendation_for_item(self, item_id: int, n_users: int = 10) -> List[Tuple[int, float]]:
        ratings = self.U @ self.V[item_id, :].T

        # Sort indices in descending order
        user_ids = np.argsort(ratings)[::-1]
        sorted_ratings = np.array(list(zip(user_ids, ratings[user_ids])))

        rated_user_ids = self.dataset.users_rate_item(item_id)

        unrated = sorted_ratings[~np.isin(sorted_ratings[:, 0], rated_user_ids)]
        k = min(len(unrated), n_users)

        recommendations = unrated[:k]
        users = recommendations[:, 0].astype(np.int32).tolist()
        ratings = recommendations[:, 1].tolist()

        return list(zip(users, ratings))

    def load_user_factors(self, filepath: str):
        self.U = np.load(filepath)

    def load_item_factors(self, filepath: str):
        self.V = np.load(filepath)
