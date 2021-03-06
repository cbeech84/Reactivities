import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivitiesEnvelope } from '../models/activity'
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { IProfile, IPhoto } from '../models/profile';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) => { //this ensures that the auth token is stored in browser storage and passed up to the activities screen to allow access.
  const token = window.localStorage.getItem('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => {
  return Promise.reject(error);
})

//adding an interceptor, to pick up any errors, and return an appropriate error message
axios.interceptors.response.use(undefined, error => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error - make sure API is running!');
  }
  const {status, data, config} = error.response;
  if (status === 404) {
    //throw error.response; //throw the error to activityStore //removing this in favour of dealing with all errors here, rather than in each individual location
    history.push('/notfound');
  }
  if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
    history.push('/notfound')
  }
  if (status === 500) {
    toast.error('Server error - check the terminal for more info!')
  }
  throw error.response; //catch errors in creation or editing so they can be logged to console by createActivity or editActivity in activityStore.
})

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) => //this is known as currying - it transforms a function.
  new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));
//above, the sleep function takes ms as an arg and returns the axios response as a promise - currying will take the ms and complete setTimeout as part of the promise resolution, before returning the response.

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios.post(url, formData, {
      headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody);
  }
}

const Activities = {
  // list: (limit?: number, page?: number) : Promise<IActivitiesEnvelope> => requests.get(`/activities?limit=${limit}&offset=${page ? page * limit! : 0}`), //specify the return type in the Promise
  list: (params: URLSearchParams) : Promise<IActivitiesEnvelope> => axios.get('/activities', {params : params}).then(sleep(1000)).then(responseBody),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post('/activities', activity),
  update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.del(`/activities/${id}/attend`)
}

const User = {
  current: (): Promise<IUser> => requests.get('/user'),
  login: (user: IUserFormValues) : Promise<IUser> => requests.post('/user/login', user),
  register: (user: IUserFormValues) : Promise<IUser> => requests.post('/user/register', user)
}

const Profiles = {
  get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob) : Promise<IPhoto> => requests.postForm(`/photos`, photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`),
  updateProfile: (profile : Partial<IProfile>) => requests.put(`/profiles`, profile),
  follow: (username: string) => requests.post(`/profiles/${username}/follow`, {}), 
  unfollow: (username: string) => requests.del(`/profiles/${username}/follow`),
  listFollowings: (username: string, predicate: string) => requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) => requests.get(`/profiles/${username}/activities?predicate=${predicate}`)
}

export default {
  Activities,
  User,
  Profiles
}