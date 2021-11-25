const timer = async (time: number) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
};

export default timer;
