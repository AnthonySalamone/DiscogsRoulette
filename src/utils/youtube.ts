const getYouTubeVideoId = (url: string | undefined): string | undefined => {
  return url?.split('v=')[1]?.split('&')[0];
};

export { getYouTubeVideoId };
