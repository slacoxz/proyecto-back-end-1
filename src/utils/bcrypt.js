import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
