import { Router } from 'express';
import { ICategoryRepository } from './repository';
import * as CategoryService from './service';

export function getProtectedApiRouter(CategoryRepository: ICategoryRepository) {
    const router = Router();

    router.post('/create', async (req, res) => {
        try {
            const { name } = req.body;
            if (!name || !/^[A-zА-я ]*$/.test(name)) {
                throw new Error('Category name is not valid');
            }
            const category = await CategoryService.createCategory(CategoryRepository, name);
            res.json({ ok: true, data: { category } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
        }
    });

    return router;
}
