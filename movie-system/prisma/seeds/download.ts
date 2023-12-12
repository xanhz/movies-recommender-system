import axios from 'axios';
import csv from 'csvtojson/v2';

export async function downloadCSVFromDrive<T = any>(url: string): Promise<T[]> {
  const fileID = url.match(/[-\w]{25,}/).pop();
  const response = await axios.get(`https://drive.google.com/uc?id=${fileID}&export=download`, {
    responseType: 'stream',
  });
  const readstream = response.data;
  return csv()
    .fromStream(readstream)
    .subscribe()
    .then((rows) => rows);
}
