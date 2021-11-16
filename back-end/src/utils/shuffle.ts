const shuffle = <T>(arr: T[], count: number) => {
  if (arr.length < count) count = arr.length;

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(0, count);
};

export default shuffle;
