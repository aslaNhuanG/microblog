var crypto = require('crypto');
var User = require('../models/user.js');

module.exports = function(app) {
    // 首页
    app.get('/', function(req, res) {
        res.render('index', {
            title: '首页',
            user: req.session.user,
            error: req.flash('error').toString(),
            success: req.flash('success').toString()
        });
    });

    // 注册
    app.get('/reg', checkNotLogin);
    app.get('/reg', function(req, res) {
        res.render('reg', {
            title: '用户注册',
            user: req.session.user,
            error: req.flash('error').toString(),
            success: req.flash('success').toString()
        });
    });

    // 提交注册
    app.post('/reg', checkNotLogin);
    app.post('/reg', function(req, res){
        if(req.body['password-repeat'] != req.body['password']){
            req.flash('error','两次输入的密码不相同');
            return res.redirect('/reg');
        }

        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');

        var newUser = new User({
            name: req.body.username,
            password: password
        });

        console.log('new user',newUser.password);

        User.get(newUser.name, function(err, user){
            if(user){
                err = '用户名已存在';
            }
            if(err){
                req.flash('error', 'err');
                return res.redirect('/reg');
            }
            newUser.save(function(err){
                if(err){
                    req.flash('error','err');
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.flash('success','注册成功');
                res.redirect('/');
            })
        })
    });

    // 渲染登入页
    app.get('/login', checkNotLogin);
    app.get('/login', function(req, res){
        res.render('login', {
            title:'用户登入'
        })
    });

    // 执行登入
    app.post('/login', checkNotLogin);
    app.post('/login', function(req, res){
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');

        User.get(req.body.username, function(err, user){
            if(!user){
                req.flash('error', '用户不存在');
                return  res.redirect('/login');
            }
            console.log(user.password , password , user.password != password);
            if(user.password != password){
                req.flash('error', '密码不对');
            }
            req.session.user = user;
            req.flash('success','登入成功');
            res.redirect('/');
        })
    });

    // 执行登出
    app.get('/logout', checkLogin);
    app.get('/logout', function(req, res){
        req.session.user = null;
        req.flash('success','登出成功');
        res.redirect('/');
    });

    // 检查是否登入
    function checkLogin(req, res, next){
        if(!req.session.user){
            req.flash('error','未登入');
            return res.redirect('/login');
        }
        next();
    }

    // 检查是否登出
    function checkNotLogin(req, res, next){
        if(req.session.user){
            req.flash('error','已登入');
            return res.redirect('/');
        }
        next();
    }
}