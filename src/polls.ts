import {
  NextFunction,
  Request,
  Response,
  response
  } from 'express';
import { v4 as uuid } from 'uuid';
import { defaultPoll1, defaultPoll2, systemUser } from './defaults';
import { CreatePollDto, PollDto, PollVotesDto } from './dtoTypes';
import { Poll, User } from './types';
import { nowAsString, provideUser, provideUserStrict } from './utils';

const pollsDb: Poll[] = [defaultPoll1, defaultPoll2];

function toPollDto(poll: Poll, currentUserId: string | undefined): PollDto {
  return {
    ...poll,
    options: poll.options.map((o) => {
      const { votedForBy, ...rest } = o;
      return {
        ...rest,
        voteCount: votedForBy.length,
        votedForByUser: votedForBy.some((u) => u.id === currentUserId),
      };
    }),
  };
}

export async function getPolls(req: Request, res: Response<PollDto[]>, next: NextFunction) {
  provideUser(
    (user) => {
      res.json(pollsDb.map((p) => toPollDto(p, user?.id)));
    },
    req,
    next
  );
}

export async function createPoll(
  req: Request<{}, string, CreatePollDto>,
  res: Response<string>,
  next: NextFunction
) {
  provideUserStrict(
    (user) => {
      const dto = req.body;

      if (!dto?.text) {
        res.status(400).send('Poll text is required');
      }
      if (!dto?.options || dto.options.length < 2) {
        res.status(400).send('At least 2 options are required');
        return;
      }

      const poll: Poll = {
        ...dto,
        id: uuid(),
        dateCreated: nowAsString(),
        createdBy: user,
        options: dto.options.map((o) => ({
          ...o,
          id: uuid(),
          votedForBy: [],
        })),
      };

      pollsDb.push(poll);
      res.status(201).json(poll.id);
    },
    req,
    next
  );
}

export async function getPoll(
  req: Request<{ id: string }, PollDto>,
  res: Response<PollDto>,
  next: NextFunction
) {
  provideUser(
    (user) => {
      const poll = pollsDb.find((p) => p.id === req.params.id);
      if (!poll) {
        res.status(404);
        return;
      }
      res.json(toPollDto(poll, user?.id));
    },
    req,
    next
  );
}

