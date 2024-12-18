import 'dotenv/config';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';

import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

import User from './models/userModel.js';
import { authenticateUser } from './controller/auth.js';
import { secretKey } from './config/secret.js';

// __dirname을 ES Module에서 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://accounts.google.com");
    next();
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.post('/login/user', async (req, res) => {
    console.log("POST: /login/user");
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const { authId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: authId,
            audience: process.env.CLIENT_ID
        });
        const { name, email, picture } = ticket.getPayload();
        const loginToken = jwt.sign(`${email}`, secretKey);

        const updateResult = await User.findOneAndUpdate(
            { email },
            { name, picture },
            { upsert: true, new: true }
        );

        console.log('updateResult: ', updateResult);

        res.status(200)
            .cookie('login', loginToken, { maxAge: 360000 })
            .send({ success: true });
    } catch (e) {
        console.log("error: POST: /login/user", e);
        res.status(500).send({ error: e });
    }
});

app.get('/user/authenticated/getAll', authenticateUser, async (req, res) => {
    try {
        const data = await User.find({});
        res.status(200).send({ users: data });
    } catch (e) {
        res.status(500).send({ error: e });
    }
});

app.get('/logout/user', async (req, res) => {
    try {
        res.clearCookie('login', { path: '/' })
            .send({ 'success': true });
    } catch (e) {
        res.status(500).send({ error: e });
    }
});

app.get('/user/checkLoginStatus', async (req, res) => {
    console.log(`GET: /user/checkLoginStatus`);
    const idToken = req.cookies['login'];

    if (!idToken) {
        console.log("loginStatus set to false - no idToken");
        return res.status(200).send({ 'success': false });
    }

    try {
        const decodedMessage = jwt.verify(idToken, secretKey);
        const user = await User.findOne({ email: decodedMessage });

        if (user) {
            console.log("loginStatus set to true - user found");
            res.status(200).send({ 'success': true });
        } else {
            console.log("loginStatus set to false - user not found");
            res.status(200).send({ 'success': false });
        }
    } catch (e) {
        console.log("error@getStatus: ", e);
        res.status(200).send({ 'success': false });
    }
});

app.listen(9191, () => {
    console.log('Server is running on port 9191');
});