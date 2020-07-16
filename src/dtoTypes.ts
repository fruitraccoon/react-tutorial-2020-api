export interface PollDto {
  id: string;
  text: string;
  imageUri?: string;
  allowMultiple: boolean;
  dateCreated: string;
  createdBy: UserDto;
  options: PollOptionDto[];
}

export interface PollOptionDto {
  id: string;
  text: string;
  imageUri?: string;
  voteCount: number;
  votedForByUser: boolean;
}

export interface UserDto {
  displayName: string;
  avatarUri: string;
}

export interface CreatePollDto {
  allowMultiple: boolean;
  imageUri?: string;
  text: string;
  options: CreatePollOptionDto[];
}

export interface CreatePollOptionDto {
  imageUri?: string;
  text: string;
}

export interface PollVotesDto {
  id: string;
  voteCount: number;
  votedForByUser: boolean;
}
