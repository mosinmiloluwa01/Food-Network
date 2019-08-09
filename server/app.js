import express from 'express';
import bodyParser from 'body-parser';
import env from 'dotenv';

env.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all('*', (req, res) => res.status(404).send({
  status: 'error',
  message: 'you have entered an incorrect route'
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port:${port}`));
