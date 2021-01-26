import User from "../models/User";

interface UserData {
  username: string;
  password: string;
}

export const saveUser = async (userData: UserData) => {
  const user = new User({
    username: userData.username,
    password: userData.password,
  });
  return user.save();
};
