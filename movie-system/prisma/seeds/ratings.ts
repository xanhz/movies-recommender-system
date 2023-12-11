import { client } from './client';
import { downloadCSVFromDrive } from './download';

async function main() {
  try {
    const url = 'https://drive.google.com/file/d/1uOPW4aZ75PAwcwJk31i-4Ch4J8Z3f0-o/view?usp=drivesdk';
    await client.$connect();
    const movieRatings = await downloadCSVFromDrive(url);
    const records = movieRatings.map((movieRating) => {
      return {
        movie_id: parseInt(movieRating['MovieID']),
        user_id: parseInt(movieRating['UserID']),
        rating: parseFloat(movieRating['Rating']),
        time: new Date(parseInt(movieRating['Timestamp']) * 1000),
      };
    });
    await client.movieRating.createMany({ data: records });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
