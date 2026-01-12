import { axiosClient } from '@/lib/axiosClient';
import { AxiosError } from 'axios';

export const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const { data } = await axiosClient.get<T>(url);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && !error.status) {
      console.error('Fetching error', {
        message: error.message,
      });
    }
    throw error;
  }
};

export const poster = async <T, B = unknown>(
  url: string,
  body?: B,
): Promise<T> => {
  // B para el tipado opcional del body
  try {
    const { data } = await axiosClient.post<T>(url, body);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && !error.status) {
      console.error('Posting error', {
        message: error.message,
      });
    }
    throw error;
  }
};

export const putter = async <T, B = unknown>(
  url: string,
  body?: B,
): Promise<T> => {
  try {
    const { data } = await axiosClient.put<T>(url, body);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && !error.status) {
      console.error('Putting error', {
        message: error.message,
      });
    }
    throw error;
  }
};

export const deleter = async <T>(url: string): Promise<T> => {
  try {
    const { data } = await axiosClient.delete<T>(url);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && !error.status) {
      console.error('Deleting error', {
        message: error.message,
      });
    }
    throw error;
  }
};
