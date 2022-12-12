import { category } from '@prisma/client';
import prisma from '../db/pool';

export interface ICategoryRepository {
    create(name: string): Promise<category>;
    get(id: number): Promise<category | null>;
    find(params: Partial<{ name: string }>): Promise<category | null>;
    list(): Promise<category[]>;
}

export class CategoryRepository implements ICategoryRepository {
    async create(name: string): Promise<category> {
        const category = await prisma.category.create({ data: { name } });
        return category;
    }

    async get(id: number): Promise<category | null> {
        const category = await prisma.category.findUnique({ where: { id } });
        return category;
    }

    async find(params: Partial<{ name: string }>): Promise<category | null> {
        const category = await prisma.category.findFirst({ where: params });
        return category;
    }

    async list(): Promise<category[]> {
        const categories = await prisma.category.findMany();
        return categories;
    }
}

export const categoryRepository = new CategoryRepository();
