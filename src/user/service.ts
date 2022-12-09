import { IAuthorRepository } from './repository';
import * as jwt from 'jsonwebtoken';

export async function registerNewUser(AuthorRepository: IAuthorRepository, username: string, email: string, password: string) {
    if (await AuthorRepository.find({ email })) throw new Error('User with same email is already registered');
    const user = await AuthorRepository.create(username, email, password);

    if (!process.env.JWT_SECRET) throw new Error('JWT SECRET IS NOT DEFINDE');

    jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET);
}

export async function authenticateUser(AuthorRepository: IAuthorRepository, email: string, password: string) {
    const user = await AuthorRepository.find({ email, password });
    if (!user) throw new Error('Wrong email / password');

    if (!process.env.JWT_SECRET) throw new Error('JWT SECRET IS NOT DEFINED');

    jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET);
}

export async function getAuthor(AuthorRepository: IAuthorRepository, id: number) {
    return await AuthorRepository.get(id);
}

export async function updateAuthor(AuthorRepository: IAuthorRepository, id: number, params: Partial<{ username: string; email: string; password: string }>) {
    const { email } = params;
    if (!await AuthorRepository.get(id)) throw new Error('User does not exists');
    if (await AuthorRepository.find({ email })) throw new Error('User with same email is already registered');
    return await AuthorRepository.update(id, params);
}

export async function deleteAuthor(AuthorRepository: IAuthorRepository, id: number) {
    return await AuthorRepository.delete(id);
}
