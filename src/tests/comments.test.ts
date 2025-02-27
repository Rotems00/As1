import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import commentModel from "../modules/comments_model";
import { Express } from "express";
import userModel from "../modules/auth_model";
import postsModel from "../modules/posts_model";
let app: Express;

const testComment = {
  owner: "Test Owner",
  comment: "Test Content",
  postId: "",
};
let commentID = "";
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
beforeAll(async () => {
  app = await appInit.initApplication();
  await commentModel.deleteMany();
  await userModel.deleteMany();
  await postsModel.deleteMany();

  await request(app).post("/auth/register").send(userInfo);
  const response = await request(app).post("/auth/login").send(userInfo);
  userInfo._id = response.body._id;
  userInfo.accessToken = response.body.accessToken;
  userInfo.refreshToken = response.body.refreshToken;
  await request(app)
    .post("/Posts")
    .set({ Authorization: "jwt " + userInfo.accessToken })
    .send({ title: "Test Post", content: "Test Content" });
  testComment.postId = response.body._id;
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
    const response = await request(app)
      .post("/Comments")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send(testComment);
    expect(response.status).toBe(201);
    expect(response.body.owner).toBe(testComment.owner);
    expect(response.body.comment).toBe(testComment.comment);
    expect(response.body.postId).toBe(testComment.postId);
    commentID = response.body._id;
    const response2 = await request(app)
      .post("/Comments")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        owner: "Test 2 Owner",
        comment: "comment 2 Content",
        postId: testComment.postId,
      });
    expect(response2.status).toBe(201);
  });
  test("Test 3- GET ALL COMMENTS-FULL", async () => {
    const response = await request(app).get("/Comments");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
  test("GET /comments on specific postId", async () => {
    const response = await request(app)
      .get("/Comments")
      .query({ postId: testComment.postId });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
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
    expect(response.body).toHaveLength(2);
  });

  test("Test 6 - CHANGE A COMMENT", async () => {
    const response = await request(app)
      .put(`/Comments/${commentID}`)
      .set("Authorization", "jwt " + userInfo.accessToken)
      .send({ comment: "Pizza is the best" });

    expect(response.status).toBe(200);

    expect(response.body.comment).toBe("Pizza is the best");
  });

  test("Test 7 - DELETE A COMMENT", async () => {
    const response = await request(app)
      .delete(`/Comments/${commentID}`)
      .set("Authorization", "jwt " + userInfo.accessToken); // תיקון השימוש ב-set
    expect(response.status).toBe(200);
  });

  test("Test 8 - FAILURE TO CREATE A COMMENT", async () => {
    const response = await request(app)
      .post("/Comments")
      .set("Authorization", "jwt " + userInfo.accessToken)
      .send({});
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
    const response = await request(app)
      .delete(`/Comments/12345`)
      .set("Authorization", "jwt " + userInfo.accessToken);
    expect(response.status).not.toBe(200);
  });

  test("Test 12 - FAILURE TO UPDATE A COMMENT", async () => {
    const response = await request(app).put(`/Comments/12345`);
    expect(response.status).not.toBe(200);
  });

  test("Test 13- FAIULRE TO CREATE A COMMENT", async () => {
    const mockcreate = jest.spyOn(commentModel, "create").mockResolvedValue([]);
    const response = await request(app)
      .put(`/Comments/12345`)
      .set("Authorization", "jwt " + userInfo.accessToken)
      .send({});

    expect(response.status).toBe(400);

    // Restore the mocked method
    mockcreate.mockRestore();
  });

  test("Test 14 - FAILURE WHEN NO ITEMS FOUND WITH OWNER FILTER", async () => {
    const response = await request(app).get("/Comments/?owner=SOMEOWNERID");

    expect(response.status).toBe(404);
    expect(response.text).toBe("There are no items with this owner");
  });

  test("Test 18 - SUCCESS WHEN COMMENTS FOUND FOR OWNER FILTER", async () => {
    const mockFind = jest.spyOn(commentModel, "find").mockResolvedValueOnce([
      {
        _id: "123",
        owner: "SOMEOWNERID",
        content: "This is a comment from owner 1",
      },
      {
        _id: "124",
        owner: "SOMEOWNERID",
        content: "This is another comment from owner 1",
      },
    ]);

    const response = await request(app).get("/Comments/?owner=SOMEOWNERID");

    // Check if the response is successful (200 OK) and contains the mocked comments
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        _id: "123",
        owner: "SOMEOWNERID",
        content: "This is a comment from owner 1",
      },
      {
        _id: "124",
        owner: "SOMEOWNERID",
        content: "This is another comment from owner 1",
      },
    ]);
  });

  test("Test 19 - FAILURE WHEN DB ERROR OCCURS", async () => {
    const mockFind = jest
      .spyOn(commentModel, "find")
      .mockRejectedValue(new Error("Database connection error"));

    const response = await request(app).get("/Comments");

    expect(response.status).toBe(400);
  });
});
