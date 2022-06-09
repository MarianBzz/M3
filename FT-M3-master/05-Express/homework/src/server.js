// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
// server.use(express.json());

// TODO: your code to handle requests
server.post("/posts", (req, res) => {
  const { author, title, contents } = req.body;
  if (!author || !title || !contents)
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });

  const post = {
    author,
    title,
    contents,
    id: posts.length + 1,
  };

  posts.push(post);

  return res.json(post);
});

server.post("/posts/author/:author", (req, res) => {
  const { title, contents } = req.body;
  const { author } = req.params;
  if (!author || !title || !contents)
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  const post = {
    author,
    title,
    contents,
    id: posts.length + 1,
  };

  posts.push(post);

  return res.json(post);
});

server.get("/posts", (req, res) => {
  const { term } = req.query;
  if (!term) return res.json(posts);
  const termPosts = posts.filter(
    (p) => p.title.includes(term) || p.contents.includes(term)
  );
  res.json(termPosts);
});

server.get("/posts/:author", (req, res) => {
  const { author } = req.params;
  if (!author)
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  const authorPosts = posts.filter((p) => p.author.includes(author));
  if (!authorPosts.length)
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  res.json(authorPosts);
});

server.get("/posts/:author/:title", (req, res) => {
  const { author, title } = req.params;
  const postsTitle = posts.filter(
    (p) => p.author === author && p.title === title
  );
  if (!postsTitle.length)
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  res.json(postsTitle);
});

server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;

  if (!id || !title || !contents)
    return res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });

  const postId = posts.find((p) => p.id === id);

  if (!postId)
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No se encuentra el Post" });

  postId.title = title;
  postId.contents = contents;
  res.json(postId);
});

server.delete("/posts", (req, res) => {
  const { id } = req.body;
  const postId = posts.find((p) => p.id === id);

  if (!postId)
    return res.status(STATUS_USER_ERROR).json({ error: "Mensaje de error" });

  posts = posts.filter((p) => p.id !== id);

  res.json({ success: true });
});

server.delete("/author", (req, res) => {
  const { author } = req.body;
  const postAuthor = posts.find((p) => p.author === author);

  if (!postAuthor)
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe el autor indicado" });

  const deletePosts = posts.filter((p) => p.author === author);
  posts = posts.filter((p) => p.author !== author);
  res.json(deletePosts);
});

module.exports = { posts, server };
