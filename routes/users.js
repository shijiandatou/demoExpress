var express = require('express');
var models = require('../models');
var auth = require('../middleware/auth');
//路由的实例
var router = express.Router();
//注册
/* GET users listing. */
//注册 auth.checkNotLogin这是中间件函数 可以放在这里
router.get('/reg',auth.checkNotLogin,function(req, res, next) {
  res.render('users/reg', { title: '注册' });
});
//注册提交后的函数
router.post('/reg',auth.checkNotLogin,function(req, res, next){
  console.log(req.body);
  //保存对象有两种方法 entity.save model.create 
  models.User.create(req.body,function(err,doc){
    console.log(doc);
    if(err){
      req.flash('error','用户注册失败!');
    }else{
      req.flash('success','用户注册成功!');
      //重定向
    res.redirect('/users/login');
    }
    
  });
});
//登陆
router.get('/login',auth.checkNotLogin,function(req, res, next) {
  res.render('users/login', { title: '登陆' });
});
//登陆
router.post('/login',auth.checkNotLogin,function(req, res, next) {
  models.User.findOne({username:req.body.username,
  password:req.body.password},function(err,doc){
    if(err){
      req.flash('error','用户登陆失败!');
      res.redirect('back');
    }else{
      if(doc){ //登陆成功了
        //如果登陆成功后 把查询到的uesr用户赋值给session属性
        req.session.user = doc;
        req.flash('success','用户登陆成功!');
        res.redirect('/');
      }else{//登陆失败了
        req.flash('error','用户登陆失败!');
        res.redirect('back');
      }
    }
  })
});
//登出
router.get('/logout',auth.checkLogin,function(req, res, next) {
  req.session.user=null;
  req.flash('success','用户退出成功!');
  res.redirect('/');
});
module.exports = router;
