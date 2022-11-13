const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe Blog(contract name)
describe("Blog", async function () {
  // see that it creates a post
  it("Should create a post", async function () {
    // create an instance of the contract
    const Blog = await ethers.getContractFactory("Blog");
    // deploy it and wait
    const blog = await Blog.deploy("My blog");
    // it gets deployed
    await blog.deployed();
    // create a post
    await blog.createPost("My first post", "12345");
    // fetch post
    const posts = await blog.fetchPosts();
    // expect the first item in the post array to be "my first post"
    expect(posts[0].title).to.equal("My first post");
  });

  // see that it edits / updates a post
  it("Should edit a post", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();
    // create a second post
    await blog.createPost("My Second post", "12345");
    // update / edit the post's title, content and publish it.
    await blog.updatePost(1, "My updated post", "23456", true);

    posts = await blog.fetchPosts();
    expect(posts[0].title).to.equal("My updated post");
  });

  it("Should add update the name", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();

    expect(await blog.name()).to.equal("My blog");
    await blog.updateName("My new blog");
    expect(await blog.name()).to.equal("My new blog");
  });
});
