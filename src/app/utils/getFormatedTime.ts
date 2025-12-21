const formateTime = (time: string) => {
  const formatedTime = new Date(`2022-01-01T${time}:00`);
  return formatedTime;
};
export default formateTime;
