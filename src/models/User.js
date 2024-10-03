// src/models/User.js
const prisma = require('../config/db');

const User = {
  createUser: async (data) => {
    return await prisma.user.create({
      data
    });
  },
  findUser: async (id) => {
    return await prisma.user.findUnique({
      where: { id }
    });
  },
};

module.exports = User;
