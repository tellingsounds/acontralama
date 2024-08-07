/**
 * Helper functions for working with localStorage / sessionStorage.
 */
type Storage = typeof window.localStorage | typeof window.sessionStorage;

const getFromStorageMaybe =
  (storage: Storage) =>
  <T = any>(key: string): T | null => {
    const value = storage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  };

const setStorageItem =
  (storage: Storage) =>
  (key: string, value: any): void => {
    storage.setItem(key, JSON.stringify(value));
  };

export const getFromLocalStorageMaybe = getFromStorageMaybe(
  window.localStorage,
);
export const setLocalStorageItem = setStorageItem(window.localStorage);
export const getFromSessionStorageMaybe = getFromStorageMaybe(
  window.sessionStorage,
);
export const setSessionStorageItem = setStorageItem(window.sessionStorage);
