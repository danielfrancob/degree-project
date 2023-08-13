angular
.module('text-editor',['ngWig'])
.config(['ngWigToolbarProvider',function(ngWigToolbarProvider){
    ngWigToolbarProvider.setButtons([]);
    ngWigToolbarProvider.addCustomButton('text-h1','btn-h1');
    ngWigToolbarProvider.addCustomButton('text-h2','btn-h2');
    ngWigToolbarProvider.addCustomButton('text-h3','btn-h3');
    ngWigToolbarProvider.addCustomButton('text-h4','btn-h4');
    ngWigToolbarProvider.addCustomButton('text-h5','btn-h5');
    ngWigToolbarProvider.addCustomButton('text-h6','btn-h6');
    ngWigToolbarProvider.addCustomButton('text-p','btn-p');
    ngWigToolbarProvider.addStandardButton('bold','Bold','bold','fa-bold');
    ngWigToolbarProvider.addStandardButton('italic','Italic','italic','fa-italic'); 
    ngWigToolbarProvider.addStandardButton('underline', 'Underline', 'underline', 'fa-underline');
    ngWigToolbarProvider.addStandardButton('strikeThrough', 'strikeThrough', 'strikeThrough', 'fa-strikethrough');
    ngWigToolbarProvider.addStandardButton('justifyLeft','Left','justifyLeft','fa-align-left');
    ngWigToolbarProvider.addStandardButton('justifyCenter','Center','justifyCenter','fa-align-center');
    ngWigToolbarProvider.addStandardButton('justifyRight','Right','justifyRight','fa-align-right');
    ngWigToolbarProvider.addStandardButton('justifyFull','Justify','justifyFull','fa-align-justify');
    ngWigToolbarProvider.addStandardButton('insertorderedlist','Ordered List','insertorderedlist','fa-list-ol');
    ngWigToolbarProvider.addStandardButton('insertHorizontalRule','Add Horizontal Rule','insertHorizontalRule','fa-arrows-h');
    ngWigToolbarProvider.addStandardButton('outdent','Outdent','outdent','fa-outdent');
    ngWigToolbarProvider.addStandardButton('indent','Indent','indent','fa-indent');
    ngWigToolbarProvider.addStandardButton('undo','Undo','undo','fa-undo');
    ngWigToolbarProvider.addStandardButton('redo','Redo','redo','fa-repeat');
}])
.component('btnH1',{
    bindings: {
        execCommand: '=',
        editMode: '=',
        disabled: '='
    },
    template:'<button class="nw-button btn-text-h1" title="Text Size" ng-click="$ctrl.execCommand(\'formatblock\',\'h1\');">H1</button>',
    controller:function($scope){}
})
.component('btnH2',{
    bindings: {
        execCommand: '=',
        editMode: '=',
        disabled: '='
    },
    template:'<button class="nw-button btn-text-h2" title="Text Size" ng-click="$ctrl.execCommand(\'formatblock\',\'h2\');">H2</button>',
    controller:function($scope){}
})
.component('btnH3',{
    bindings: {
        execCommand: '=',
        editMode: '=',
        disabled: '='
    },
    template:'<button class="nw-button btn-text-h3" title="Text Size" ng-click="$ctrl.execCommand(\'formatblock\',\'h3\');">H3</button>',
    controller:function($scope){}
})
.component('btnH4',{
    bindings: {
        execCommand: '=',
        editMode: '=',
        disabled: '='
    },
    template:'<button class="nw-button btn-text-h4" title="Text Size" ng-click="$ctrl.execCommand(\'formatblock\',\'h4\');">H4</button>',
    controller:function($scope){}
})
.component('btnH5',{
    bindings: {
        execCommand: '=',
        editMode: '=',
        disabled: '='
    },
    template:'<button class="nw-button btn-text-h5" title="Text Size" ng-click="$ctrl.execCommand(\'formatblock\',\'h5\');">H5</button>',
    controller:function($scope){}
})
.component('btnH6',{
    bindings: {
        execCommand: '=',
        editMode: '=',
        disabled: '='
    },
    template:'<button class="nw-button btn-text-h6" title="Text Size" ng-click="$ctrl.execCommand(\'formatblock\',\'h6\');">H6</button>',
    controller:function($scope){}
})
.component('btnP',{
    bindings: {
        execCommand: '=',
        editMode: '=',
        disabled: '='
    },
    template:'<button class="nw-button btn-text-p" title="Text Size" ng-click="$ctrl.execCommand(\'formatblock\',\'p\');">P</button>',
    controller:function($scope){}
});