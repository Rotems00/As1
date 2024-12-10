import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import postModel from "../modules/posts_model";
import { Express } from "express";

let app: Express;
const testPost = {
  title: "Test Post",
  content: "Test Content",
  owner: "Test Owner",
};
let postID = "";

beforeAll(async () => {
  app = await appInit.initApplication();
  await postModel.deleteMany();
});

afterAll(() => {
  mongoose.connection.close();
});

describe("Posts tests", () => {
  test("Test 1 - GET ALL POSTS-EMPTY", async () => {
    const response = await request(app).get("/Posts");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test 2 - CREATE A POST", async () => {
    const response = await request(app).post("/Posts").send(testPost);
    expect(response.status).toBe(201);
    expect(response.body.owner).toBe(testPost.owner);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
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
    const response = await request(app).get(`/Posts/?owner=${testPost.owner}`);
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

  test("Test 7 - FAILURE TO CREATE A POST", async () => {
    const response = await request(app)
      .post("/Posts")
      .send({ author: "Test Author" });
    expect(response.status).toBe(400);
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
