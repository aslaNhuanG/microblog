/**
 * Created with JetBrains WebStorm.
 * User: lionhuang
 * Date: 13-2-21
 * Time: 下午10:50
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('./db');

function Post(username, post, time){
    this.user = username;
    this.post = post;
    if(time){
        this.time = time;
    }else{
        this.time = new Date();
    }
}

module.exports  = Post;

Post.prototype.save = function save(callback){
    // 存入mongodb的文档
    var post = {
        user : this.user,
        post : this.post,
        time : this.time
    };

    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        // 读取 posts 集合
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            // 为 user 属性添加索引
            collection.ensureIndex('user');
            // 写入 posts 文档
            collection.insert(post, {safe:true}, function(err, post){
                mongodb.close();
                callback(err, post);
            })
        })
    })
}

Post.get = function get(username, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(username){
                query.user = username;
            }
            collection
                .find(query)
                .sort({time:-1})
                .toArray(function(err, docs){
                    console.log(333,docs);
                    mongodb.close();
                    if(err){
                        callback(err, null);
                    }
                    var posts = [];
                    docs.forEach(function(doc, index){
                        var post = new Post(doc.user, doc.post, doc.time);
                        posts.push(post);
                    });
                    callback(null, posts);
                });
        })
    })
}