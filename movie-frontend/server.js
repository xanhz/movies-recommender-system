const express = require('express');
const path = require('path');

const app = express();

app.disable('x-powered-by');

const staticDir = path.join(__dirname, 'dist');
app.use(express.static(staticDir));

const contentFile = path.join(staticDir, 'index.html');
app.get('*', (_, res) => {
  res.sendFile(contentFile);
});

const port = parseInt(process.env.PORT || 3000);
app.listen(port, () => {
  console.log('Server is running on port: %d', port);
});
