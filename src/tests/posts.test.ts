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
  const response = await request(app).post("/auth/login").send(userLogin);
  userInfo._id = response.body._id;
  userInfo.accessToken = response.body.accessToken;
  userInfo.refreshToken = response.body.refreshToken;
  userInfo.username = response.body.username;
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
  username?: string;
};
const userLogin = {
  usernameOrEmail: "ShonHason",
  password: "123456",
};
const userInfo: UserInfo = {
  email: "ShonHason@gmail.com",
  password: "123456",
  username: "ShonHason",
};
const post = {
  title: "Test Post",
  content: "Test Content",
  owner: userInfo.username,
  rank : 3,
  imgUrl:'PostImgUrl',
}
const post2 = {
  title: "Tarzan",
  content: "Best Movie Ever",
  owner: userInfo.username,
  rank : 3,
  imgUrl:'Need to put make it empty to make url',
}
let postID = "";
export const sharedVar = postID;

describe("Posts tests", () => {
  test("Test 1 - GET ALL POSTS-EMPTY", async () => {
    const response = await request(app).get("/Posts/");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Test 2 - CREATE A POST", async () => {
    jest.setTimeout(30000); 
    
    console.log("**********Test2*********");
    const response = await request(app)
      .post("/Posts/create")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send(post);
    console.log(userInfo.username)
  
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    expect(response.body.owner).toBe(userInfo.username);
    postID = response.body._id;
  
    const response2 = await request(app)
      .post("/Posts/create")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      }).send(post2);
    expect(response2.status).toBe(201);
    expect(response2.body.title).toBe(post2.title);
    expect(response2.body.content).toBe(post2.content);
    expect(response2.body.owner).toBe(userInfo.username);
    });

  test("Test 3- GET ALL POSTS-FULL", async () => {
    const response = await request(app).get("/Posts");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("Test 4 - GET A POST BY ID", async () => {
    const response = await request(app).get("/Posts/" + postID);
    expect(response.status).toBe(200);
  });

  test("Test 5 - GET A POST BY POST OWNER", async () => {
    const response = await request(app).get("/Posts/?owner=" + userInfo.username);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("Test 6 - CHANGE A POST", async () => {
    const response = await request(app)
      .put("/Posts/" + postID)
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
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
    expect(response.text).toContain("Missing required fields");
  });

  test("Test 8 - FAILURE TO GET A POST BY ID", async () => {
    const response = await request(app).get("/Posts/123");
    expect(response.status).toBe(400);
  });

  test("Test 10 - FAILURE TO GET A POST BY POST owner", async () => {
    const owner = "NonExistingOwner";
    const response = await request(app).get(`/Posts/?author=${owner}`);
    expect(response.status).toBe(200);
  });

  test("Test 11 - FAIULRE TO UPDATE A POST - RECIEVE ERROR", async () => {
    const mockerror = jest.spyOn(postsModel, "findByIdAndUpdate").mockRejectedValue(new Error("Database connection error"));

    const response = await request(app)
      .put("/Posts/" + postID)
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send({ content: "New Content" });

    expect(response.status).toBe(400);
  });

 

  test ("Test 12 - addLike to post ", async () => {
    const response = await request(app)
      .put(`/Posts/like/67daebdea238c923e6ab5d3b`) //used id 
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      });
      console.log('test 12\n'+response.text);
    expect(response.status).toBe(404);
    expect(response.text).toBe("Couldn't find post");
    console.log('before add like postID: '+postID); 

    const response2 = await request(app)
      .put(`/Posts/like/${postID}`)
      .set({
        Authorization: "jwt " + userInfo.accessToken, 
      });
    expect(response2.status).toBe(200);
    expect(response2.body.likes).toBe(1);

    const response3 = await request(app)
    .put(`/Posts/like/${postID}`)
    .set({
      Authorization: "jwt " + userInfo.accessToken, 
    });
  expect(response3.text).toBe("User already liked this post");
  expect(response3.status).toBe(400);
  });

test ("Test 13 - Dislike to post ", async () => {
  const response = await request(app)
    .put(`/Posts/unlike/67daebdea238c923e6ab5d3b`) //used id 
    .set({
      Authorization: "jwt " + userInfo.accessToken,
    });
    console.log('test 13\n'+response.text);
    expect(response.status).toBe(404);
    expect(response.text).toBe("Couldn't find post");

  const response2 = await request(app)
    .put(`/Posts/unlike/${postID}`).set({
      Authorization: "jwt " + userInfo.accessToken,
    });
  expect(response2.status).toBe(200);
  expect(response2.body.likes).toBe(0);
  
  const response3 = await request(app).put(`/Posts/unlike/${postID}`).set({
    Authorization: "jwt " + userInfo.accessToken,
  });
  expect(response3.text).toBe("User has not liked this post");
  expect(response3.status).toBe(400);

});

test("Test 14 - isLiked ", async () => {

  const response = await request(app)
    .get(`/Posts/isLiked/67daebdea238c923e6ab5d3b`)  
    .set({
      Authorization: "jwt " + userInfo.accessToken,
    });
    console.log('test 14\n'+response.text);
    expect(response.status).toBe(200);
    expect(response.body).toBe(false);

  const response2 = await request(app)
      .put(`/Posts/like/${postID}`)
      .set({
        Authorization: "jwt " + userInfo.accessToken, 
      });
    expect(response2.status).toBe(200);
    expect(response2.body.likes).toBe(1);

  const response3 = await request(app)
    .get(`/Posts/isLiked/${postID}`).set({
      Authorization: "jwt " + userInfo.accessToken,
    });
  expect(response3.status).toBe(200);
  expect(response3.body).toBe(true);
});

test("Test 14 - Delete Post", async () => { 
    const response = await request(app)
      .delete(`/Posts/delete/67daebdea238c923e6ab5d3b`)
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      });
    console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.text).toBe("Couldnt find post");
  const response2 = await request(app)
      .delete(`/Posts/delete/${postID}`)
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      });
    expect(response2.status).toBe(200);
    console.log(response2.body);
    expect(response2.body._id).toBe(postID);

  });

  test("Test 15 - CREATE POST FAILURE - MISSING FIELDS", async () => {
    const response = await request(app)
      .post("/Posts/create")
      .set({
        Authorization: "jwt " + userInfo.accessToken,
      })
      .send({ title: "Incomplete Post" });
  
    expect(response.status).toBe(400);
    expect(response.text).toContain("Missing required fields");
  });
  
  
});


