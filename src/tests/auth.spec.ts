import request from "supertest";
import app from '../server';



describe("POST /auth/register", () => {
  it("should register user successfully with default organisation", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201); // Expecting 200 for success
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("message", "Registration successful");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data.user).toHaveProperty("firstName", "John");
    expect(res.body.data.user).toHaveProperty("lastName", "Doe");
    expect(res.body.data.user).toHaveProperty("email", "john.doe@example.com");
    expect(res.body.data.user).toHaveProperty("phone", null); // Adjust as per actual structure
  });

  it("should log the user in successfully", async () => {
    // Register a user first
    await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    // Then attempt login
    const loginRes = await request(app).post("/auth/login").send({
      email: "jane.doe@example.com",
      password: "password123",
    });

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty("status", "success");
    expect(loginRes.body).toHaveProperty("message", "Login successful");
    expect(loginRes.body).toHaveProperty("data");
    expect(loginRes.body.data).toHaveProperty("accessToken");
    expect(loginRes.body.data).toHaveProperty("user");
    expect(loginRes.body.data.user).toHaveProperty("firstName", "Jane");
    expect(loginRes.body.data.user).toHaveProperty("lastName", "Doe");
    expect(loginRes.body.data.user).toHaveProperty(
      "email",
      "jane.doe@example.com"
    );
    expect(loginRes.body.data.user).toHaveProperty("phone", null); // Adjust as per actual structure
  });
  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      // Missing 'email' intentionally to trigger error
    });

    expect(res.statusCode).toEqual(422); // Adjusted to 422 for missing fields
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0]).toHaveProperty("field", "email");
    expect(res.body.errors[0]).toHaveProperty("message", "Email is required");
  });

  it("should fail if there is a duplicate email", async () => {
    // Register a user with the same email first
    await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    // Attempt to register the same email again
    const duplicateRes = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Smith",
      email: "jane.doe@example.com", // This email should already exist
      password: "anotherPassword",
    });

    expect(duplicateRes.statusCode).toEqual(400); // Expecting 400 for duplicate email
    expect(duplicateRes.body).toHaveProperty("status", "error");
    expect(duplicateRes.body).toHaveProperty("message", "Email already exists");
  });
});