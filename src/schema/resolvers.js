const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const Employee = require('../models/Employee');
const fs = require('fs');
const path = require('path');

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
    signup: async (_, { name, email, password }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error("Email already registered");

      const user = new User({ name, email, password });
      await user.save();

      const token = jwt.sign({ id: user._id, email: user.email }, config.JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },

    login: async (_, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
      
        const valid = await user.comparePassword(password);
        if (!valid) throw new Error("Invalid password");
      
        const token = jwt.sign({ id: user._id, email: user.email }, config.JWT_SECRET, { expiresIn: '1d' });
        return { token, user };
    },
      

    addEmployee: async (_, { firstName, lastName, department, position, profilePicture }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const employee = new Employee({ firstName, lastName, department, position, profilePicture });
      return await employee.save();
    },

    updateEmployee: async (_, { id, firstName, lastName, department, position, profilePicture }, { user }) => {
      const employee = await Employee.findById(id);
      if (!employee) throw new Error("Employee not found");

      if (profilePicture && employee.profilePicture && profilePicture !== employee.profilePicture) {
        const oldPath = path.join(__dirname, '../../uploads', path.basename(employee.profilePicture));
        fs.unlink(oldPath, err => {
          if (err) console.error("Failed to delete old profile picture:", err);
        });
      }

      employee.firstName = firstName || employee.firstName;
      employee.lastName = lastName || employee.lastName;
      employee.department = department || employee.department;
      employee.position = position || employee.position;
      employee.profilePicture = profilePicture || employee.profilePicture;

      await employee.save();
      return employee;
    },

    deleteEmployee: async (_, { id }) => {
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error("Employee not found");
      }

      if (employee.profilePicture) {
        const imagePath = path.join(__dirname, '../../uploads', path.basename(employee.profilePicture));
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete profile picture:", err.message);
          } else {
            console.log("Deleted profile picture:", imagePath);
          }
        });
      }

      await Employee.findByIdAndDelete(id);

      return {
        success: true,
        message: `Employee ${id} deleted successfully.`
      };
    }
  }
};

module.exports = resolvers;
