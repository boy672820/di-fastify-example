type Role = 'admin' | 'user';

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@gmail.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@gmail.com',
    role: 'user',
  },
  {
    id: '3',
    name: 'James Smith',
    email: 'james@gmail.com',
    role: 'user',
  },
  {
    id: '4',
    name: 'Jessica Smith',
    email: 'jessica@gmail.com',
    role: 'user',
  },
  {
    id: '5',
    name: 'James Smith',
    email: 'james@gmail.com',
    role: 'user',
  }
];

export default users;