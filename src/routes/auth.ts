import { FastifyPluginAsync } from 'fastify';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import Container from 'typedi';

const auth: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  const userService = Container.get(UserService);
  const authService = Container.get(AuthService);

  fastify.post<{
    Body: {
      email: string;
      password: string;
    };
  }>('/auth/login', async function (request, reply) {
    const { email, password } = request.body;

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const isPasswordValid = await authService.verifyPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return reply.status(401).send({ error: 'Invalid password' });
    }

    const token = authService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { token };
  });
};

export default auth;
