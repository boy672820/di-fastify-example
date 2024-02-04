type Role = 'admin' | 'user';

export default class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: Role = 'user'
  ) {}
}
