const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post(
    "/signup",
    wrapAsync(async (req, res) => {
        try {
            let { email, username, password } = req.body;
            let user = new User({ email, username });
            let newUser = await User.register(user, password);
            req.login(newUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Welcome to Around The World!");
                res.redirect("/listings");
            });
        } catch (err) {
            req.flash("error", err.message);
            res.redirect("/signup");
        }
    })
);

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    wrapAsync(async (req, res) => {
        req.flash("success", "Welcome back!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    })
);

router.get("/logout", (req, res) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "You have successfully logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;
