import { faker } from '@faker-js/faker';
import { client } from './client';
import { downloadCSVFromDrive } from './download';
import { Role } from '@prisma/client';

async function main() {
  try {
    console.log('Connecting to database');
    await client.$connect();

    const url = 'https://drive.google.com/file/d/1D55LhTCcBdeIFytbBd2p1sS1mn1tgsoE/view?usp=drivesdk';
    const users = await downloadCSVFromDrive(url);

    const records = users.map((user, index) => {
      return {
        id: parseInt(user['ID']),
        email: `${index}_${faker.internet.email()}`,
        fullname: faker.person.fullName({ sex: user['Gender'] === 'M' ? 'male' : 'female' }),
        role: Role.User,
      };
    });

    console.log('Inserting %d users', records.length);
    await client.user.createMany({ data: records });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
