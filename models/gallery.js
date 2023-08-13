var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Gallery = new Schema({
    name:String,
    type:String,
    path:String,
    url:String,
    text:String,
    status:{type:String,default:'available'},
    owner:{type:Schema.Types.ObjectId,ref:'User'}
});

Gallery.statics.create = function(data,user,callback){
    data.owner = user;
    new_item = new this(data);
    new_item.save(function(err,saved){
        callback(err,saved);
    }); 
}

Gallery.statics.update = function(data,callback){
    this.findByIdAndUpdate(data._id,{$set:data},function(err){
        callback(err);
    });
}

Gallery.statics.delete = function(id,callback){
    this.findById(id,function(err,item){
        if(err){
            callback(err);
        }else{
            item.status = 'deleted';
            item.save(callback);
        }
    });
}
    
Gallery.statics.getUserGallery = function(user,callback){
    this.find({owner:user,status:'available'},{'name':1,'type':1,'url':1,'text':1},function(err,data){
        callback(err,data);
    });
}

Gallery.statics.getItem = function(id,callback){
    this.findById(id,{'name':1,'type':1,'path':1,'url':1,'text':1},function(err,data){
        callback(err,data);
    });
}


module.exports = mongoose.model('Gallery',Gallery,'Gallery');