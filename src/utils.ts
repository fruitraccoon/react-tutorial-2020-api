import {
    NextFunction,
    Request,
    Response,
    response
    } from 'express';
import https from 'https';
import { User } from './types';

interface IAccessTokenDecoded {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp?: string;
  scope: string;
}

interface IIdTokenDecoded {
  sub: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
}

function isDecodedAccessTokenPresent(
  value: any
): value is { decodedAccessToken: IAccessTokenDecoded } {
  return !!value.decodedAccessToken;
}

function getUserDetails(req: Request): Promise<IIdTokenDecoded | undefined> {
  return new Promise<IIdTokenDecoded>((res, rej) => {
    if (isDecodedAccessTokenPresent(req) && req.headers.authorization) {
      try {
        const authorization = req.headers.authorization;
        https
          .get(
            `${req.decodedAccessToken.iss}userinfo`,
            { headers: { authorization } },
            (result) => {
              if (!result.statusCode || result.statusCode >= 400) {
                rej(result);
              }
              let body = '';
              result.on('data', (chunk) => {
                body += chunk;
              });
              result.on('end', () => {
                res(JSON.parse(body));
              });
            }
          )
          .on('error', (error) => {
            rej(error);
          });
      } catch (e) {
        rej(e);
      }
    } else {
      res(undefined);
    }
  });
}

async function getSignedInUser(req: Request): Promise<User | undefined> {
  const userDetail = await getUserDetails(req);
  if (!userDetail) return undefined;
  return {
    id: userDetail.sub,
    displayName: userDetail.name,
    avatarUri: userDetail.picture,
  };
}

export async function provideUser<TRequest extends Request>(
  action: (user: User | undefined) => void | Promise<void>,
  req: TRequest,
  next: NextFunction
) {
  try {
    const user = await getSignedInUser(req);
    return action(user);
  } catch (e) {
    next(e);
  }
}

export async function provideUserStrict<TRequest extends Request>(
  action: (user: User) => void | Promise<void>,
  req: TRequest,
  next: NextFunction
) {
  return provideUser(
    (user) => {
      if (!user) {
        throw new Error('Signed in User not found');
      }
      return action(user);
    },
    req,
    next
  );
}

export function nowAsString() {
  return new Date().toISOString();
}
