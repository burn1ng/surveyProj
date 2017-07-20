$(document).ready(function() {
    console.log("Document ready!");

    //tabs on about-page
    $('#about-page-tabs a').click(function(e) {
        e.preventDefault()
        $(this).tab('show')
    });

    //file-input on new-survey-admin-page
    $(':file').on('fileselect', function(event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });


    // input-rage slider init
    $("#rageInputSlider1").slider({
        tooltip: 'always'
    });


    // listeners for prev and next buttons
    $('.prev-page').click(function() {
        $('.nav-pills > .active').prev('li').find('a').trigger('click');
    });

    $('.next-page').click(function() {
        $('.nav-pills > .active').next('li').find('a').trigger('click');
    });

    // listeners for radio inputs
    $('#summaryInfoView').parent().on("click", function() {
        location.href = "survey-results-admin.html";
    });
    $('#byUserInfoView').parent().on("click", function() {
        location.href = "survey-results-by-user-admin.html";
    });

    // change the caret direction
    $('.sortable').click(function() {
        $(this).toggleClass('dropup');
    });

    // $('.next-page').click(function(){
    //     $('.nav-pills > .active').next('li').find('a').trigger('click');
    // });
    // $("#menu-toggle").click(function(e) {
    //     e.preventDefault();
    //     $(body).toggleClass("toggled");
    // });

    // if($(document).height() <= $(window).height())
    //     $("footer.footer").addClass("navbar-fixed-bottom");

    // $('.page-wrapper').addClass("toggled");

});