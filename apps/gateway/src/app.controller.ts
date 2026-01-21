import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html')
  @ApiOperation({ summary: 'API root endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns API landing page',
  })
  getRoot() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NestJS Gateway Auth API</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5rem;
        }
        .status {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.875rem;
            margin-bottom: 30px;
        }
        .section {
            margin: 30px 0;
        }
        .section h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        .endpoint {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 10px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }
        .method {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 0.75rem;
            margin-right: 10px;
        }
        .post { background: #10b981; color: white; }
        .get { background: #3b82f6; color: white; }
        .patch { background: #f59e0b; color: white; }
        .delete { background: #ef4444; color: white; }
        .badge {
            display: inline-block;
            background: #fbbf24;
            color: #78350f;
            padding: 2px 8px;
            border-radius: 5px;
            font-size: 0.75rem;
            margin-left: 10px;
        }
        .docs-link {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .docs-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .footer {
            text-align: center;
            color: #6b7280;
            margin-top: 40px;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>NestJS Gateway Auth API</h1>
        <span class="status">✓ Running</span>

        <div class="section">
            <a href="/api" class="docs-link">View Interactive API Documentation</a>
        </div>

        <div class="section">
            <h2>Authentication</h2>
            <div class="endpoint">
                <span class="method post">POST</span>
                <span>/auth/register</span>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span>
                <span>/auth/login</span>
            </div>
            <div class="endpoint">
                <span class="method get">GET</span>
                <span>/auth/profile</span>
                <span class="badge">Protected</span>
            </div>
        </div>

        <div class="section">
            <h2>User Management</h2>
            <div class="endpoint">
                <span class="method get">GET</span>
                <span>/users</span>
                <span class="badge">Admin</span>
            </div>
            <div class="endpoint">
                <span class="method get">GET</span>
                <span>/users/:id</span>
            </div>
            <div class="endpoint">
                <span class="method patch">PATCH</span>
                <span>/users/:id</span>
            </div>
            <div class="endpoint">
                <span class="method patch">PATCH</span>
                <span>/users/:id/password</span>
            </div>
            <div class="endpoint">
                <span class="method delete">DELETE</span>
                <span>/users/:id</span>
                <span class="badge">Admin</span>
            </div>
        </div>

        <div class="section">
            <h2>Profile</h2>
            <div class="endpoint">
                <span class="method get">GET</span>
                <span>/profile</span>
                <span class="badge">Protected</span>
            </div>
            <div class="endpoint">
                <span class="method get">GET</span>
                <span>/profile/admin</span>
                <span class="badge">Admin</span>
            </div>
        </div>

        <div class="section">
            <h2>Health</h2>
            <div class="endpoint">
                <span class="method get">GET</span>
                <span>/health</span>
            </div>
        </div>

        <div class="footer">
            Made with ❤️ and ⚡ by Elsie Lawrie
        </div>
    </div>
</body>
</html>
    `;
  }
}
