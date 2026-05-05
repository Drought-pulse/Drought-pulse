import { User, DroughtData, Alert } from '../types';
import { MOCK_DROUGHT_DATA } from '../constants';

const STORAGE_KEYS = {
  USERS: 'drought_pulse_users',
  CURRENT_USER: 'drought_pulse_current_user',
  DATASETS: 'drought_pulse_datasets',
  ALERTS: 'drought_pulse_alerts',
};

export const getStoredUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User) => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex > -1) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getStoredDatasets = (): DroughtData[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DATASETS);
  return data ? JSON.parse(data) : MOCK_DROUGHT_DATA;
};

export const saveDataset = (dataset: DroughtData[]) => {
  localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(dataset));
};

export const getStoredAlerts = (): Alert[] => {
  const alerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
  return alerts ? JSON.parse(alerts) : [];
};

export const saveAlerts = (alerts: Alert[]) => {
  localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
};
