import { api } from './api.js';
import { UI } from './ui.js';

class App {
  constructor() {
    this.posts = [];
    this.editingPost = null;
    this.user = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.checkAuth();
  }

  setupEventListeners() {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleRegister();
    });

    document.getElementById('postForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.createPost();
    });
  }

  async handleRegister() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      UI.showLoading();
      const user = await api.register(username, email, password);
      this.user = user;
      UI.showToast('Registration successful!');
      this.checkAuth();
      await this.loadPosts();
    } catch (error) {
      UI.showToast(error.message, 'error');
    } finally {
      UI.hideLoading();
    }
  }

  checkAuth() {
    const authSection = document.getElementById('auth-section');
    const contentSection = document.getElementById('content-section');

    if (this.user) {
      authSection.style.display = 'none';
      contentSection.style.display = 'block';
    } else {
      authSection.style.display = 'block';
      contentSection.style.display = 'none';
    }
  }

  async loadPosts() {
    if (!this.user) return;

    try {
      UI.showLoading();
      this.posts = await api.fetchPosts();
      UI.renderPosts(this.posts, this);
    } catch (error) {
      UI.showToast(error.message, 'error');
    } finally {
      UI.hideLoading();
    }
  }

  async createPost() {
    const title = document.getElementById('titleInput').value;
    const body = document.getElementById('bodyInput').value;

    try {
      UI.showLoading();
      const newPost = await api.createPost(title, body);
      this.posts.unshift(newPost);
      UI.renderPosts(this.posts, this);
      UI.showToast('Post created successfully');
      document.getElementById('postForm').reset();
    } catch (error) {
      UI.showToast(error.message, 'error');
    } finally {
      UI.hideLoading();
    }
  }

  editPost(id) {
    const post = this.posts.find(p => p.id === id);
    if (!post) return;

    this.editingPost = post;
    const postElement = document.querySelector(`.post[data-id="${id}"]`);
    if (postElement) {
      postElement.innerHTML = UI.renderEditForm(post);
    }
  }

  async updatePost(id) {
    const title = document.getElementById(`edit-title-${id}`).value;
    const body = document.getElementById(`edit-body-${id}`).value;

    try {
      UI.showLoading();
      const updatedPost = await api.updatePost(id, title, body);
      const index = this.posts.findIndex(p => p.id === id);
      if (index !== -1) {
        this.posts[index] = updatedPost;
      }
      UI.renderPosts(this.posts, this);
      UI.showToast('Post updated successfully');
      this.editingPost = null;
    } catch (error) {
      UI.showToast(error.message, 'error');
    } finally {
      UI.hideLoading();
    }
  }

  async deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      UI.showLoading();
      await api.deletePost(id);
      this.posts = this.posts.filter(p => p.id !== id);
      UI.renderPosts(this.posts, this);
      UI.showToast('Post deleted successfully');
    } catch (error) {
      UI.showToast(error.message, 'error');
    } finally {
      UI.hideLoading();
    }
  }

  cancelEdit() {
    this.editingPost = null;
    UI.renderPosts(this.posts, this);
  }
}

window.app = new App();