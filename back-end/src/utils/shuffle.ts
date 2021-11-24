const shuffle = <T>(arr: T[], count: number) => {
  const arrCopy = arr.slice(0);

  if (arrCopy.length < count) count = arrCopy.length;

  for (let i = arrCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
  }

  return arrCopy.slice(0, count);
};

export default shuffle;
