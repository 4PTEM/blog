import express from 'express';
import { authorRepository } from './user/repository';
import * as jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { getAuthenticationApiRouter, getProtectedAuthorApiRouter, getPublicAuthorApiRouter } from './user/apirouter';
import { getProtectedPostApiRouter, getPublicPostApiRouter } from './post/apirouter';
import { postRepository } from './post/repository';
import { getProtecteCategorydApiRouter, getPublicCategoryApiRouter } from './category/apirouter';
import { categoryRepository } from './category/repository';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.redirect('http://localhost/homepage.html');
});

app.use(express.static(path.resolve(__dirname, '../public')));

app.use('/authentication', getAuthenticationApiRouter(authorRepository));
app.use('/user/public', getPublicAuthorApiRouter(authorRepository));
app.use('/categories/public', getPublicCategoryApiRouter(categoryRepository));
app.use('/posts/public', getPublicPostApiRouter(postRepository));

app.use('/', (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) throw new Error('JWT SECRET IS NOT DEFINED');

        const jsonWebToken = req.cookies.access_token;
        jwt.verify(jsonWebToken, process.env.JWT_SECRET, (err: any, user: any) => {
            if (err) throw new Error('Authentication failed');
            req.body.user = user;
            next();
        });
    } catch (error: any) {
        res.json({ ok: false, error: error.message });
    }
});

app.use('/user/protected/', getProtectedAuthorApiRouter(authorRepository));
app.use('/categories/protected/', getProtecteCategorydApiRouter(categoryRepository));
app.use('/posts/protected/', getProtectedPostApiRouter(postRepository));

app.listen(80, () => {
    console.log('HTTP started on port 80...');
});
