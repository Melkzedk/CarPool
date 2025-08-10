require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server started on ${PORT}`));