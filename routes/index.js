var crypto = require('crypto');
var User = require('../models/user.js');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', {title: '首页'});
    });

    app.get('/reg', function(req, res) {
        res.render('reg', {title: '用户注册'});
    });

    app.post('/reg', function(req, res){
        if(req.body['password-repeat']!=req.body['password']){
            req.flash('error','Tow passwords different.');
            //req.session.flash = req.session.flash || {} ;
            //req.session.flash.error = "Tow passwords different.";
            return res.redirect('/reg');
        }
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body['password']).digest('base64');

        var newUser = new User({
            name: req.body.username,
            password: req.body.password
        });

        User.get(newUser.name, function(err, user){
            if(user){
                err = 'Username already exists.';
            }
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            newUser.save(function(err){
                if(err){
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.flash('success','注册成功');
                res.redirect('/');
            })

        })

    })
}