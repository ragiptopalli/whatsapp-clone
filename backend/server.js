const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const __dirnameDir = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirnameDir, '/client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirnameDir, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running');
  });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(
  port,
  console.log(`Server started on port:  ${port}`.yellow.underline.bold)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMsgRecieved) => {
    let chat = newMsgRecieved.chat;

    if (!chat.users) return console.log('Chat users are not defined!');

    chat.users.forEach((usr) => {
      if (usr._id === newMsgRecieved.sender._id) return;

      socket.in(usr._id).emit('message recieved', newMsgRecieved);
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
