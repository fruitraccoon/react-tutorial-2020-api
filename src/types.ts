export interface Poll {
  id: string;
  text: string;
  imageUri?: string;
  allowMultiple: boolean;
  dateCreated: string;
  createdBy: User;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  text: string;
  imageUri?: string;
  votedForBy: User[];
}

export interface User {
  id: string;
  displayName: string;
  avatarUri: string;
}
