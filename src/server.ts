import cors from 'cors';
import express from 'express';
import { api } from './api';

const app = express();
const port = 5000;

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => res.json('The PurPoll API Server is awake!'));

app.use('/api', api);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
