import bcrypt from 'bcrypt';
export const hashInfo = async (data: string) => {
  return await bcrypt.hash(data, 10);
};
