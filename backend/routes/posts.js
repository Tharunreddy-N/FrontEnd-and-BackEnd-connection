const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_BASE = 'https://jsonplaceholder.typicode.com';
let localPosts = [];

router.get('/', async (req, res) => {
  try {
    if (localPosts.length === 0) {
      const response = await axios.get(`${API_BASE}/posts`);
      localPosts = response.data.slice(0, 10);
    }
    res.json(localPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newPost = {
      id: Date.now(),
      ...req.body
    };
    localPosts.unshift(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = localPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      localPosts[index] = { ...localPosts[index], ...req.body };
      res.json(localPosts[index]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    localPosts = localPosts.filter(post => post.id !== id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;