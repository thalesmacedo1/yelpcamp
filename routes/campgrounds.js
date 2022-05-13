const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

router.get('/campgrounds', (req, res) => {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    });
});

router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
    const { name, price, image, description } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = { name, price, image, description, author };
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Shows more info about one campground
router.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
    req.params.id
});

// Edit campground route
router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

// Update campground route
router.put('/campgrounds/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

// delete campground route
router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;