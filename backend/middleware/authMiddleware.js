import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to protect routes: verifies the JWT and attaches user info (id, role) to the request.
 * @param {string[]} requiredRoles - Array of roles allowed to access this route (e.g., ['doctor']).
 */
const protect = (requiredRoles = []) => async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (remove "Bearer " from the string)
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using the secret key
      const decoded = jwt.verify(token, JWT_SECRET);

      // 3. Attach user data (id, role) to the request object
      req.user = decoded; 

      // 4. Check Role Permissions
      if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient role permissions.' });
      }

      next(); // Proceed to the next step
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

export { protect };