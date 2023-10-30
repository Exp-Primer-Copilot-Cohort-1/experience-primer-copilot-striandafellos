// create web server

// import modules
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const { isLoggedIn } = require('../middleware');
const { checkCommentOwnership } = require('../middleware');

// create comment

router.post('/posts/:id/comments', isLoggedIn, async (req, res) => {
      try {
    // find post
    let post = await Post.findById(req.params.id);
    // create comment
    let comment = await Comment.create(req.body.comment);
    // add username and id to comment
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    // save comment
    await comment.save();
    // add comment to post
    post.comments.push(comment);
    // save post
    await post.save();
    // redirect to show page
    res.redirect(`/posts/${post._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/posts');
  }
}
);

// edit comment

router.get('/posts/:id/comments/:comment_id/edit', checkCommentOwnership, async (req, res) => {
    try {
        let foundComment = await Comment.findById(req.params.comment_id);
        res.render('comments/edit', { post_id: req.params.id, comment: foundComment });
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
    }
);

// update comment

router.put('/posts/:id/comments/:comment_id', checkCommentOwnership, async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        res.redirect(`/posts/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
    }
);