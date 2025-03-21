export type TUserProfile = {
  id: string;
  username: string;
  email: string;
  roles: string[];
};

export type TCreateNoteInputs = {
  title: string;
  content: string;
  //   tags?: (string | undefined)[];
};

export type TNote = {
  _id: string;
  title: string;
  content: string;
  // tags: string[];
  owner: TUserProfile;
  createdAt: string;
  updatedAt: string;
};
