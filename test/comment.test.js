const request = require("supertest")
const appPromise = require("../app")
const Comment = require("../modules/comments_model")
const Post = require("../modules/posts_model")
const mongoose = require("mongoose")
var app;
var newCommentId;

var newComment = {
    comment_user: "Rotem",
    title: "My first post",
    comment_content: "This is my first post",
    post_id: "1"

}

var unvalidNewComment = {
    comment_user: "Rotem",
    comment_content: "This is my first post",
    post_id: "1"
}
var newUpdatedComment = {
    _id: newCommentId,
    comment_content: "I Just Changed The Content"
}
beforeAll(async () => {
    app = await appPromise;
    await Comment.deleteMany()
    console.log("cleared the database")
})

afterAll(done => {
    mongoose.connection.close()
    done()
})

describe("Get all Comments-EmptyDB", () => {
    test("all Comments-EmptyDB", async () => {
        const response = await request(app).get("/Comments")
        expect(response.statusCode).toEqual(401)

    })
})
describe("Adding comment", () => {
    test("Add new Comment", async () => {
        const response = await request(app).post("/Comments").send(newComment)
        newCommentId = response.body._id
        expect(response.statusCode).toEqual(200)
        expect(response.body.comment_user).toEqual(newComment.comment_user)
        expect(response.body.title).toEqual(newComment.title)
        expect(response.body.comment_content).toEqual(newComment.comment_content)
    })
})

describe("Adding unvalid Comment", () => {
    test("Add unvalid comment", async () => {
        const response = await request(app).post("/Comments").send(unvalidNewComment)
        expect(response.statusCode).toEqual(400)
    })
})
describe("Get all Comments", () => {
    test("all Comments", async () => {
        const response = await request(app).get("/Comments")
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toEqual(1)
        expect(response.body[0].comment_user).toEqual(newComment.comment_user)
        expect(response.body[0].title).toEqual(newComment.title)
        expect(response.body[0].comment_content).toEqual(newComment.comment_content)
    })
})


describe("Get comment by postid", () => {
    test("get comment by postid (the post id is 1)", async () => {
        const response = await request(app).get("/Comments/1")
        expect(response.body[0].comment_user).toEqual(newComment.comment_user)
        expect(response.body[0].title).toEqual(newComment.title)
        expect(response.body[0].comment_content).toEqual(newComment.comment_content)
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toEqual(1)
    })
})
describe("Get comment withUnvalid postid-not mongo", () => {
    test("get comment with Unvalid postid ", async () => {
        const response = await request(app).get("/Comments/2")
        expect(response.error.text).toEqual("cant find any comments on this postId")
        expect(response.statusCode).toEqual(400)

    })
})


describe("Update comment by CommentId", () => {
    test("UpdatecommentbyCommentId", async () => {
        const response = await request(app).put("/Comments/" + newCommentId).send(newUpdatedComment)
        expect(response.statusCode).toEqual(200)
        expect(response.body.comment_user).toEqual(newComment.comment_user)
        expect(response.body.title).toEqual(newComment.title)
        expect(response.body.comment_content).toEqual(newUpdatedComment.comment_content)
        expect(response.body._id).toEqual(newCommentId)
    })
})


describe("Update comment by Unvalid CommentId", () => {
    test("UpdatecommentbyCommentId", async () => {
        const response = await request(app).put("/Comments/1" + newCommentId).send(newUpdatedComment)
        expect(response.statusCode).toEqual(400)
        expect(response.error.text).toEqual("Invalid ID format.")
    })
})
describe("unvalid delete", () => {
    test("Unvalid delete", async () => {
        const response = await request(app).delete("/Comments/6755918c1e667b30c3d80249")
        expect(response.statusCode).toEqual(400)
        expect(response.error.text).toEqual("There is no such a comment with that ID")
    })
})
describe("valid delete", () => {
    test("valid delete", async () => {
        const response = await request(app).delete("/Comments/" + newCommentId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.comment_user).toEqual(newComment.comment_user)
        expect(response.body.title).toEqual(newComment.title)
        expect(response.body.comment_content).toEqual(newUpdatedComment.comment_content)

    })
})    
