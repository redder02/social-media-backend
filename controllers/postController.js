const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const post = new Post({ title, content, user: req.user.id });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username').limit(10);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        
        post.title = req.body.title;
        post.content = req.body.content;
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        
        await Post.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Post removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.likes = post.likes + 1;
        await post.save();
        res.json({ likes: post.likes });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};
