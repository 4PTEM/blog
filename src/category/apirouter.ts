import { Router } from 'express';
import { ICategoryRepository } from './repository';
import * as CategoryService from './service';

export function getPublicCategoryApiRouter(CategoryRepository: ICategoryRepository) {
    const router = Router();

    router.get('/list', async (req, res) => {
        try {
            const categories = await CategoryService.listCategories(CategoryRepository);
            res.json({ ok: true, data: { categories } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
            console.log(error.message);
        }
    });

    router.get('/get/:id', async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) throw new Error('User does not exists');
            const category = await CategoryService.getCategory(CategoryRepository, Number(id));
            res.json({ ok: true, data: { category } });
        } catch (error: any) {
            res.json({ ok: false, error: error.message });
            console.log(error.message);
        }
    });

    return router;
}

export function getProtecteCategorydApiRouter(CategoryRepository: ICategoryRepository) {
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
            console.log(error.message);
        }
    });

    return router;
}
