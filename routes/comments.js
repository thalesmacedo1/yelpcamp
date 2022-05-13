const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// new comment
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            req.flash('error', 'Something went wrong!');
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

router.post('/campgrounds/:id/comments', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            req.flash('error', 'Something went wrong!');
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully added comment!');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// comment edit route
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', { campground_id: req.params.id, comment: foundComment })
        }
    });
});

// comment update route
router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect('back')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    });
});

// comment destroy route
router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;
