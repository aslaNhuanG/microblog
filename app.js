
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , util = require('util');
var partials = require('express-partials'); // 应用了部分视图

//var helpers = require('express-helpers')(app);
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings.js');
var app = express();

// 通用配置
app.configure(function(){
  app.set('port', process.env.PORT || 3000);    // 端口
  app.set('views', __dirname + '/views');   // view路径
  app.set('view engine', 'ejs');    //  模板引擎
  app.use(express.favicon());   // express通过函数use(),启用中间件
  app.use(express.logger('dev'));
  app.use(express.bodyParser());    // 用于获取POST等传送的数据
  app.use(express.methodOverride()); // 用于支持浏览器的PUT，DELETE等HTTP方法
  app.use(partials());
    app.use(express.cookieParser());
  app.use(express.session({
        secret: settings.cookieSecret,
        store: new MongoStore({
            db: settings.db
        })
  }))

  app.use(app.router);  // 项目路径支持
  app.use(express.static(path.join(__dirname, 'public'))); // 静态文件支持

});


// 开发环境配置
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack:true }));
});

// product配置
app.configure('production', function(){
    app.use(express.errorHandler());
});

//app.dynamicHelpers
app.use(function(req, res, next){
    //res.locals.csrf = req.session ? req.session._csrf : '';
    res.locals.error = req.session.error;
    res.locals.success = req.session.success;
    res.locals.user = req.session.user;
    next();
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
