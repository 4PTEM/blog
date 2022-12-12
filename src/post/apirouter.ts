import { Router } from 'express';
import { IPostRepository } from './repository';
import * as PostService from './service';

export function getPublicPostApiRouter(PostRepository: IPostRepository) {
    const router = Router();

    router.get('/get/:id', async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (!id || isNaN(id)) {
                throw new Error('Post does not exists');
            }

            const post = await PostService.getPost(PostRepository, id);
            res.json({ ok: true, data: { post } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
            console.log(error.message);
        }
    });

    router.get('/list', async (req, res) => {
        try {
            let limit = Number(req.query.limit) || undefined;
            let offset = Number(req.query.offset) || undefined;
            let author_id = Number(req.query.author_id) || undefined;
            let category_id = Number(req.query.category_id) || undefined;

            const posts = await PostService.listPosts(PostRepository, { author_id, category_id }, limit, offset);
            res.json({ ok: true, data: { posts } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
            console.log(error.message);
        }
    });

    return router;
}

export function getProtectedPostApiRouter(PostRepository: IPostRepository) {
    const router = Router();

    router.post('/create', async (req, res) => {
        try {
            const { id: author_id } = req.body.user;
            const { category_id, title, content } = req.body;
            if (!category_id || isNaN(category_id)) {
                throw new Error('Category is not valid');
            }
            if (!title || !/^[A-zА-я \-_0-9]*$/.test(title)) {
                throw new Error('Title is not valid');
            }
            if (!content) {
                throw new Error('Content is not valid');
            }
            const post = await PostService.createPost(PostRepository, author_id, category_id, title, content);
            res.json({ ok: true, data: { post } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
            console.log(error.message);
        }
    });

    router.put('/edit', async (req, res) => {
        try {
            const { id, category_id, title, content } = req.body;
            if (!id || isNaN(id)) {
                throw new Error('Post does not exists');
            }
            if (!category_id || isNaN(category_id)) {
                throw new Error('Category is not valid');
            }
            if (!title || !/^[A-zА-я \-_0-9]*$/.test(title)) {
                throw new Error('Title is not valid');
            }
            if (!content) {
                throw new Error('Content is not valid');
            }

            const post = await PostService.updatePost(PostRepository, id, { category_id, title, content });
            res.json({ ok: true, data: { post } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
            console.log(error.message);
        }
    });

    router.delete('/get/:id', async (req, res) => {
        try {
            const { id } = req.body;
            if (!id || isNaN(id)) {
                throw new Error('Post does not exists');
            }

            await PostService.deletePost(PostRepository, id);
            res.json({ ok: true });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
            console.log(error.message);
        }
    });

    return router;
}
