import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Posts API
export const postsAPI = {
  getAll: () => API.get('/posts'),
  getById: (id) => API.get(`/posts/${id}`),
  create: (postData) => API.post('/posts', postData),
  update: (id, postData) => API.put(`/posts/${id}`, postData),
  delete: (id) => API.delete(`/posts/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => API.get('/categories'),
  create: (categoryData) => API.post('/categories', categoryData),
};

export default API;
