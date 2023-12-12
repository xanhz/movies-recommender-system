import { client } from './client';
import { downloadCSVFromDrive } from './download';

async function main() {
  try {
    const url = 'https://drive.google.com/file/d/1Ml7fihi2BYRKPL6eN1A54JCrwqYDDgnY/view?usp=drivesdk';
    await client.$connect();
    const movies = await downloadCSVFromDrive(url);
    const $movies = movies.map((movie) => {
      return {
        id: movie['ID'],
        title: movie['Title'],
        genres: movie['Genres'].split('|').map((genre) => genre.trim()),
      };
    });
    const genreNames: string[] = $movies.reduce((prev, curr) => {
      return prev.concat(curr.genres);
    }, []);

    const genres = [...new Set(genreNames)].map((genre, index) => ({ id: index + 1, name: genre }));

    await client.genre.createMany({ data: genres });
    let promises = [];
    for (const movie of $movies) {
      const record = {
        id: parseInt(movie.id),
        title: movie.title,
        link: 'https://www.youtube.com/watch?v=6ZfuNTqbHE8',
        image: 'https://cdn-amz.woka.io/images/I/815oKqKUo4L.jpg',
        summary:
          // eslint-disable-next-line max-len
          'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
        movie_genres: {
          createMany: {
            data: movie.genres.map((genre) => {
              return {
                genre_id: genres.find((o) => o.name === genre).id,
              };
            }),
          },
        },
      };
      promises.push(client.movie.create({ data: record }));
      if (promises.length === 100) {
        await Promise.all(promises);
        promises = [];
      }
    }
    await Promise.all(promises);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
