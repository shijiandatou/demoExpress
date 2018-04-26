var express = require('express');
//调用Router方法生成一个路由的实例
var router = express.Router();
var models = require('../models');
var markdown = require('markdown').markdown.toHTML;
/* GET home page. 
*  path指定 路径
* listener 指定监听回掉函数
*/
router.get('/', function(req, res, next) {
  var keyword = req.query.word;
  var query={};
  if(keyword){
    query['$or']=[
      {title:new RegExp(keyword)},
      {content:new RegExp(keyword)}
    ];
  };
  //将字符串user 转化成对象
  models.Article.find(query).populate('user').exec(function(err,articles){
    articles.forEach(function(article){
      article.content = markdown(article.content);
    });
     res.render('index', { articles: articles,keyword:keyword||''});
  });
  // res.render('../public/index.html');
 
});

module.exports = router;
