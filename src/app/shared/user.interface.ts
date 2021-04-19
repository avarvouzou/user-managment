export interface App {
  _id: string;
  name: string;
  avatar: string;
}

export interface ServerUser {
  _id: string;
  avatar: string;
  name: string;
  birthday: string;
  country: string;
  apps: App[];
  appsCount: number;
}

export interface PresentationUser {
  _id: string;
  avatar: string;
  name: string;
  birthday: string;
  age: number;
  country: string;
  apps: App[];
  appsCount: number;
}

