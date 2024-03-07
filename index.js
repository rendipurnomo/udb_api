const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const userRoute = require('./src/routes/user.route.js');
const productRoute = require('./src/routes/product.route.js');
const transactionRoute = require('./src/routes/transaction.route.js');
const bannerRoute = require('./src/routes/banner.route.js');
const authRoute = require('./src/routes/auth.route.js');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(fileUpload());
app.use(cors());

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: "auto" }
}))

app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/transactions', transactionRoute);
app.use('/banners', bannerRoute);
app.use('/auth', authRoute);

app.get('/', (req, res) => {
  res.json({ author: 'Rendi', message: 'Server is up and running' });
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log('Server is running on port ' + port + '!');
});