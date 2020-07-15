import { Router } from 'express';
import { createPoll, getPoll, getPolls } from './polls';

export const api = Router();

api.get('/polls', getPolls);
api.get('/polls/:id', getPoll);
api.post('/polls', createPoll);
