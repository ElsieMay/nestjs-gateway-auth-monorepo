import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface LoginResult {
  access_token: string;
  user: unknown;
}

async function testLogin() {
  const client: ClientProxy = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002,
    },
  });

  await client.connect();

  console.log('Testing user login...');

  try {
    const result: LoginResult = await firstValueFrom(
      client.send('validate_user', {
        email: 'test@example.com',
        password: 'password123',
      }),
    );

    console.log('✅ Login successful!');
    console.log('Access Token:', result.access_token);
    console.log('User:', result.user);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('❌ Login failed:', error.message);
  }

  await client.close();
}

testLogin();
