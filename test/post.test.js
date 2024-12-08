const request = require("supertest")
const appPromise = require("../app")
const Post = require("../modules/posts_model")
const mongoose = require("mongoose")
var app;
var newPostId;
var newPost = {     
    author: "Rotem",
    title: "My first post", 
    content: "This is my first post"
}
var unvalidNewPost = {  
    title:"My unvalid post",
    content:"This is my unvalid post"}

beforeAll(async () => {
    app = await appPromise;
    await Post.deleteMany()
    console.log("cleared the database")
})

afterAll(done => {
    mongoose.connection.close()
    done()
})

describe("Get all posts ", () => {
    test("all posts", async () => {
        const response = await request(app).get("/Posts")
        expect(response.statusCode).toEqual(201)
        expect(response.text).toEqual("Database is empty") 
    })
})
describe("Adding Post", () => {
    test("Add new post", async () => {
        const response = await request(app).post("/Posts").send(newPost)
        newPostId= response.body._id
        expect(response.statusCode).toEqual(200)
        expect(response.body.author).toEqual(newPost.author)    
        expect(response.body.title).toEqual(newPost.title)  
        expect(response.body.content).toEqual(newPost.content)
    })
})
describe("Adding unvalid Post", () => {
    test("Add unvalid post", async () => {
        const response = await request(app).post("/Posts").send(unvalidNewPost)
        expect(response.statusCode).toEqual(400)
    })
})
describe("Get all posts2", () => {
    test("all posts", async () => {
        const response = await request(app).get("/Posts")
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toEqual(1)
    })
})

describe("Post by Id", () => {
    test("getPostById", async () => {
        const response = await request(app).get("/Posts/" + newPostId) 
        expect(response.statusCode).toEqual(200)
        expect(response.body.author).toEqual(newPost.author)    
        expect(response.body.title).toEqual(newPost.title)  
        expect(response.body.content).toEqual(newPost.content)
    })})
describe("Post by Wrong Id", () => {
    test("getPostByWrongId", async () => {
        const response = await request(app).get("/Posts/" + newPostId+"1") 
        expect(response.statusCode).toEqual(400);
        
    })})    

describe("Get all Post By author", () => {
    test("getPostByAuthor", async () => {
        const response = await request(app).get("/Posts?author=" + newPost.author) 
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].author).toEqual(newPost.author)    
        expect(response.body[0].title).toEqual(newPost.title)  
        expect(response.body[0].content).toEqual(newPost.content)
    })})
describe("Get all Post By not exist author", () => {
    test("getPostByNotExistAuthor", async () => {
        const response = await request(app).get("/Posts?author=shon") 
        expect(response.statusCode).toEqual(209)
    })})
var updatedPost = { 
    _id: newPostId,
    content: "I Just Changed The Content"
}

describe("Update Post", () => {
    test("UpdatePostById", async () => {
        const response = await request(app).put("/Posts/" + newPostId).send(updatedPost)
        expect(response.statusCode).toEqual(200)
        expect(response.body.author).toEqual(newPost.author)    
        expect(response.body.title).toEqual(newPost.title)  
        expect(response.body.content).toEqual(newPost.content)
    })})
describe("Update Unvalid Post", () => {
    test("UnvalidUpdatePostById", async () => {
        const response = await request(app).put("/Posts/" + newPostId+"1").send(updatedPost)
        expect(response.statusCode).toEqual(400)
    })})   
         
    module.exports = newPostId