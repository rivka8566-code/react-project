import axios from "axios";
import type { Product } from "../models/Product";
import type { User } from "../models/User";
import type { Review } from "../models/Review";

const BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
});


export const getProducts = async (page: number) => {
  const response = await api.get(`/products?_page=${page}&_limit=20`);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export const getProductsByName = async (name: string, page: number = 1) => {
  const response = await api.get(`/products?name_like=${encodeURIComponent(name)}&_page=${page}&_limit=20`);
  return response.data;
};

export const getProductsByCategory = async (category: string, page: number = 1) => {
  const response = await api.get(`/products?_page=${page}&_limit=20&category=${category}`);
  return response.data;
};

export const createProduct = async (productData: Omit<Product, 'id'>) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.get(`/users?email=${email}&password=${password}`);
  if (response.data.length === 0) {
    throw new Error('Invalid email or password');
  }
  return response.data[0];
};

export const signUp = async (userData: Omit<User, 'id'>) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, userData: User) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const getReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

export const getReviewsByProductId = async (productId: string) => {
  const response = await api.get(`/reviews?productId=${productId}`);
  return response.data;
};

export const createReview = async (reviewData: Review) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const deleteReview = async (reviewId: number) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};