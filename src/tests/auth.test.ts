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
  username?: string;  
  imgUrl?:string;
};

const userInfo: UserInfo = {
  email: "ShonHason@gmail.com",
  password: "123456",
  username: "ShonHason",
  imgUrl: "ShonAvatarUrl",
};
const userLogin = {
  usernameOrEmail: "ShonHason",
  password: "123456",
};

describe("Auth tests", () => {
  test("Test 1 - Auth Registration / Double registration", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.status).toBe(201);

    // Double registration should fail

    const response2 = await request(app).post("/auth/register").send(userInfo);
    expect(response2.status).toBe(400);
    console.log("Test 1")
  });

  test("Test 2 - Auth Login - First Valid/Second Same Email", async () => {
    const response = await request(app).post("/auth/login").send(userLogin);
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
    console.log("Test 2")

  });
  test("Test 3 - Auth register - missing Data", async () => {
    const response = await request(app).post("/auth/register").send();
    expect(response.status).toBe(400);
    expect(response.text).toBe("Email and Password are required");
    console.log("Test 3")

  });

  test("Test 4 - Auth Login - Wrong Email", async () => {
    const response = await request(app).post("/auth/login").send({
      usernameOrEmail: "shon111@gmail.com",
      password: userInfo.password,
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe("Check email/username or password");
    console.log("Test 4")

  });
  test("Test 5 - Auth Login - Wrong Password", async () => {
    const response = await request(app).post("/auth/login").send({
      usernameOrEmail: userInfo.email,
      password: "1234567",
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe("Check email/username or password");
    console.log("Test 5")

  });

  test("Test 6 - make sure tokens not equals", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.body.accessToken).not.toEqual(userInfo.accessToken);
    console.log("Test 6")

  });

  test("Test 7 - Get Protected API", async () => {
    // Unauthorized request
    const response = await request(app).post("/Posts").send({
      owner: userInfo._id,
      title: "Test Title",
      content: "Test Content",
    });

    expect(response.status).not.toBe(200);

    // Authorized request
    const response2 = await request(app)
      .post("/Posts/create")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        content: "Movie Content",
        title: "Hangover",
        owner: userInfo.username,
        imgUrl: "eferwcom",
        rank: 2,
      });
    expect(response2.status).toBe(201);
    console.log("Test 7")

  });

  test("Test 8 - Get Protect API - Unvalid Token", async () => {
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
    console.log("Test 8")

  });

  const RefreshTokenTest = async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
  };
  test("Test 9 - Refresh Token", async () => {
    await RefreshTokenTest;
  });
  test("Test 9 again - Refresh Token", async () => {
    await RefreshTokenTest;
  });

  test("Test 10 - logout - invalidate refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Logged out");
    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response2.status).not.toBe(200);
    console.log("Test 10")

    
  });
  test("Test 11 - refresh token multi usage", async () => {
    //login to new acount
    const response = await request(app).post("/auth/login").send({
      usernameOrEmail: userInfo.email,
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
    console.log("Test 11")

  });
  jest.setTimeout(10000);
  test("Test 12 - Timeout", async () => {
    const response = await request(app).post("/auth/login").send({
      usernameOrEmail: userInfo.email,
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
    console.log("Test 12")

  });
  test("Test 13 - Logout not valid refresh token", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .send({
        refreshToken: userInfo.refreshToken + "1",
      });
    expect(response.status).toBe(403);
    expect(response.text).toBe("Invalid Refresh Token");
    console.log("Test 13")

  });
  test("Test 14 - Logout no refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({});
    expect(response.status).toBe(400);
    expect(response.text).toBe("Missing Refresh Token");
    console.log("Test 14")

  });

  test("Test 14 - invalid refreshtoken", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.accessToken,
    });

    expect(response.status).toBe(403);
    expect(response.text).toBe("User do not have this refresh token");
    console.log("Test 14")

  });
  test("Test15 - Auth login - missing email or password", async () => {
    const response = await request(app).post("/auth/login").send({
      password: "123456",
    });
    expect(response.status).toBe(400);
    expect(response.text).toBe("Email and Password are required");
    console.log("Test 15")

  });
  test("test 16 - problem logout", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .send({
        refreshToken: userInfo.refreshToken, // Add the refreshToken to the body
      })
      .query({ userId: "123" }); // Add query parameters using .query()

    // Add your assertions

    expect(response.status).toBe(403); // Adjust based on expected status code
    expect(response.text).toBe("User do not have this refresh token"); // Adjust based on expected response
    console.log("Test 16")

  });
  test("test 17 - refresh without refresh token", async () => {
    const response = await request(app).post("/auth/refresh").send({}); // Send an empty object
    expect(response.status).toBe(400); // Adjust based on expected status code
    expect(response.text).toBe("Missing Refresh Token"); // Adjust based on expected response
    console.log("Test 17")

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

  test("Test 18 - logout without token secret", async () => {
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
    console.log("Test 18")

  });

  test("Test 19 - upload post without secret token", async () => {
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
    console.log("Test 19")

  });
  test("Test 20 - login  without token secret", async () => {
    const originalTokenSecret = process.env.TOKEN_SECRET;

    // Temporarily remove the TOKEN_SECRET
    delete process.env.TOKEN_SECRET;
    const response = await request(app).post("/auth/login").send({
      usernameOrEmail: userInfo.email,
      password: userInfo.password,
    });
    // Restore the TOKEN_SECRET after the test
    process.env.TOKEN_SECRET = originalTokenSecret;
    expect(response.status).toBe(500);
    expect(response.text).toBe("Cannot Generate Tokens");
    console.log("Test 20")

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
  test("Test 21 - getImg", async () => {
    const response = await request(app).get(`/auth/getImg/`).query({username:userInfo.username}).set({

      Authorization: "jwt " + userInfo.accessToken,
    }).send();
    expect(response.status).toBe(200);
    expect(response.text).toBe("ShonAvatarUrl");

    const response2 = await request(app).get("/auth/getImg").query({username:"avi"}).set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send();
    expect(response2.status).toBe(404);
    expect(response2.text).toBe("Couldnt find user");
  
    const response3 = await request(app).get("/auth/getImg").set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send();
    expect(response3.status).toBe(400);
    expect(response3.text).toBe("Missing Data");

    const response4 = await request(app).get("/auth/getImg").set({
      Authorization: "jwt " + userInfo.accessToken + "1",
    }).send();
    expect(response4.status).toBe(403);
    expect(response4.text).toBe("Invalid Token");
    console.log("Test 21");
  });

   test("Test 22 - saveImg", async () => {
  const response = await request(app).post("/auth/myuser/saveImg").set({
    Authorization: "jwt " + userInfo.accessToken,
  }).send({
    file: "newUrlShonAvatarUrl",
    username: userInfo.username,
  });
  expect(response.status).toBe(200);
  expect(response.text).toBe("newUrlShonAvatarUrl");

  const response2 = await request(app).post("/auth/myuser/saveImg").set({
    Authorization: "jwt " + userInfo.accessToken,
  }).send({
    username: "avi",
    file: "newUrlShonAvatarUrl",
  });
  expect(response2.status).toBe(404);
  expect(response2.text).toBe("Couldnt find user");

  const response3 = await request(app).post("/auth/myuser/saveImg").set({
    Authorization: "jwt " + userInfo.accessToken,
  }).send({
    file: "newUrlShonAvatarUrl",
  });
  expect(response3.status).toBe(400);
  expect(response3.text).toBe("Missing Data");
  });
  test("Test 23 - updateAccount", async () => {
    const response = await request(app).put("/auth/myuser/updateAccount").set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send({
      oldUsername: userInfo.username,
      newUsername: "Jesus" 
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe("User Updated");

    const response2 = await request(app).put("/auth/myuser/updateAccount").set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send({
      oldUsername: "Jesus",
    });
    expect(response2.status).toBe(400);
    expect(response2.text).toBe("Missing Data");

    const response3 = await request(app).put("/auth/myuser/updateAccount").set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send({
      oldUsername: "Eminem",
      newUsername: "Jesus",
    });
    expect(response3.status).toBe(404);
    expect(response3.text).toBe("Couldnt find user");
  });

  test("Test 24 - changePassword", async () => {
    const response = await request(app).put("/auth/myuser/changePassword").set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send({ username: "Jesus", oldPassword: "123456", newPassword: "1234567" });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Password Changed");

    const response2 = await request(app).put("/auth/myuser/changePassword").set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send({ username: userInfo.username });
    expect(response2.status).toBe(400);
    expect(response2.text).toBe("Missing Data");

    const response3 = await request(app).put("/auth/myuser/changePassword").set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send({ username: "Jesus", oldPassword: "123", newPassword: "1234567" });
    expect(response3.status).toBe(400);
    expect(response3.text).toBe("Invalid Password");

    const response4 = await request(app).put("/auth/myuser/changePassword").set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send({ username: "Eminem", oldPassword: "1234567", newPassword: "12345678" });
    expect(response4.status).toBe(404);
    expect(response4.text).toBe("Couldnt find user");
  });

  test("Test 25 - getUser", async () => {
    const response = await request(app).get("/auth/myuser/Jesus").set({ 
      Authorization: "jwt " + userInfo.accessToken,
    });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe("Jesus");

    const response2 = await request(app).get("/auth/myuser/avi").set({
      Authorization: "jwt " + userInfo.accessToken,
    });
    expect(response2.status).toBe(404);
    expect(response2.text).toBe("Couldnt find user");

  });
  test("Test 26 - deleteAccount", async () => {

    const response = await request(app).delete("/auth/myuser/deleteAccount").query({username:"David"}).set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send();
    expect(response.status).toBe(404);
    expect(response.text).toBe("Couldnt find user");

    const response2 = await request(app).delete("/auth/myuser/deleteAccount").query({userrrname:"Jesus"}).set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send();
    expect(response2.status).toBe(400);
    expect(response2.text).toBe("Missing Data");

    const response3 = await request(app).delete("/auth/myuser/deleteAccount").query({username:"Jesus"}).set({
      Authorization: "jwt " + userInfo.accessToken,
    }).send();
    expect(response3.status).toBe(200);
    expect(response3.text).toBe("Account Deleted");
  });
});
