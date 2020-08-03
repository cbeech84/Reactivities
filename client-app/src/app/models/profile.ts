export interface IProfile {
  displayName : string,
  username: string,
  bio: string,
  image: string,
  photos: IPhoto[],
  following: boolean,
  followersCount: number,
  followingsCount: number
}

export interface IPhoto {
  id: string,
  url: string,
  isMain: boolean
}