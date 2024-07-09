const app = require('../server');
const request = require('supertest');


describe('POST /auth/register', function () {
   it('should register successfully with default organisation', async function () {
      const resp = await request(app)
         .post('/auth/register')
         .send({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password123",
         });
      expect(resp.statusCode).toEqual(201); // Expecting 200 for success
      expect(resp.body).toHaveProperty("status", "success");
      expect(resp.body).toHaveProperty("message", "Registration successful");
      expect(resp.body).toHaveProperty("data");
      expect(resp.body.data).toHaveProperty("accessToken");
      expect(resp.body.data).toHaveProperty("user");
      expect(resp.body.data.user).toHaveProperty("firstName", "John");
      expect(resp.body.data.user).toHaveProperty("lastName", "Doe");
      expect(resp.body.data.user).toHaveProperty("email", "john.doe@example.com");
      expect(resp.body.data.user).toHaveProperty("phone", null);
   });
});