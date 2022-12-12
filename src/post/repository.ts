import { author, category, post } from '@prisma/client';
import prisma from '../db/pool';

export interface IPostRepository {
    create(author_id: number, category_id: number, title: string, content: string, date_of_publication?: Date): Promise<post>;
    get(id: number): Promise<{
        title: string;
        content: string;
        date_of_publication: Date;
        author: author;
        category: category;
        id: number;
    } | null>;
    list(params: Partial<{ author_id: number; category_id: number }>, limit: number, offset: number): Promise<post[]>;
    update(id: number, params: Partial<{ category_id: number; title: string; content: string }>): Promise<post>;
    delete(id: number): Promise<void>;
}

export class PostRepository implements IPostRepository {
    async create(author_id: number, category_id: number, title: string, content: string, date_of_publication?: Date | undefined): Promise<post> {
        const post = await prisma.post.create({ data: { author_id, category_id, title, content, date_of_publication: date_of_publication || new Date() } });
        return post;
    }

    async get(id: number): Promise<{ title: string; content: string; date_of_publication: Date; author: author; category: category; id: number } | null> {
        const post = await prisma.post.findUnique({ select: { id: true, author: true, category: true, title: true, content: true, date_of_publication: true }, where: { id } });
        return post;
    }

    async list(params: Partial<{ author_id: number; category_id: number }>, limit: number, offset: number): Promise<post[]> {
        const posts = await prisma.post.findMany({ where: params, take: limit, skip: offset });
        return posts;
    }

    async update(id: number, params: Partial<{ category_id: number; title: string; content: string }>): Promise<post> {
        const post = await prisma.post.update({ data: params, where: { id } });
        return post;
    }

    async delete(id: number): Promise<void> {
        await prisma.post.delete({ where: { id } });
    }
}

export const postRepository = new PostRepository();
