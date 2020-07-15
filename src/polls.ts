import { Request, Response, response } from 'express';
import { v4 as uuid } from 'uuid';
import { CreatePollDto, PollDto, UserDto } from './types';

function nowAsString() {
  return new Date().toISOString();
}

const systemUser: UserDto = {
  displayName: 'System',
  avatarUri: 'https://cdn.auth0.com/avatars/sy.png',
};

const defaultPoll1: PollDto = {
  id: uuid(),
  text: 'Do you prefer cats or dogs?',
  imageUri: '',
  allowMultiple: false,
  dateCreated: nowAsString(),
  createdBy: systemUser,
  options: [
    {
      id: uuid(),
      text: 'Cats',
      imageUri: '',
      voteCount: 0,
      votedForByUser: false,
    },
    {
      id: uuid(),
      text: 'Dogs',
      imageUri: '',
      voteCount: 0,
      votedForByUser: false,
    },
  ],
};

const defaultPoll2: PollDto = {
  id: uuid(),
  text: "What's your favourite colour?",
  imageUri: '',
  allowMultiple: false,
  dateCreated: nowAsString(),
  createdBy: systemUser,
  options: [
    {
      id: uuid(),
      text: 'Red',
      imageUri: '',
      voteCount: 0,
      votedForByUser: false,
    },
    {
      id: uuid(),
      text: 'Green',
      imageUri: '',
      voteCount: 0,
      votedForByUser: false,
    },
    {
      id: uuid(),
      text: 'Blue',
      imageUri: '',
      voteCount: 0,
      votedForByUser: false,
    },
  ],
};

const pollsDb: PollDto[] = [defaultPoll1, defaultPoll2];

export function getPolls(req: Request, res: Response<PollDto[]>) {
  res.json(pollsDb);
}

export function createPoll(req: Request<{}, string, CreatePollDto>, res: Response<string>) {
  const dto = req.body;
  const poll: PollDto = {
    ...dto,
    id: uuid(),
    dateCreated: nowAsString(),
    createdBy: systemUser,
    options: dto.options.map((o) => ({
      ...o,
      id: uuid(),
      voteCount: 0,
      votedForByUser: false,
    })),
  };
  pollsDb.push(poll);
  response.json(poll.id);
}

export function getPoll(req: Request<{ id: string }, PollDto>, res: Response<PollDto>) {
  const poll = pollsDb.find((p) => p.id === req.params.id);
  res.json(poll);
}
