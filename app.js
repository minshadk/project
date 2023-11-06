const express = require('express')
const cors = require('cors')

const app = express()

const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const commentRoutes = require('./routes/commentRoutes')

// middleware
// Passing data through body
// app.use(cors());
app.use(
  cors({
    origin: 'https://projects-frontend-beta.vercel.app', // Allow requests from this origin
  }),
)
app.use(express.json())

// app.use((req, res, next) => {
//   console.log(req.path, req.method,
//     req.body,
//     // req.headers
//     );
//   next();
// });

//Routes
app.use('/api/user', userRoutes)
app.use('/api/project', projectRoutes)
app.use('/api/comment', commentRoutes)

module.exports = app
