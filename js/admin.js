$(function() {

    //jQuery

    // Delete database entries on click
    $(".delete").click(function() {

        var classes = $(this).attr('class').split(" ");
        var table = classes[classes.length - 1];

        $.post("newAdmin.php", {id: $(this).attr('id'), table: table}, function(response) {

            location.reload();

        })
        
    });


    $(".add").click(function() {

        addOrUpdateDatabase($(this));

    });

    $(".update").click(function() {

        addOrUpdateDatabase($(this));

    });

    $("input").datepicker({

        dateFormat: "yy-mm-dd"

    });

    function addOrUpdateDatabase(eventFiringElement) {

        var table = $(eventFiringElement).attr('id');
        var parentClass = "div." + table;

        var textareas = $(eventFiringElement).parents(parentClass).find('textarea, input');

        var postObject = {table: $(eventFiringElement).attr('id')};

        $(textareas).each(function(textarea) {

            postObject[$(this).attr('id')] = $(this).val();

        })
        
        $.post("newAdmin.php", postObject, function() {

            location.reload();

        })

    };
});