import express from 'express';
import { getProtectedApiRouter, getPublicApiRouter } from './user/apirouter';
import { authorRepository } from './user/repository';
import * as jwt from 'jsonwebtoken';

const app = express();

app.use('/authentication', getPublicApiRouter(authorRepository));

app.use('/', (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) throw new Error('JWT SECRET IS NOT DEFINED');

        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) throw new Error('Authentication failed');

        const jsonWebToken = authorizationHeader.split(' ')[1];
        jwt.verify(jsonWebToken, process.env.JWT_SECRET, (err, user) => {
            if(err) throw new Error('Authentication failed');
            req.body.user = user;
            next();
        });
    } catch (error: any) {
        res.json({ ok: false, error: error.message });
    }
});

app.use('/user', getProtectedApiRouter(authorRepository));
