import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { createApi } from './api';

const app = express();
const port = 5000;

// Based on: https://auth0.com/docs/quickstart/backend/nodejs/01-authorization
const checkJwt = jwt({
  // As this is just for a tutorial, use the issuer from the access token
  secret: (req, header, payload, done) => {
    jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${payload.iss}.well-known/jwks.json`,
    })(req, header, payload, done);
  },
  audience: 'https://purpoll.com',
  algorithms: ['RS256'],
  requestProperty: 'decodedAccessToken',
});

const jsonParser = bodyParser.json();

app.use(jsonParser);
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => res.json('The PurPoll API Server is awake!'));

app.get('/definitions', (req, res) =>
  res.sendFile('dtoTypes.ts', {
    root: __dirname,
    headers: { 'Content-Type': 'text/plain' },
  })
);

app.use('/api', createApi(checkJwt));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
