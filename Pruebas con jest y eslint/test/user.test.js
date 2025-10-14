const request = require('supertest');
const app = require('../src/app');

describe('User API', () => {
    test('GET /api/users should return an empty list initially', 
        async () => {
            const res = await request(app).get('/api/users');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
    });

    test('POST /api/users should create a new user', async () => {
        const newUser = { name: 'Luis', email: 'luis@ejemplo.com' };
        const res = await request(app)
            .post('/api/users')
            .send(newUser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Luis');
    });

    test('POST /api/users should fail if data is incomplete', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ name: 'Carlos' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Name and email are required');
    });

    test('GET /api/unknown should return 404 for unknown route', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Route not found');
    });
});
