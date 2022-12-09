import { Router } from 'express';
import { IAuthorRepository } from './repository';
import * as UserService from './service';

export function getPublicApiRouter(AuthorRepository: IAuthorRepository) {
    const router = Router();

    router.post('/register', async (req, res) => {
        try {
            const { username, email, password } = req.body;
            if (!username || !/^[A-z0-9_]*$/.test(username)) {
                throw new Error('Username is not valid');
            }
            if (!password || !/^[A-z0-9$!_-*@]*$/.test(password)) {
                throw new Error('Password is not valid');
            }
            if (!email || !validateEmail(email)) {
                throw new Error('Email is not valid');
            }
            const access_token = await UserService.registerNewUser(AuthorRepository, username, email, password);
            res.json({ ok: true, data: { access_token } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const { username, email, password } = req.body;
            if (!password || !/^[A-z0-9$!_-*@]*$/.test(password)) {
                throw new Error('Password is not valid');
            }
            if (!email || !validateEmail(email)) {
                throw new Error('Email is not valid');
            }
            const access_token = await UserService.authenticateUser(AuthorRepository, email, password);
            res.json({ ok: true, data: { access_token } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
        }
    });

    return router;
}

export function getProtectedApiRouter(AuthorRepository: IAuthorRepository) {
    const router = Router();

    router.get('/view/:id', async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) throw new Error('User does not exists');

            const user = await UserService.getAuthor(AuthorRepository, Number(id));
            if (!user) throw new Error('User does not exists');

            res.json({ ok: true, data: { user } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
        }
    });

    router.put('/update', async (req, res) => {
        try {
            const { id } = req.body.user;
            const { username, email, password } = req.body;

            if (!username || !/^[A-z0-9_]*$/.test(username)) {
                throw new Error('Username is not valid');
            }
            if (!password || !/^[A-z0-9$!_-*@]*$/.test(password)) {
                throw new Error('Password is not valid');
            }
            if (!email || !validateEmail(email)) {
                throw new Error('Email is not valid');
            }

            const user = await UserService.updateAuthor(AuthorRepository, id, { username, email, password });
            res.json({ ok: true, data: { user } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
        }
    });

    router.delete('/delete', async (req, res) => {
        try {
            const { id } = req.body.user;
            await UserService.deleteAuthor(AuthorRepository, id);
            res.json({ ok: true });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
        }
    });

    return router;
}
