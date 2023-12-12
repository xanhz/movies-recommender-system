import { faker } from '@faker-js/faker';
import { client } from './client';
import { downloadCSVFromDrive } from './download';
import { Role } from '@prisma/client';

async function main() {
  try {
    const url = 'https://drive.google.com/file/d/1D55LhTCcBdeIFytbBd2p1sS1mn1tgsoE/view?usp=drivesdk';
    await client.$connect();
    const users = await downloadCSVFromDrive(url);
    const records = users.map((user, index) => {
      return {
        id: parseInt(user['ID']),
        email: `${index}_${faker.internet.email()}`,
        fullname: faker.person.fullName({ sex: user['Gender'] === 'M' ? 'male' : 'female' }),
        role: Role.User,
      };
    });
    await client.user.createMany({ data: records });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
