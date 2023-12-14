import axios from 'axios';
import csv from 'csvtojson/v2';

export async function downloadCSVFromDrive(url: string): Promise<Record<string, string>[]> {
  const fileID = url.match(/[-\w]{25,}/).pop();
  const link = `https://drive.google.com/uc?id=${fileID}&export=download`;

  console.log('Downloading from %s', link);
  const response = await axios.get(link, { responseType: 'stream' });

  return csv()
    .fromStream(response.data)
    .subscribe()
    .then((rows) => rows);
}
