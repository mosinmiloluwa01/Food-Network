import express from 'express';
import indexRouter from './v1';

const router = express.Router();

router.use('/api/v1', indexRouter);
router.get('/', (req, res) => {
  res.status(200).send(`<h1>Welcome To Food Network</h1>
    <p>Food Network - A web application that allows you to order food.</p>
    <h4>Please use PostMan and navigate to <code>/api/v1</code> to use the app</h4>
    <p>For any more info, please click
     <a href='https://github.com/mosinmiloluwa01/Food-Network'> here </a>
     to visit the repo.</P>
      <h4>Thanks  &#x1F600;</h4>`);
});

export default router;
