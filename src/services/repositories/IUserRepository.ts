import { UserEntity } from '../../entities';

export default interface IUserRepository {
  findMany(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  generateId(): string;
}
