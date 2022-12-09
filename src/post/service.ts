import { IPostRepository } from './repository';

export async function createPost(PostRepository: IPostRepository, author_id: number, category_id: number, title: string, content: string, date_of_publication?: Date) {
    const post = await PostRepository.create(author_id, category_id, title, content, date_of_publication);
    return post;
}

export async function getPost(PostRepository: IPostRepository, id: number) {
    const post = await PostRepository.get(id);
    if (!post) throw new Error('Post does not exists');
    return post;
}

export async function listPosts(PostRepository: IPostRepository, params: Partial<{ author_id: number; category_id: number }>, limit = 100, offset = 0) {
    const posts = PostRepository.list(params, limit, offset);
    return posts;
}

export async function updatePost(PostRepository: IPostRepository, id: number, params: Partial<{ category_id: number; title: string; content: string }>) {
    if (!(await PostRepository.get(id))) throw new Error('Post does not exists');
    const post = await PostRepository.update(id, params);
    return post;
}

export async function deletePost(PostRepository: IPostRepository, id: number) {
    if (!(await PostRepository.get(id))) throw new Error('Post does not exists');
    await PostRepository.delete(id);
}
