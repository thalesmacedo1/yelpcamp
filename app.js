const express = require('express'),
    app       = express(),
    mongoose  = require('mongoose'),
    flash     = require('connect-flash'),
    passport  = require('passport'),
    LocalStrategy  = require('passport-local'),
    methodOverride = require('method-override'),
    Campground     = require('./models/campground'),
    Comment        = require('./models/comment'),
    User           = require('./models/user'),
    seedDB         = require('./seeds');

const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const authRoutes = require('./routes/index');

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash('error');
    res.locals.success     = req.flash('success');
    next();
});

// requiring routes
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
// É possível utilizar assim:
// app.use("/campgrounds", campgroundRoutes)
// Bastando excluir essa parte declarada entre aspas nas rotas do arquivo chamado.
// Se a rota tiver :id, como aqui:
// app.use("/campgrounds/:id", commentRoutes)
// deve-se add parametro mergeParams: true no express.router. Assim ele mescla os parametros e não retorna null


// criar novo campground

// Campground.create({
//     name: "Salmon Creek",
//     image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
//     description: "Um por do sol magnifico na pedra da canastra americana."
// }, (err, campground) => {
//     if(err){
//         console.log(err);
//     } else {
//         console.log("CAMPGROUND SUCCESSFULLY CREATED!");
//         console.log(campground);
//     }
// })

app.listen(3000, () => console.log('App is running!'))