const { Router } = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const checkAuth = require('../middleware/checkAuth');
const checkNotAuth = require('../middleware/checkNotAuth');
const sendEmail = require('../emails/registration');
const tokenGenerator = require('../utils/token-generator');


const router = Router();

/* Get login page */
router.get('/login', checkNotAuth, async (req, res, next) => {
    res.render('login', {
        title: 'Login',
        isLogin: true
    });
});

/* Login user */
router.post('/login', checkNotAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true })
);

/* Get register page */
router.get('/register', checkNotAuth, async (req, res, next) => {
    res.render('register', {
        title: 'Register',
        isRegister: true
    });
});

/* Register new user */
router.post('/register', checkNotAuth, async (req, res, next) => {
    try {
        // Check user by username and email
        if (await User.findOne({username: req.body.username})) {
            req.flash('error', 'User with this username already exists');
            return res.redirect('/register');
        }
        // Check user by email
        if (await User.findOne({email: req.body.email})) {
            req.flash('error', 'User with this email already exists');
            return res.redirect('/register');
        }

        const {first_name, last_name, username, email} = req.body;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const id = mongoose.Types.ObjectId();

        await User.create({
            _id: id,
            first_name,
            last_name,
            username,
            email,
            password: hashedPassword
        });
        // Path to the email content file
        const template_file = require('path').resolve('./views/registration_email.hbs');
        const url = '/confirmation/' + await tokenGenerator(id);
        await sendEmail(email, first_name,'Registration', template_file, url);

        req.flash('success', 'You have been successfully registered. Please check your email');
        res.redirect('/login');
    } catch (e) {
        req.flash('error', 'Something went wrong. Please try again later');
        res.redirect('/register');
    }
});

/* User email confirmation */
router.get('/confirmation/:token', async (req, res, next) => {
    try {
        // Check JWT Token
        jwt.verify(req.params.token, process.env.SESSION_SECRET, async (err, data) => {
            if (err) {
                req.flash('error', 'Token is invalid or has been expired');
                res.redirect('/login');
            }
            await User.updateOne({_id: data.user}, {$set: {confirmed: true}});
        });
        req.flash('success', 'Your email has been confirmed. Now you can login');
    } catch (e) {
        req.flash('error', 'Something went wrong. Please try again later');
    }

    res.redirect('/login');
});

/* User requested password reset */
router.get('/password-reset', async  (req, res, next) => {
    res.render('request_password_reset', { title: 'Password reset' });
});

/* Send password reset email */
router.post('/password-reset', async  (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            req.flash('error', 'User with this email does not exists');
            return res.redirect('/register')
        }

        // Path to the email content file
        const template_file = require('path').resolve('./views/password_reset_email.hbs');

        const url = '/reset/' + await tokenGenerator(user.id);
        await sendEmail(user.email, user.first_name,'Password reset', template_file, url);

        req.flash('success', 'Please check your email and follow the instructions');
    } catch (e) {
        req.flash('error', 'Something went wrong. Please try again later');
    }
    res.redirect('/');
});

/* Render password reset page */
router.get('/reset/:token', async (req, res, next) => {
    res.render('password_reset', { title: 'Password reset' });
});

/* Reset user password */
router.post('/reset/:token', async (req, res, next) => {
    try {
        // Check JWT Token
        jwt.verify(req.params.token, process.env.SESSION_SECRET, async (err, data) => {
            if (err) {
                req.flash('error', 'Token is invalid or has been expired');
                return res.redirect('/login');
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await User.updateOne({_id: data.user}, {$set: {password: hashedPassword}});
        });
        req.flash('success', 'Your password has been changed. Now you can login');
    } catch (e) {
        req.flash('error', 'Something went wrong. Please try again later');
    }

    // Redirect to the Login page
    res.redirect('/login')
});

/* Get user profile */
router.get('/profile', checkAuth, async (req, res, next) => {
    res.render('profile', {
        title: 'User Profile',
        isProfile: true,
        user: req.user
    });
});

/* Update user profile */
router.post('/profile', checkAuth, async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, req.body);

        req.flash('success', 'Profile information has been successfully updated');
    } catch (e) {
        req.flash('error', 'Something went wrong. Please try again later');
    }

    res.redirect('/profile');
});

/* Delete user profile */
router.delete('/profile/delete', checkAuth, async (req, res, next) => {
    try {
        await User.findOneAndRemove({_id: req.user.id});
        req.logOut();
        req.flash('success', 'Your account has been deleted. We miss you. Please return');
    } catch (e) {
        req.flash('error', 'Something went wrong. Please try again later');
    }

    res.redirect("/");
});

/* Get logout page */
router.get('/logout', checkAuth, async (req, res, next) => {
    res.render('logout', {
        title: 'Logout',
        isLogout: true
    });
});

/* Logout user */
router.post('/logout', checkAuth, async (req, res, next) => {
    req.logOut();
    req.flash('success', 'Your have been logged out. We miss you. Please return');
    res.redirect('/');
});

module.exports = router;
