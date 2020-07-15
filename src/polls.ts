import { Request, Response, response } from 'express';
import { v4 as uuid } from 'uuid';

interface Poll {
  id: string;
  text: string;
  imageUri: string;
  allowMultiple: boolean;
  dateCreated: string;
  createdBy: User;
  options: PollOption[];
}

interface PollOption {
  id: string;
  text: string;
  imageUri: string;
  voteCount: number;
  votedForByUser: boolean;
}

interface User {
  displayName: string;
  avatarUri: string;
}

function nowAsString() {
  return new Date().toISOString();
}

const systemUser: User = {
  displayName: 'System',
  avatarUri: 'https://cdn.auth0.com/avatars/sy.png',
};

const defaultPoll1: Poll = {
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

const defaultPoll2: Poll = {
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

const pollsDb: Poll[] = [defaultPoll1, defaultPoll2];

export function getPolls(req: Request, res: Response<Poll[]>) {
  res.json(pollsDb);
}

interface CreatePollDto {
  allowMultiple: boolean;
  imageUri: string;
  text: string;
  options: CreatePollOptionDto[];
}

interface CreatePollOptionDto {
  imageUri: string;
  text: string;
}

export function createPoll(req: Request<{}, string, CreatePollDto>, res: Response<string>) {
  const dto = req.body;
  const poll: Poll = {
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

export function getPoll(req: Request<{ id: string }, Poll>, res: Response<Poll>) {
  const poll = pollsDb.find((p) => p.id === req.params.id);
  res.json(poll);
}
