export const sortObjectArrayByProperty = (arr, prop) => {
  return arr.sort((a, b) =>
    a[prop] > b[prop] ? 1 : b[prop] > a[prop] ? -1 : 0
  );
};
