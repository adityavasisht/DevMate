import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevMate API',
      version: '1.0.0',
      description: 'AI-powered developer and job matching platform API',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-here' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['DEVELOPER', 'COMPANY'] },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Aditya Vasisht' },
            bio: { type: 'string', example: 'Full stack developer from Bangalore' },
            skills: {
              type: 'array',
              items: { type: 'string' },
              example: ['Node.js', 'React', 'TypeScript'],
            },
            experience: { type: 'number', example: 1 },
            github: { type: 'string', example: 'https://github.com/username' },
            portfolio: { type: 'string', example: 'https://myportfolio.com' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string', example: 'Backend Developer' },
            description: { type: 'string', example: 'Looking for a Node.js developer' },
            skills: {
              type: 'array',
              items: { type: 'string' },
              example: ['Node.js', 'TypeScript', 'PostgreSQL'],
            },
            salary: { type: 'string', example: '40000-60000' },
            location: { type: 'string', example: 'Bangalore' },
          },
        },
        Match: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            score: { type: 'number', example: 0.85 },
            reasoning: {
              type: 'string',
              example: 'Strong match due to overlapping skills in Node.js and TypeScript',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
      },
    },
  },
  // Where to find JSDoc comments — scans all route files
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)