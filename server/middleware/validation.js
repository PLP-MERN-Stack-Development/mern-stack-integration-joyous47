const validatePost = (req, res, next) => {
  const { title, content } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Content is required' });
  }
  
  if (title.length > 100) {
    return res.status(400).json({ message: 'Title must be less than 100 characters' });
  }
  
  next();
};

const validateCategory = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Category name is required' });
  }
  
  next();
};

module.exports = { validatePost, validateCategory };

