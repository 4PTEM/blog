import { IAuthorRepository } from './repository';
import * as jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

export async function registerNewUser(AuthorRepository: IAuthorRepository, username: string, email: string, password: string) {
    if (await AuthorRepository.find({ email })) throw new Error('User with same email is already registered');
    password = createHash('sha256').update(password).digest('hex');
    const user = await AuthorRepository.create(username, email, password);

    if (!process.env.JWT_SECRET) throw new Error('JWT SECRET IS NOT DEFINDE');

    return jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET);
}

export async function authenticateUser(AuthorRepository: IAuthorRepository, email: string, password: string) {
    password = createHash('sha256').update(password).digest('hex');
    const user = await AuthorRepository.find({ email, password });
    if (!user) throw new Error('Wrong email / password');

    if (!process.env.JWT_SECRET) throw new Error('JWT SECRET IS NOT DEFINED');

    return jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET);
}

export async function getAuthor(AuthorRepository: IAuthorRepository, id: number) {
    return await AuthorRepository.get(id);
}

export async function updateAuthor(AuthorRepository: IAuthorRepository, id: number, params: Partial<{ username: string; email: string; password: string }>) {
    const { email } = params;
    if (!(await AuthorRepository.get(id))) throw new Error('User does not exists');
    if ((await AuthorRepository.find({ email }))?.id != id) throw new Error('User with same email is already registered');
    if (params.password) params.password = createHash('sha256').update(params.password).digest('hex');
    const user = await AuthorRepository.update(id, params);

    if (!process.env.JWT_SECRET) throw new Error('JWT SECRET IS NOT DEFINED');

    return jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET);
}

export async function deleteAuthor(AuthorRepository: IAuthorRepository, id: number) {
    return await AuthorRepository.delete(id);
}

let params: Record<string, any> = {};
