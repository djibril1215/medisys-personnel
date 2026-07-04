const express = require('express');
require('dotenv').config();
const personnelRoutes = require('./routes/personnelRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'MediSys Personnel Service is running' });
});

app.use('/api/personnel', personnelRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Personnel service running on port ${PORT}`);
});
