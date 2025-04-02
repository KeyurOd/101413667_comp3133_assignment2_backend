// src/index.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const config = require('./config');
const { verifyToken } = require('./middleware/auth');

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to verify JWT token and attach user to request
app.use(verifyToken);

// Configure file uploads with multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } // 1MB limit
}).single('profilePicture');

// REST endpoint for file uploads
app.post('/upload', (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    // Return the path of the uploaded file so that the frontend can use it.
    res.json({ filePath: `/uploads/${req.file.filename}` });
  });
});

// Serve static files from the uploads folder
app.use('/uploads', express.static('uploads'));

// Set up Apollo Server and attach middleware
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: req.user })
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Connect to MongoDB
  mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(config.PORT, () =>
        console.log(`Server ready at http://localhost:${config.PORT}${server.graphqlPath}`)
      );
    })
    .catch(err => console.error('Error connecting to MongoDB', err));
}

startServer();
