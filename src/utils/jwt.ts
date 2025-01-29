import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'defaultsecret'; // Use environment variable

// Function to generate JWT
export const generateToken = (userId: string) => {
return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '30d' });
};

// Function to verify JWT
export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
