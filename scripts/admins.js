// Simple in-memory admin database (replace with real database in production)
const admins = [
  {
    id: 1,
    username: "admin-account",
    email: "admin-account@patrioticinvestors.com",
    password: "admin123456", // In production, use hashed passwords
    role: "account-manager",
    createdAt: new Date(),
  },
  {
    id: 2,
    username: "admin-customerservice",
    email: "admin-customerservice@patrioticinvestors.com",
    password: "admin123456",
    role: "customer-service",
    createdAt: new Date(),
  },
  {
    id: 3,
    username: "admin-executives",
    email: "admin-executives@patrioticinvestors.com",
    password: "admin123456",
    role: "executive",
    createdAt: new Date(),
  },
];

module.exports = admins;
