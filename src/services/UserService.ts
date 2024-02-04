import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
import type IUserRepository from './repositories/IUserRepository';

export default class UserService {
  private readonly userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    const users = await this.userRepository.findMany();
    return users;
  }

  async getUser(id: string) {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async create(user: UserEntity) {
    user.id = this.userRepository.generateId();
    const newUser = await this.userRepository.create(user);
    return newUser;
  }

  async update(user: UserEntity) {
    const updatedUser = await this.userRepository.update(user);
    return updatedUser;
  }
}
