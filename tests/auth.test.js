const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // assuming server.js exports the Express app
const User = require('../models/User');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase(); // clear test data
    await mongoose.connection.close();
});

describe('User Registration and Login', () => {

    // Test for User Registration
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('msg', 'User registered successfully');
    });

    // Test for Duplicate Registration
    it('should fail to register with an existing email', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser2',
                email: 'testuser@example.com', // duplicate email
                password: 'password123'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'User already exists');
    });

    // Test for User Login
    it('should log in a registered user successfully', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    // Test for Login with Incorrect Password
    it('should fail to log in with incorrect password', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });

    // Test for Login with Nonexistent User
    it('should fail to log in with a non-registered email', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });
});
