const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  department: { type: String, required: true },
  position:   { type: String, required: true },
  profilePicture: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
