import { v4 as uuid } from 'uuid';
import { Poll, User } from './types';
import { nowAsString } from './utils';

export const systemUser: User = {
  id: 'system',
  displayName: 'System',
  avatarUri: 'https://cdn.auth0.com/avatars/sy.png',
};

export const defaultPoll1: Poll = {
  id: uuid(),
  text: 'Do you prefer cats or dogs?',
  allowMultiple: false,
  dateCreated: nowAsString(),
  createdBy: systemUser,
  options: [
    {
      id: uuid(),
      text: 'Cats',
      votedForBy: [],
    },
    {
      id: uuid(),
      text: 'Dogs',
      votedForBy: [],
    },
  ],
};

export const defaultPoll2: Poll = {
  id: uuid(),
  text: "What's your favourite colour?",
  allowMultiple: false,
  dateCreated: nowAsString(),
  createdBy: systemUser,
  options: [
    {
      id: uuid(),
      text: 'Red',
      votedForBy: [],
    },
    {
      id: uuid(),
      text: 'Green',
      votedForBy: [],
    },
    {
      id: uuid(),
      text: 'Blue',
      votedForBy: [],
    },
  ],
};
