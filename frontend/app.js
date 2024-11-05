const API_URL = 'http://localhost:3000/api';

async function fetchPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function createPost(title, body) {
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });
        if (response.ok) {
            fetchPosts();
            return true;
        }
    } catch (error) {
        console.error('Error creating post:', error);
    }
    return false;
}

async function updatePost(id, title, body) {
    try {
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, title, body, userId: 1 })
        });
        if (response.ok) {
            fetchPosts();
            return true;
        }
    } catch (error) {
        console.error('Error updating post:', error);
    }
    return false;
}

async function deletePost(id) {
    try {
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchPosts();
            return true;
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
    return false;
}

function renderPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        const isEditing = post.isEditing || false;
        
        if (isEditing) {
            postElement.innerHTML = `
                <form class="edit-form" onsubmit="event.preventDefault(); handleUpdatePost(${post.id})">
                    <input type="text" id="edit-title-${post.id}" value="${post.title}" required>
                    <textarea id="edit-body-${post.id}" required>${post.body}</textarea>
                    <div class="actions">
                        <button type="submit">Save</button>
                        <button type="button" onclick="toggleEdit(${post.id})">Cancel</button>
                    </div>
                </form>
            `;
        } else {
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <div class="actions">
                    <button onclick="toggleEdit(${post.id})">Edit</button>
                    <button onclick="handleDeletePost(${post.id})">Delete</button>
                </div>
            `;
        }
        
        postsContainer.appendChild(postElement);
    });
}

function toggleEdit(postId) {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        const currentId = parseInt(post.querySelector('button').getAttribute('onclick').match(/\d+/)[0]);
        if (currentId === postId) {
            const postData = {
                id: postId,
                title: post.querySelector('h3')?.textContent || '',
                body: post.querySelector('p')?.textContent || '',
                isEditing: true
            };
            renderPosts([postData]);
        }
    });
}

async function handleUpdatePost(id) {
    const title = document.getElementById(`edit-title-${id}`).value;
    const body = document.getElementById(`edit-body-${id}`).value;
    if (await updatePost(id, title, body)) {
        fetchPosts();
    }
}

async function handleDeletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        await deletePost(id);
    }
}

document.getElementById('postForm').onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('titleInput').value;
    const body = document.getElementById('bodyInput').value;
    
    if (await createPost(title, body)) {
        document.getElementById('titleInput').value = '';
        document.getElementById('bodyInput').value = '';
    }
};

// Initial load
fetchPosts();