import { UserEntity } from '../entities';
import users from '../mock/users';
import type IUserRepository from '../services/repositories/IUserRepository';

type UserProperties = {
  id: string;
  name: string;
  email: string;
};

export default class UserRepository implements IUserRepository {
  async findMany(): Promise<UserEntity[]> {
    return users.reduce<UserEntity[]>(
      (acc, user) => [...acc, this.toEntity(user)],
      []
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  async create(user: UserEntity): Promise<UserEntity> {
    users.push({ ...this.toProps(user), role: 'user' });
    return user;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const index = users.findIndex((u) => u.id === user.id);

    if (index === -1) {
      throw new Error('User not found');
    }

    users[index] = { ...this.toProps(user), role: users[index].role };
    return user;
  }

  generateId = (): string => users.length + 1 + '';

  private toEntity = (user: UserProperties): UserEntity =>
    new UserEntity(user.id, user.name, user.email);

  private toProps = (user: UserEntity): UserProperties => ({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}
