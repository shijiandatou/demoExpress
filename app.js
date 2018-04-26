var express = require('express');
var config = require('./config');
var flash = require('connect-flash');
//处理路径 path.join path.resolve
//url querystring JSON.parse
var path = require('path');
//处理收藏夹图标
var favicon = require('serve-favicon');
//写日志的 日志中间件
var logger = require('morgan');
//解析cookie req.cookie属性 存放着客户端提交的cookie
//req.cookie(key,value)向客户端写入cookie
var cookieParser = require('cookie-parser');
//处理请求体的 req.body属性 存放着请求体  存放着对象
var bodyParser = require('body-parser');
//主页路由
var index = require('./routes/index');
//用户路由
var users = require('./routes/users');
//文章的路由
var articles = require('./routes/articles');
//引入session中间件  req.session
var session = require("express-session");
//引入中间件  保存到数据库中
var MongoStore = require('connect-mongo')(session);
//app是个函数
var app = express();

// view engine setup 设置模板的存放路径
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine', 'html');
//指定HTML模板的渲染方法
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//在你把favicon图标放在public目录之后取消注释
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//日志记录中间件
app.use(logger('dev'));
//处理content-type=json的请求体
app.use(bodyParser.json());
//处理content-type=urlencoded的请求体 {"name":"liushiel"}
//extened为true 表示使用querystring来将请求体的字符串转成对象 name=liu&age=8
app.use(bodyParser.urlencoded({ extended: false }));
//会增加 req.cookie属性 和 res.cookie(key,value)方法
app.use(cookieParser());
//使用session中间件
app.use(session({
  secret:'liushilei',
  resave:true,//每次响应结束后都保存一下session数据
  saveUninitialized:true,//保存新创建但未初始化的session
  store:new MongoStore({
    url:config.dbUrl
  })
}));
app.use(flash());
app.use(function(req,res,next){
  //res.locals 才是真正的渲染模板的对象
  res.locals.user=req.session.user;
  res.locals.keyword='';
  res.locals.success=req.flash('success').toString(),
  res.locals.error = req.flash('error').toString(),
  next();
});
//静态文件服务器中间件 指定一个绝对路径作为静态文件的跟目录
app.use(express.static(path.join(__dirname, 'public')));
//指定路由 每一个模块划分一个路由 配置跳转的
app.use('/', index);
app.use('/users', users);
app.use('/articles', articles);
// catch 404 and forward to error handler
//捕获404错误 并转发到错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler 错误处理中间件 有四个参数 第一个参数是err
//如果有中间件出错了 会把请求交给错误处理中间件 进行处理
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
