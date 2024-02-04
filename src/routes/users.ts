import { FastifyPluginAsync } from 'fastify';
import UserService from '../services/UserService';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';

const users: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  const userService = new UserService(new UserRepository());

  fastify.get('/users', async function (_request, _reply) {
    const entities = await userService.getUsers();
    const users = entities.map((entity) => ({
      ...entity,
      password: undefined,
    }));

    return { users };
  });

  fastify.get<{ Params: { id: string } }>(
    '/users/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async function (request, reply) {
      const entity = await userService.getUser(request.params.id);

      if (!entity) {
        return reply.status(404).send({ error: 'User not found' });
      }

      const user = { ...entity, password: undefined };
      return { user };
    }
  );

  fastify.post<{
    Body: {
      name: string;
      email: string;
      password: string;
    };
  }>(
    '/users',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
          },
        },
      },
    },
    async function (request, _reply) {
      const userEntity = new UserEntity(
        '',
        request.body.name,
        request.body.email,
        request.body.password
      );
      const user = await userService.create(userEntity);

      (user as any).password = undefined;
      return { user };
    }
  );

  fastify.patch<{
    Body: { name?: string; email?: string };
    Params: { id: string };
  }>(
    '/users/:id',
    {
      schema: {
        body: {
          type: 'object',
          properties: { name: { type: 'string' }, email: { type: 'string' } },
        },
        params: { type: 'object', properties: { id: { type: 'string' } } },
      },
    },
    async function (request, reply) {
      const user = await userService.getUser(request.params.id);

      if (!user) {
        return reply.status(422).send({ error: 'Unprocessable Entity' });
      }

      user.name = request.body.name || user.name;
      user.email = request.body.email || user.email;

      const updatedUser = await userService.update(user);

      (updatedUser as any).password = undefined;
      return { user: updatedUser };
    }
  );
};

export default users;
