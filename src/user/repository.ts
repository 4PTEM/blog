import { author } from '@prisma/client';
import prisma from '../db/pool';

export interface IAuthorRepository {
    create(username: string, email: string, password: string): Promise<author>;
    get(id: number): Promise<author | null>;
    find(params: Partial<{ username: string; email: string; password: string }>): Promise<author | null>;
    update(id: number, params: Partial<{ username: string; email: string; password: string }>): Promise<author>;
    delete(id: number): Promise<void>;
}

class AuthorRepository implements IAuthorRepository {
    async create(username: string, email: string, password: string): Promise<author> {
        const author = await prisma.author.create({ data: { username, email, password } });
        return author;
    }

    async get(id: number): Promise<author | null> {
        const author = await prisma.author.findUnique({ where: { id } });
        return author;
    }

    async find(params: Partial<{ username: string; email: string; password: string }>): Promise<author | null> {
        const author = await prisma.author.findFirst({ where: params });
        return author;
    }

    async update(id: number, params: Partial<{ username: string; email: string; password: string }>): Promise<author> {
        const author = await prisma.author.update({ where: { id }, data: params });
        return author;
    }

    async delete(id: number): Promise<void> {
        await prisma.author.delete({ where: { id } });
    }
}

export const authorRepository = new AuthorRepository();