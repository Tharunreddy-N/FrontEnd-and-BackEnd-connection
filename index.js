const express = require('express');
const cors = require('cors');
const postsRouter = require('./backend/routes/posts');
const authRouter = require('./backend/routes/auth');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});