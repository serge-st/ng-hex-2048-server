export const hexagonIDGenerator = () => {
  let id = 1;
  return () => id++;
};
