import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
}

async function testRegister() {
  const client: ClientProxy = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002,
    },
  });

  await client.connect();

  console.log('Testing user registration...');

  try {
    const result = (await client
      .send<RegisterResponse>('register', {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      })
      .toPromise()) as RegisterResponse;

    console.log('✅ Registration successful!');
    console.log('User:', result.user);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('❌ Registration failed:', error.message);
  }

  await client.close();
}

testRegister();
