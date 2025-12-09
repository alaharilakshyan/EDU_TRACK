const express = require('express');
const { BlogPost } = require('../models');
const router = express.Router();

// GET /api/blog/posts
router.get('/posts', async (req, res) => {
  try {
    const { 
      universityId, 
      tag, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    const query = { isPublished: true };
    if (universityId) query.universityId = universityId;
    if (tag) query.tags = tag;

    const posts = await BlogPost.find(query)
      .populate('author', 'fullName uid7')
      .populate('universityId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'GET_BLOG_POSTS_ERROR',
        message: 'Failed to get blog posts'
      }
    });
  }
});

// POST /api/blog/posts
router.post('/posts', async (req, res) => {
  try {
    const { title, content, tags, isGlobal, universityId } = req.body;

    const post = new BlogPost({
      title,
      content,
      author: req.user.profileRef,
      tags,
      isGlobal: isGlobal || false,
      universityId: isGlobal ? null : (universityId || req.user.universityId)
    });

    await post.save();

    res.status(201).json({
      success: true,
      data: post,
      error: null
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'CREATE_BLOG_POST_ERROR',
        message: 'Failed to create blog post'
      }
    });
  }
});

module.exports = router;
