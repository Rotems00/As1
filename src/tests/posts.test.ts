import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import postsModel from "../modules/posts_model";
import { Express } from "express";
import userModel from "../modules/auth_model";

let app: Express;

beforeAll(async () => {
  app = await appInit.initApplication();
  await postsModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(userInfo);
  const response = await request(app).post("/auth/login").send(userInfo);
  userInfo._id = response.body._id;
  userInfo.accessToken = response.body.accessToken;
  userInfo.refreshToken = response.body.refreshToken;
});

afterAll(() => {
  mongoose.connection.close();
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

let postID = "";

describe("Posts tests", () => {
  test("Test 1 - GET ALL POSTS-EMPTY", async () => {
    const response = await request(app).get("/Posts");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test 2 - CREATE A POST", async () => {
    console.log("**********Test2*********");
    const response = await request(app)
      .post("/Posts")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        content: "Test 2 Content",
        title: "Test 2 Title",
        owner: userInfo._id,
      });

    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test 2 Title");
    expect(response.body.content).toBe("Test 2 Content");
    postID = response.body._id;
  });

  test("Test 3- GET ALL POSTS-FULL", async () => {
    const response = await request(app).get("/Posts");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test 4 - GET A POST BY ID", async () => {
    const response = await request(app).get("/Posts/" + postID);
    expect(response.status).toBe(200);
  });

  test("Test 5 - GET A POST BY POST OWNER", async () => {
    const response = await request(app).get("/Posts/?owner=" + userInfo._id);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test 6 - CHANGE A POST", async () => {
    const response = await request(app)
      .put("/Posts/" + postID)
      .send({ content: "New Content" });

    expect(response.status).toBe(200);
    expect(response.body.content).toBe("New Content");
  });

  test("Test 7 -  FAILURE CREATE A POST", async () => {
    const response = await request(app)
      .post("/Posts")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send({ title: "Test Post" });

    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.text).toBe("Missing Data");
  });

  test("Test 8 - FAILURE TO GET A POST BY ID", async () => {
    const response = await request(app).get("/Posts/123");
    expect(response.status).toBe(400);
  });
  test("Test 9 - FAILURE TO GET A POST BY ID", async () => {
    const nonValidIDinMyDB = new mongoose.Types.ObjectId();
    const response = await request(app).get("/Posts/" + nonValidIDinMyDB);
    expect(response.status).toBe(404);
  });

  test("Test 10 - FAILURE TO GET A POST BY POST owner", async () => {
    const owner = "NonExistingOwner";
    const response = await request(app).get(`/Posts/?author=${owner}`);
    expect(response.status).toBe(200);
  });
});

export const sharedVar = postID;
