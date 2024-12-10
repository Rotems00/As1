import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import commentModel from "../modules/comments_model";
import { Express } from "express";

let app: Express;
const testComment = {
  owner: "Test Owner",
  comment: "Test Content",
  postId: "67583fec5bba10810c83789c",
};
let commentID = "";

beforeAll(async () => {
  app = await appInit.initApplication();
  await commentModel.deleteMany();
});

afterAll(() => {
  mongoose.connection.close();
});

describe("comments tests", () => {
  test("Test 1 - GET ALL COMMENTS-EMPTY", async () => {
    const response = await request(app).get("/Comments");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
  test("Test 2 - CREATE A COMMENT", async () => {
    const response = await request(app).post("/Comments").send(testComment);
    console.log(testComment);

    expect(response.status).toBe(201);
    expect(response.body.owner).toBe(testComment.owner);
    expect(response.body.comment).toBe(testComment.comment);
    expect(response.body.postId).toBe(testComment.postId);
    commentID = response.body._id;
  });
  test("Test 3- GET ALL COMMENTS-FULL", async () => {
    const response = await request(app).get("/Comments");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test 4 - GET A COMMENT BY ID", async () => {
    const response = await request(app).get(`/Comments/${commentID}`);
    expect(response.status).toBe(200);
  });

  test("Test 5 - GET A COMMENT BY POST ID", async () => {
    const response = await request(app).get(
      `/Comments/?post_id=${testComment.postId}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Test 6 - CHANGE A COMMENT", async () => {
    const response = await request(app)
      .put(`/Comments/${commentID}`)
      .send({ comment: "New Content" });
    expect(response.status).toBe(200);
    expect(response.body.comment).toBe("New Content");
  });

  test("Test 7 - DELETE A COMMENT", async () => {
    const response = await request(app).delete(`/Comments/${commentID}`);
    expect(response.status).toBe(200);
  });
  test("Test 8 - FAILURE TO CREATE A COMMENT", async () => {
    const response = await request(app).post("/Comments").send({});
    expect(response.status).toBe(400);
  });
  test("Test 9 - FAILURE TO GET A COMMENT BY ID", async () => {
    const response = await request(app).get(`/Comments/12345`);
    expect(response.status).not.toBe(200);
  });
  test("Test 10 - FAILURE TO GET A COMMENT BY POST ID", async () => {
    const response = await request(app).get("/Comments/?postId=12345");
    expect(response.status).not.toBe(200);
  });
  test("Test 11 - FAILURE TO DELETE A COMMENT", async () => {
    const response = await request(app).delete(`/Comments/12345`);
    expect(response.status).not.toBe(200);
  });
  test("Test 12 - FAILURE TO UPDATE A COMMENT", async () => {
    const response = await request(app).put(`/Comments/12345`);
    expect(response.status).not.toBe(200);
  });
});
