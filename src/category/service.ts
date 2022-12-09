import { ICategoryRepository } from './repository';

export async function createCategory(CategoryRepository: ICategoryRepository, name: string) {
    if (await CategoryRepository.find({ name })) throw new Error('Category with same name already exists');
    const category = await CategoryRepository.create(name);
    return category;
}
