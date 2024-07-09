import request from 'supertest';
import client from '../client';
import bcrypt from 'bcrypt';
import app from '../server';


describe('REGISTER ENDPOINT', () => {
   let testEmail;
   let testPassword;
   let accessToken;

   beforeAll(async () => {
      testEmail = `testuser_${Date.now()}@example.com`;
      testPassword = 'Test@12345';

      await client.user.deleteMany();
      await client.organisation.deleteMany();
   });

   afterAll(async () => {
      await client.$disconnect();
   });

   it('Register User Successfully with Default Organisation', async () => {
      const response = await request(app)
         .post('/auth/register')
         .send({
            firstName: 'John',
            lastName: 'Doe',
            email: testEmail,
            password: testPassword,
            phone: "1234567890",
         });

      // expect(response.status).toBe(201);
      // expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Registration successful");
      // expect(response.body.data).toHaveProperty('accessToken');
      // expect(response.body.data.user).toHaveProperty('userId');
      // expect(response.body.data.user.firstName).toBe('John');
      // expect(response.body.data.user.lastName).toBe('Doe');
      // expect(response.body.data.user.email).toBe(testEmail);
      // expect(response.body.data.user.phone).toBe('1234567890');

      accessToken = response.body.data.accessToken;

      const org = await client.organisation.findFirst({
         where: { name: "John's Organisation" },
      });

      expect(org).not.toBeNull();
      expect(org?.name).toBe("John's Organisation");
   });

   it('Should Log the user in successfully', async () => {
      const response = await request(app)
         .post('/auth/login')
         .send({
            email: testEmail,
            password: testPassword,
         });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toHaveProperty('userId');
      expect(response.body.data.user.email).toBe(testEmail);

      accessToken = response.body.data.accessToken;
   });

   it('Should Fail If Required Fields Are Missing', async () => {
      const response = await request(app)
         .post('/auth/register')
         .send({
            lastName: 'Doe',
            email: testEmail,
            password: testPassword,
         });

      expect(response.status).toBe(422);
      expect(response.body.errors).toEqual(
         expect.arrayContaining([
            expect.objectContaining({
               field: 'firstName',
               message: 'First name is required',
            }),
         ])
      );
   });

   it('Should Fail if there’s Duplicate Email or UserID', async () => {
      const response = await request(app)
         .post('/auth/register')
         .send({
            firstName: 'Jane',
            lastName: 'Doe',
            email: testEmail,
            password: testPassword,
            phone: '0987654321',
         });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('Bad request');
      expect(response.body.message).toBe('Registration unsuccessful');
   });

   it('Should Get User Info Successfully', async () => {
      const response = await request(app)
         .get(`/api/users/${testEmail}`)
         .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User retrieved successfully');
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data.email).toBe(testEmail);
   });

   it('Should Get All User Organisations Successfully', async () => {
      const response = await request(app)
         .get('/api/organisations')
         .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Organisations retrieved successfully');
      expect(response.body.data.organisations).toEqual(
         expect.arrayContaining([
            expect.objectContaining({
               name: "John's Organisation",
            }),
         ])
      );
   });

   it('Should Get Single Organisation Successfully', async () => {
      const org = await client.organisation.findFirst({
         where: { name: "John's Organisation" },
      });

      const response = await request(app)
         .get(`/api/organisations/${org?.orgId}`)
         .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Organisation retrieved successfully');
      expect(response.body.data).toHaveProperty('orgId');
      expect(response.body.data.name).toBe("John's Organisation");
   });

   it('Should Create a New Organisation Successfully', async () => {
      const response = await request(app)
         .post('/api/organisations')
         .set('Authorization', `Bearer ${accessToken}`)
         .send({
            name: 'New Organisation',
            description: 'This is a new organisation',
         });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Organisation created successfully');
      expect(response.body.data).toHaveProperty('orgId');
      expect(response.body.data.name).toBe('New Organisation');
   });

   it('Should Add a User to Organisation Successfully', async () => {
      const org = await client.organisation.findFirst({
         where: { name: 'New Organisation' },
      });

      const user = await client.user.create({
         data: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: `janesmith_${Date.now()}@example.com`,
            password: await bcrypt.hash('Password@123', 10),
            phone: '243971616131'
         },
      });

      const response = await request(app)
         .post(`/api/organisations/${org?.orgId}/users`)
         .set('Authorization', `Bearer ${accessToken}`)
         .send({
            userId: user.userId,
         });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User added to organisation successfully');
   });
});