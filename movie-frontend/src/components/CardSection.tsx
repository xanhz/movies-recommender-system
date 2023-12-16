import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';
import { Link } from 'react-router-dom';

let breakpoints = {
  0: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  400: {
    slidesPerView: 3,
    spaceBetween: 20,
  },
  680: {
    slidesPerView: 4,
    spaceBetween: 20,
  },
  850: {
    slidesPerView: 5,
    spaceBetween: 20,
  },
  1000: {
    slidesPerView: 6,
    spaceBetween: 20,
  },
  1200: {
    slidesPerView: 7,
    spaceBetween: 20,
  },
  1300: {
    slidesPerView: 8,
    spaceBetween: 20,
  },
};

function CardSection({ title, items, autoplay = { delay: 5000 } }: any) {
  if (!items) {
    return null;
  }

  return (
    <div className="movie-section">
      <p className="movie-section-title">{title}</p>

      <Swiper
        autoplay={autoplay}
        navigation={true}
        modules={[Navigation, Autoplay]}
        loop={true}
        className="movie-section-row"
        breakpoints={breakpoints}
      >
        {items.map((item: any) => (
          <SwiperSlide key={item.id}>
            <Link
              to={`/movie/${item.id}`}
              className="movie-card"
              style={{
                background: `url(${item.image}) no-repeat center / cover`,
              }}
            >
              <div className="movie-card-content">
                <i className="fa-solid fa-play"></i>
                <p>{item.title}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CardSection;
