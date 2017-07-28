const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send({ hello: 'wassup' });
});

app.listen(PORT, () => {
  console.log(`Panda server running on port ${PORT}`);
});
