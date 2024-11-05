export class UI {
  static showLoading() {
    document.getElementById('loading').style.display = 'block';
  }

  static hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }

  static showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  static renderPosts(posts, app) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.dataset.id = post.id;
      
      if (app.editingPost && app.editingPost.id === post.id) {
        postElement.innerHTML = this.renderEditForm(post);
      } else {
        postElement.innerHTML = `
          <h3>${this.escapeHtml(post.title)}</h3>
          <p>${this.escapeHtml(post.body)}</p>
          <div class="actions">
            <button onclick="app.editPost(${post.id})">Edit</button>
            <button onclick="app.deletePost(${post.id})">Delete</button>
          </div>
        `;
      }
      
      postsContainer.appendChild(postElement);
    });
  }

  static renderEditForm(post) {
    return `
      <form class="edit-form" onsubmit="event.preventDefault(); app.updatePost(${post.id})">
        <input type="text" id="edit-title-${post.id}" value="${this.escapeHtml(post.title)}" required>
        <textarea id="edit-body-${post.id}" required>${this.escapeHtml(post.body)}</textarea>
        <div class="actions">
          <button type="submit">Save</button>
          <button type="button" onclick="app.cancelEdit()">Cancel</button>
        </div>
      </form>
    `;
  }

  static escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}