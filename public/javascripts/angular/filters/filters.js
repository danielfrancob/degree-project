angular
.module('filters',['ngSanitize'])
.filter('translate',function(){
    return function(input){
        var output = "";
        switch(input){
            case "common-base":
                output = "Base común";
                break;
            case "matching":
                output = "Correlación";
                break
            case "multiplechoice":
                output = "Opción múltiple";
                break;
            case "sorting":
                output = "Ordenamiento";
                break;
            case "true-false":
                output = "Verdadero - Falso";
                break;
            case "audio":
                output = "Audio";
                break
            case "image":
                output = "Imagen";
                break;
            case "text":
                output = "Texto";
                break;
            case "video":
                output = "Video";
                break;
            case "teacher":
                output = "Profesor";
                break;
            case "student":
                output = "Estudiante";
                break;
            case "complete":
                output = "Completa";
                break;
            case "incomplete":
                output = "Incompleta"
                break;
        }
        return output;
    }
})
.filter('to_trusted',function($sce){
    return function(text){
        return $sce.trustAsHtml(text);
    }
});