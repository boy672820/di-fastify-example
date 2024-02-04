import { FastifyPluginAsync } from 'fastify';
import UserService from '../services/UserService';
import { UserEntity } from '../entities';

const users: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/users', async function (_request, _reply) {
    const userService = new UserService();
    const users = await userService.getUsers();

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
      const userService = new UserService();
      const user = await userService.getUser(request.params.id);

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return { user };
    }
  );

  fastify.post<{
    Body: {
      name: string;
      email: string;
    };
  }>(
    '/users',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
    async function (request, _reply) {
      const userService = new UserService();
      const userEntity = new UserEntity(
        '',
        request.body.name,
        request.body.email
      );
      const user = await userService.create(userEntity);

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
      const userService = new UserService();
      const user = await userService.getUser(request.params.id);

      if (!user) {
        return reply.status(422).send({ error: 'Unprocessable Entity' });
      }

      user.name = request.body.name || user.name;
      user.email = request.body.email || user.email;

      const updatedUser = await userService.update(user);

      return { user: updatedUser };
    }
  );
};

export default users;
