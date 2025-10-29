const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const { sequelize } = require('./models');

dotenv.config();
connectDB();

sequelize.sync({ alter: true })
  .then(() => console.log('Database synced successfully'))
  .catch(err => console.error('Error syncing database:', err));

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('SmartTheru backend running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
