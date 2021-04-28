import axios from 'axios';
import SyncStorage from 'sync-storage';
const FILES_URL = 'http://localhost:80/';

const moviesApi = axios.create({
  baseURL: 'http://localhost:5000/',
});

const servicesApi = axios.create({
  baseURL: 'http://localhost:5001/',
});

const commentsApi = axios.create({
  baseURL: 'http://localhost:5002/',
});

const likesApi = axios.create({
  baseURL: 'http://localhost:5003/',
});

export const getMovies = async page => {
  const response = await moviesApi.get(`movies/${page}`);
  return response.data;
};

export const getMovie = async movie_id => {
  const response = await moviesApi.get(`movie/${movie_id}`);
  return response.data;
};

export const getMoviesByName = async (movie_name, page) => {
  const response = await moviesApi.get(`movies_name/${movie_name}/${page}`);
  return response.data;
};

export const getMoviesByService = async (service_id, page) => {
  const response = await moviesApi.get(`movies_service/${service_id}/${page}`);
  return response.data;
};

export const getServices = async () => {
  const response = await servicesApi.get(`streaming_services`);
  return response.data;
};

export const getComments = async (movie_id, page) => {
  const response = await commentsApi.get(`comments/${movie_id}/${page}`);
  return response.data;
};

export const getAddComment = async (movie_id, comment) => {
  let promisse = null;

  const user = SyncStorage.get('user');
  if (user) {
    const response = await commentsApi.get(
      `comments/add/${movie_id}/${user.name}/${user.account}/${comment}`,
    );
    promisse = response.data;
  }

  return promisse;
};

export const getRemoveComments = async comment_id => {
  const response = await commentsApi.get(`comments/remove/${comment_id}`);
  return response.data;
};

export const getUserLiked = async movie_id => {
  let promisse = null;

  const user = SyncStorage.get('user');
  if (user) {
    const response = await likesApi.get(`liked/${user.account}/${movie_id}`);
    promisse = response.data;
  }

  return promisse;
};

export const getUserLike = async movie_id => {
  let promisse = null;

  const user = SyncStorage.get('user');
  if (user) {
    const response = await likesApi.get(`like/${user.account}/${movie_id}`);
    promisse = response.data;
  }

  return promisse;
};

export const getUserUnlike = async movie_id => {
  let promisse = null;

  const user = SyncStorage.get('user');
  if (user) {
    const response = await likesApi.get(`unlike/${user.account}/${movie_id}`);
    promisse = response.data;
  }

  return promisse;
};

export const getImageService = service_name => {
  return {uri: FILES_URL + 'services/' + service_name};
};

export const getSlideMovie = (id, numberImg) => {
  return {uri: FILES_URL + 'movies/' + id + '/slide' + numberImg + '.jpg'};
};

export const getSkinMovie = id => {
  return {uri: FILES_URL + 'movies/' + id + '/capa.jpg'};
};

export const moviesAlive = async () => {
  const response = await moviesApi.get(`isalive`);
  return response.data;
};

export const commentsAlive = async () => {
  const response = await commentsApi.get(`isalive`);
  return response.data;
};

export const likesAlive = async () => {
  const response = await likesApi.get(`isalive`);
  return response.data;
};

export const servicesAlive = async () => {
  const response = await servicesApi.get(`isalive`);
  return response.data;
};
