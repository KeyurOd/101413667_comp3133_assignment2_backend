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

app.use(cors({
  origin: 'https://one01413667-comp3133-assignment2-frontend.onrender.com',
  credentials: true
}));
app.use(express.json());
app.use(verifyToken);

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }
}).single('profilePicture');

app.post('/upload', (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    // Use the deployed backend URL in production, otherwise localhost
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://one01413667-comp3133-assignment2-backend.onrender.com'
      : `http://localhost:${config.PORT}`;
    const filePath = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ filePath });
  });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cache: "bounded",
    context: ({ req }) => ({ user: req.user }),
    introspection: true,
    playground: true,
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

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