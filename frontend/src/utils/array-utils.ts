export const removeDuplicates = <T>(array?: T[]) => {
  return (
    array?.filter((item, index) => array.indexOf(item) === index) ?? []
  ).filter(
    item => item != null && (typeof item !== 'string' || item.trim() !== '')
  );
};
