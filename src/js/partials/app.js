$(document).ready(function() {
    console.log("Document ready!");

    $('#about-page-tabs a').click(function(e) {
        e.preventDefault()
        $(this).tab('show')
    })
});
