var express = require('express');
var models = require('../models');
//路由的实例
var router = express.Router();
var auth = require('../middleware/auth');
/* GET users listing. */
//跳转到发表文章
router.get('/add',auth.checkLogin,function(req, res) {
  res.render('article/add', { title: '发表文章',article:{} });
});
//发表文章
router.post('/add',auth.checkLogin,function(req, res) {
  var article = req.body;
  //把当前登陆的用户的Id赋给user;
  article.user = req.session.user._id;
  models.Article.create(article,function(err,doc){
    if(err){
      req.flash('error','文章发表失败!');
    }else{
      req.flash('success','文章发表成功!');
      res.redirect('/');
    }
  });
});
//获取详情
router.get('/detail/:_id',function(req,res){
  var _id = req.params._id;
  models.Article.findById(_id,function(err,article){
    if(err){
      req.flash('error','获取失败!');
      res.redirect('back');
    }else{
      res.render('article/detail',{article:article});
    }
  });
});
//删除一篇文章
router.get('/delete/:_id',function(req,res){
  var _id = req.params._id;
  models.Article.remove({_id},function(err,result){
    if(err){
        req.flash('error',err);
        res.redirect('back');
    }else{
      req.flash('success','删除成功!');
      res.redirect('/');
    }
  });
});
//跳转的更新文章的页面 
router.get('/update/:_id',function(req,res){
  var _id = req.params._id;
  models.Article.findById(_id,function(err,article){
    if(err){

    }else{
      //这是render
      res.render('article/add',{title:'更新文章',article:article})
    }
  });
});
//更新一篇文章的请求 post
router.post('/update/:_id',function(req,res){
    var _id = req.params._id;
    var article = req.body;
    console.log('_id',_id);
    console.log('article',article);
    models.Article.update({"_id":_id},article,function(err,result){
      if(err){
        req.flash('error','更新失败!');
        res.redirect('back');
      }else{
        req.flash('success','更新成功');
        res.redirect('/articles/detail/'+_id);
      }
    }); 
});
module.exports = router;