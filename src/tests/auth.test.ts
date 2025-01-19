import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import userModel from "../modules/auth_model";
import postsModel from "../modules/posts_model";
import { Express } from "express";
import jwt from "jsonwebtoken";

let app: Express;

beforeAll(async () => {
  app = await appInit.initApplication();
  await userModel.deleteMany(); // Ensure this operation is awaited
  await postsModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the database connection asynchronously
});

type UserInfo = {
  email: string;
  password: string;
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
};

const userInfo: UserInfo = {
  email: "ShonHason@gmail.com",
  password: "123456",
};

describe("Auth tests", () => {
  test("Test 1 - Auth Registration / Double registration", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    console.log(response.body);

    expect(response.status).toBe(201);

    // Double registration should fail
    const response2 = await request(app).post("/auth/register").send(userInfo);
    console.log(response2.body);
    expect(response2.status).toBe(400);
  });

  test("Test 2 - Auth Login - First Valid/Second Same Email", async () => {
    const response = await request(app).post("/auth/login").send(userInfo);

    expect(response.status).toBe(200);

    const token = response.body.accessToken;
    expect(token).toBeDefined();

    const userId = response.body._id;
    expect(userId).toBeDefined();
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(userId).toBeDefined();
    // Update the user info with returned values
    userInfo._id = userId;
    userInfo.accessToken = accessToken;
    userInfo.refreshToken = refreshToken;

    console.log(userInfo);
  });
  test("Test 2 - Auth register - missing email or password", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "  ",
      password: "123456",
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe("Email and Password are required");
  });

  test("Test 3 - Auth Login - Wrong Email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "shon111@gmail.com",
      password: userInfo.password,
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe("Check your email or password");
  });
  test("Test 4 - Auth Login - Wrong Password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: "1234567",
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe("Check your email or password");
  });

  test("make sure tokens not equals", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    console.log("new token : " + response.body.accessToken);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("old token : " + userInfo.accessToken);
    expect(response.body.accessToken).not.toEqual(userInfo.accessToken);
  });

  test("Test 3 - Get Protected API", async () => {
    // Unauthorized request
    const response = await request(app).post("/Posts").send({
      owner: userInfo._id,
      title: "Test Title",
      content: "Test Content",
    });

    expect(response.status).not.toBe(200);

    // Authorized request
    const response2 = await request(app)
      .post("/Posts")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        content: "Test Content",
        title: "Test Title",
        owner: userInfo._id,
      });
    console.log(
      "*****************************************************************"
    );
    console.log(response2.body);
    expect(response2.status).toBe(201);
  });

  test("Test 4 - Get Protect API - Unvalid Token", async () => {
    const response = await request(app)
      .post("/Posts")
      .set({
        Authorization: "jwt " + userInfo.accessToken + "1",
      })
      .send({
        content: "Test Content",
        title: "Test Title",
        owner: "unvalid owner",
      });
    expect(response.status).not.toBe(201);
  });

  const RefreshTokenTest = async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
  };
  test("Test 5 - Refresh Token", async () => {
    await RefreshTokenTest;
  });
  test("Test 5 again - Refresh Token", async () => {
    await RefreshTokenTest;
  });

  test("Test 6 - logout - invalidate refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Logged out");
    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    console.log(response2.body);
    expect(response2.status).not.toBe(200);
  });
  test("Test 7 - refresh token multi usage", async () => {
    //login to new acount
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.status).toBe(200);
    userInfo.refreshToken = response.body.refreshToken;
    userInfo.accessToken = response.body.accessToken;
    //refresh token, and get new refresh token
    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    const newRefreshToken = response2.body.refreshToken;
    //use the old refresh token second time - delete the new one also, action should fail
    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response3.status).not.toBe(200);
    //use the new refresh token, action should fail
    const response4 = await request(app).post("/auth/refresh").send({
      refreshToken: newRefreshToken,
    });
    expect(response4.status).not.toBe(200);
  });
  jest.setTimeout(10000);
  test("Test 8 - Timeout", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.status).toBe(200);
    userInfo.refreshToken = response.body.refreshToken;
    userInfo.accessToken = response.body.accessToken;
    await new Promise((r) => setTimeout(r, 5000));

    const response2 = await request(app)
      .post("/Posts")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        owner: "invalid owner",
        title: " invalid Test Title",
        content: " invalid Test Content",
      });
    expect(response2.status).not.toBe(200);
    console.log(response2.statusCode);
  });
  test("Test 9 - Logout not valid refresh token", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .send({
        refreshToken: userInfo.refreshToken + "1",
      });
    expect(response.status).toBe(403);
    expect(response.text).toBe("Invalid Refresh Token");
  });
  test("Test 10 - Logout no refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({});
    expect(response.status).toBe(400);
    expect(response.text).toBe("Missing Refresh Token");
  });

  test("Test 11 - invalid refreshtoken", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.accessToken,
    });

    expect(response.status).toBe(403);
    expect(response.text).toBe("User do not have this refresh token");
  });
  test("test2.5 - Auth login - missing email or password", async () => {
    const response = await request(app).post("/auth/login").send({
      password: "123456",
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe("Email and Password are required");
  });
  test("test 12 - problem logout", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .send({
        refreshToken: userInfo.refreshToken, // Add the refreshToken to the body
      })
      .query({ userId: "123" }); // Add query parameters using .query()

    // Add your assertions

    expect(response.status).toBe(403); // Adjust based on expected status code
    expect(response.text).toBe("User do not have this refresh token"); // Adjust based on expected response
  });
  test("test 13 - refresh without refresh token", async () => {
    const response = await request(app).post("/auth/refresh").send({}); // Send an empty object
    expect(response.status).toBe(400); // Adjust based on expected status code
    expect(response.text).toBe("Missing Refresh Token"); // Adjust based on expected response
  });

  test("Should return 500 if TOKEN_SECRET is missing", async () => {
    const originalEnv = process.env.TOKEN_SECRET; // Save the original value

    // Temporarily remove TOKEN_SECRET
    delete process.env.TOKEN_SECRET;

    const response = await request(app)
      .post("/auth/refresh") // Replace with your actual endpoint
      .send({
        refreshToken: "dummy_refresh_token", // Any token value
      });

    // Restore TOKEN_SECRET after the test
    process.env.TOKEN_SECRET = originalEnv;

    expect(response.status).toBe(500);
    expect(response.text).toBe("Missing Token Secret");
  });

  test("Test 14 - logout without token secret", async () => {
    const originalEnv = process.env.TOKEN_SECRET; // Save the original value

    // Temporarily remove TOKEN_SECRET
    delete process.env.TOKEN_SECRET;

    const response = await request(app)
      .post("/auth/logout") // Replace with your actual endpoint
      .send({
        refreshToken: userInfo.refreshToken, // Any token value
      });

    // Restore TOKEN_SECRET after the test
    process.env.TOKEN_SECRET = originalEnv;

    expect(response.status).toBe(500);
    expect(response.text).toBe("Missing Token Secret");
  });

  test("Test 15 - upload post without secret token", async () => {
    const originalEnv = process.env.TOKEN_SECRET; // Save the original value

    // Temporarily remove TOKEN_SECRET
    delete process.env.TOKEN_SECRET;

    const response = await request(app)
      .post("/Posts")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        content: "Test15 Content",
        title: "Test15 Title",
        owner: userInfo._id,
      });
    // Restore TOKEN_SECRET after the test
    process.env.TOKEN_SECRET = originalEnv;

    expect(response.status).toBe(500);
    expect(response.text).toBe("Missing Token Secret");
  });
  test("Test 16 - login  without token secret", async () => {
    const originalTokenSecret = process.env.TOKEN_SECRET;

    // Temporarily remove the TOKEN_SECRET
    delete process.env.TOKEN_SECRET;
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    // Restore the TOKEN_SECRET after the test
    process.env.TOKEN_SECRET = originalTokenSecret;
    expect(response.status).toBe(500);
    expect(response.text).toBe("Cannot Generate Tokens");
  });

  test("Logout end point", async () => {
    const mockFindById = jest
      .spyOn(userModel, "findById")
      .mockResolvedValueOnce(null);

    // Generate a valid refresh token
    const validRefreshToken = jwt.sign(
      { _id: "nonexistentUserId" },
      process.env.TOKEN_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    // Send request to logout endpoint
    const response = await request(app).post("/auth/logout").send({
      refreshToken: validRefreshToken,
    });

    // Assertions
    expect(response.status).toBe(404);
    expect(response.text).toBe("Invalid Refresh Token11");

    // Restore the mocked method
    mockFindById.mockRestore();
  });

  // i need a test for this :   res.status(400).send("Email and Password are required");
  test("Test 17 - Auth register - missing email or password", async () => {
    const response = await request(app).post("/auth/register").send({
      password: "123456", //
    });
    expect(response.status).toBe(400);
  });
});
