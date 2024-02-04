import IUserRepository from './repositories/IUserRepository';

type Claim = {
  id: string;
  email: string;
  role: string;
};

export default class AuthService {
  constructor(private readonly _userRepository: IUserRepository) {}

  verifyPassword(password: string, userPassword: string) {
    return password === userPassword;
  }

  // base64 encoded string
  sign = (claim: Claim) =>
    Buffer.from(
      JSON.stringify({
        ...claim,
        sub: claim.id,
        iss: 'di-fastify@example.com',
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      })
    ).toString('base64');
}
