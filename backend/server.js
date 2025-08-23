const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');



// Connect to DB
connectDB();


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
