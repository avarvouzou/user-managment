import { PresentationUser, ServerUser } from "./user.interface";

export function transformServerUsers(users: ServerUser[]): PresentationUser[] {
  return users.map((u) => transformServerUser(u));
}

export function transformServerUser(user: ServerUser): PresentationUser {
  // patch avatar if coming from backend and is not from another website.
  const avatar = user.avatar.split('/')[0] === 'public' ? `http://lab.wappier.com/${user.avatar}` : user.avatar;

  return {
    ...user,
    avatar,
    age: yearsDiff(new Date(user.birthday))
  };
}

function yearsDiff(d: Date) {
  return (new Date()).getFullYear() - d.getFullYear();
}
