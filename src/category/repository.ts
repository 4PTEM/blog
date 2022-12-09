import { category } from '@prisma/client';
import prisma from '../db/pool';

export interface ICategoryRepository {
    create(name: string): Promise<category>;
    find(params: Partial<{ name: string }>): Promise<category | null>;
}

export class CategoryRepository implements ICategoryRepository {
    async create(name: string): Promise<category> {
        const category = await prisma.category.create({ data: { name } });
        return category;
    }

    async find(params: Partial<{ name: string }>): Promise<category | null> {
        const category = await prisma.category.findFirst({ where: params });
        return category;
    }
}
