import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import userRoute from './src/routes/user.route.js';
import productRoute from './src/routes/product.route.js';
import transactionRoute from './src/routes/transaction.route.js';
import bannerRoute from './src/routes/banner.route.js';
import authRoute from './src/routes/auth.route.js';

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