import React from 'react';

const PostList = ({ posts, onEdit, onDelete }) => {
  if (!posts || posts.length === 0) {
    return <div className="text-center py-8">No posts found. Create your first post!</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-2">Category: {post.category}</p>
          <p className="text-gray-700 mb-4">{post.content}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => onEdit(post)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;



