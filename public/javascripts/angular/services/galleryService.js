angular
.module('gallery-service',['ui.materialize','text-editor','ngFileUpload','LocalStorageModule'])
.service('galleryService',function($http,$timeout,localStorageService,Upload){
    var that = this;
    this.current = null;

    this.getGallery = function(callback){
        $http.get('/gallery/data')
        .success(function(gallery){
            callback(null,gallery);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.update = function(item,callback){
        $http.put('/gallery/data/'+item._id,{item:item})
        .success(function(response){
            callback(null);
        })
        .error(function(error){
            callback(error);
        });   
    }

    this.uploadText = function(item,callback){
        if(that.current != null){
            var data = {
                _id:item._id,
                name:item.name,
                text:item.text
            }

            that.update(data,callback);
        }else{
            var data = {
                name:item.name,
                text:item.text
            }

            $http.post('/gallery/upload/text',{item:data})
            .success(function(response){
                callback(null);
            })
            .error(function(error){
                callback(error);
            });
        }
    }

    this.uploadFile = function(file){
        file.upload = Upload.upload({
            url:"/gallery/upload/files",
            data:{
                file:file,
                customName:file.customName
            }
        });
        file.upload.then(function(response){
            $timeout(function(){
                file.result = response.data;
            });
        },function(response){
            if(response.status > 0){
                file.result = 'error';
            }
        },function(evt){
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

    this.setCurrentItem = function(id){
        that.current = id;
        if(that.current != null){
            that.saveOnClient('g_current',that.current);
        }else{
            that.removeOnClient('g_current');
        }
    }

    this.getItemData = function(callback){
        if(this.current){
            $http.get('/gallery/data/'+that.current)
            .success(function(item){
                callback(null,item);
            })
            .error(function(error){
                callback(error);
            });
        }else{
            callback(null,null);
        }
    }

    this.deleteItem = function(item,callback){
        $http.delete('/gallery/data/'+item)
        .success(function(response){
            callback(null);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.saveOnClient = function(key,data){
        localStorageService.set(key,data);
    }

    this.removeOnClient = function(key){
        localStorageService.remove(key);
    }

    this.buildEnvironment = function(){
        that.current = localStorageService.get('g_current');
    }

    this.clearEnvironment = function(){
        localStorageService.clearAll();
    }

    that.buildEnvironment();
});