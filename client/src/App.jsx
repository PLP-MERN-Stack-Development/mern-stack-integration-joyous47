import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import SearchFilter from './components/SearchFilter';
import { postsAPI, categoriesAPI } from './services/api';
import useApi from './hooks/useApi';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const { data: postsData, loading, error, execute: fetchPosts } = useApi(postsAPI.getAll);
  const { data: categoriesData, execute: fetchCategories } = useApi(categoriesAPI.getAll);

  // Load posts and categories when component mounts
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // Update posts state when data is fetched
  useEffect(() => {
    if (postsData) {
      setPosts(postsData);
      setFilteredPosts(postsData);
    }
  }, [postsData]);

  // Handle search and filter
  useEffect(() => {
    let filtered = posts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(post => 
        post.category === categoryFilter
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, categoryFilter, posts]);

  // Create new post
  const handleCreatePost = async (postData) => {
    try {
      await postsAPI.create(postData);
      fetchPosts(); // Refresh the list
      alert('Post created successfully!');
    } catch (error) {
      alert('Error creating post: ' + error.message);
    }
  };

  // Update existing post
  const handleUpdatePost = async (postData) => {
    try {
      await postsAPI.update(editingPost._id, postData);
      setEditingPost(null);
      fetchPosts(); // Refresh the list
      alert('Post updated successfully!');
    } catch (error) {
      alert('Error updating post: ' + error.message);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(postId);
        fetchPosts(); // Refresh the list
        alert('Post deleted successfully!');
      } catch (error) {
        alert('Error deleting post: ' + error.message);
      }
    }
  };

  // Start editing a post
  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        
        <div className="main-container">
          <Routes>
            {/* Home page - Show posts */}
            <Route path="/" element={
              <div>
                <h1 className="page-title">Blog Posts</h1>
                
                {/* Search and Filter */}
                <SearchFilter 
                  onSearch={handleSearch}
                  onFilter={handleCategoryFilter}
                  categories={categoriesData || []}
                />
                
                {loading && (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                  </div>
                )}
                
                {error && (
                  <div className="error-state">
                    Error loading posts: {error}
                  </div>
                )}
                
                {!loading && !error && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-600">
                        Showing {filteredPosts.length} of {posts.length} posts
                        {searchTerm && ` for "${searchTerm}"`}
                        {categoryFilter !== 'all' && ` in ${categoryFilter}`}
                      </p>
                    </div>
                    
                    {filteredPosts.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                        <p className="text-gray-600">
                          {searchTerm || categoryFilter !== 'all' 
                            ? 'Try adjusting your search or filter criteria.' 
                            : 'Create your first blog post to get started!'
                          }
                        </p>
                      </div>
                    ) : (
                      <PostList 
                        posts={filteredPosts} 
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                      />
                    )}
                  </>
                )}
              </div>
            } />
            
            {/* Create post page */}
            <Route path="/create" element={
              <div className="max-w-2xl mx-auto">
                <h1 className="page-title">Create New Post</h1>
                <PostForm 
                  onSubmit={handleCreatePost}
                />
              </div>
            } />
          </Routes>

          {/* Edit form (shown on home page when editing) */}
          {editingPost && (
            <div className="modal-overlay">
              <div className="modal-content">
                <PostForm 
                  post={editingPost}
                  onSubmit={handleUpdatePost}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;

