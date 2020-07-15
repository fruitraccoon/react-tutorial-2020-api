import { Router } from 'express';
import jwt from 'express-jwt';
import { createPoll, getPoll, getPolls } from './polls';

export function createApi(secure: jwt.RequestHandler) {
  const api = Router();

  api.get('/polls', getPolls);
  api.get('/polls/:id', getPoll);
  api.post('/polls', secure, createPoll);

  return api;
}
