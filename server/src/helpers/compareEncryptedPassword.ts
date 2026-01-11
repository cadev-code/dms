import bcrypt from 'bcrypt';

export const compareEncryptedPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  const compare = await bcrypt.compare(password, hashPassword);
  return compare;
};
