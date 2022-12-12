import { categoryRepository, ICategoryRepository } from './repository';

export async function createCategory(CategoryRepository: ICategoryRepository, name: string) {
    if (await CategoryRepository.find({ name })) throw new Error('Category with same name already exists');
    const category = await CategoryRepository.create(name);
    return category;
}

export async function listCategories(CategoryRepository: ICategoryRepository) {
    const categories = await CategoryRepository.list();
    return categories;
}

export async function getCategory(CategoryRepository: ICategoryRepository, id: number) {
    const category = await CategoryRepository.get(id);
    return category;
}
