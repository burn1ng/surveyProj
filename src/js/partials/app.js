$(document).ready(function() {
    console.log("Document ready!");

    $('#about-page-tabs a').click(function(e) {
        e.preventDefault()
        $(this).tab('show')
    });

    // $("#menu-toggle").click(function(e) {
    //     e.preventDefault();
    //     $(body).toggleClass("toggled");
    // });

    // if($(document).height() <= $(window).height())
    //     $("footer.footer").addClass("navbar-fixed-bottom");

    // $('.page-wrapper').addClass("toggled");

});
