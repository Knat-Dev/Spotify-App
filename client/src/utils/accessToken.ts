export const getAccessToken = () => {
  return sessionStorage.getItem('sid');
};

export const setAccessToken = (accessToken: string): void => {
  sessionStorage.setItem('sid', accessToken);
};
