const path = require('path');
const express = require('express');
const app = express();

app.disable('x-powered-by');

const staticDir = path.join(__dirname, 'dist');
app.use(express.static(staticDir));

app.get('*', (_, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const port = parseInt(process.env.PORT || 3000);
app.listen(port, () => {
  console.log('Server is running on port: %d', port);
});
