// src/schema/resolvers.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const Employee = require('../models/Employee');

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findById(user.id);
    },
    employees: async (_, args, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const filter = {};
      if (args.department) filter.department = args.department;
      if (args.position) filter.position = args.position;
      return await Employee.find(filter);
    },
    employee: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Employee.findById(id);
    }
  },
  Mutation: {
    signup: async (_, { username, password }) => {
      const user = new User({ username, password });
      await user.save();
      const token = jwt.sign({ id: user._id, username: user.username }, config.JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const valid = await user.comparePassword(password);
      if (!valid) {
        throw new Error("Invalid password");
      }
      const token = jwt.sign({ id: user._id, username: user.username }, config.JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },
    addEmployee: async (_, { name, department, position, profilePicture }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const employee = new Employee({ name, department, position, profilePicture });
      return await employee.save();
    },
    updateEmployee: async (_, { id, name, department, position, profilePicture }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (department !== undefined) updateData.department = department;
      if (position !== undefined) updateData.position = position;
      if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
      return await Employee.findByIdAndUpdate(id, updateData, { new: true });
    },
    deleteEmployee: async (_, { id }, { user }) => {
        if (!user) throw new Error("Not authenticated");
        return await Employee.findByIdAndDelete(id);
      }
  }
};

module.exports = resolvers;
