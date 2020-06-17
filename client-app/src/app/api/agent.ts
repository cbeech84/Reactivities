import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity'

axios.defaults.baseURL = 'http://localhost:5000/api';

//adding an interceptor, to pick up any errors, and return an appropriate error message
axios.interceptors.response.use(undefined, error => {
  if (error.response.status === 404) {
    throw error.response; //throw the error to activityStore
  }
})

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) => //this is known as currying - it transforms a function.
  new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));
//above, the sleep function takes ms as an arg and returns the axios response as a promise - currying will take the ms and complete setTimeout as part of the promise resolution, before returning the response.

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
}

const Activities = {
  list: () : Promise<IActivity[]> => requests.get('/activities'), //specify the return type in the Promise
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post('/activities', activity),
  update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`)
}

export default {
  Activities
}