const jwt = require('jsonwebtoken');

// Use a default secret if JWT_SECRET is not in environment (NOT RECOMMENDED FOR PRODUCTION)
const jwtSecret = process.env.JWT_SECRET || 'kisanmanchdefaultsecret2024';

// Token expiry duration in days
const TOKEN_EXPIRY_DAYS = 30;

const generateToken = (id) => {
  // Calculate expiry date (30 days from now)
  const expiresIn = `${TOKEN_EXPIRY_DAYS}d`;
  const expiresAt = Date.now() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  // Generate token
  const token = jwt.sign({ id }, jwtSecret, { expiresIn });
  
  // Return both token and expiry timestamp
  return {
    token,
    expiresAt
  };
};

module.exports = generateToken;
