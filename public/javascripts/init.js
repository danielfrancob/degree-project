(function(){
    $(document).ready(function(){
        $('.button-collapse').sideNav({
            menuWidth:180
        });
        
        $('select').material_select();
        
        $('.dropdown-button').dropdown({
            aligment:'left'
        });
        
        $('.modal-trigger').leanModal({
            dismissible:false
        });
        
        $('.tooltipped').tooltip({delay: 50});

        $('.carousel.carousel-slider').carousel({full_width: true});
    });
})();