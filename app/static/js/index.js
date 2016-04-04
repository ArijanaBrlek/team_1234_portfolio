$(document).ready(function(){
    loadPeople();
    createGrid();
});

$(window).resize(function() {
    createGrid(125);
});

// $(document).on('mouseenter','.member_cell', function(){
//     var id = $(this).attr('data-id');

//     var member;
//     for(var i = 0; i < people.length; ++i) {
//         if(people[i].id == id) {
//             member = people[i];
//         }
//     }

//     var template = $('#member-picture-template').html();
//     var rendered = Mustache.render(template, {member: member});
//     $(this).html(rendered);
// }).on('mouseleave','.member_cell', function(){
//     //render template
// });

var people = [];
function loadPeople() {
    $.getJSON( "/people", function(data) {
      people = data;
      createGrid(125);
    });
}





function createGrid(size) {
    var ratioW = Math.floor($(window).width()/size),
        ratioH = Math.floor($(window).height()/size);

    $('.container').html('');

    var parent = $('<div />', {
        width: ratioW  * size + size,
        height: ratioH  * size + size
    }).addClass('grid').appendTo('.container');

    var leftoverSize = ratioW * size % (size -1);

    var cellsInRow = ratioH + 1;
    var cellsInColumn = ratioW + 1;

    // @TODO: make sure generated positions are unique
    for(var i = 0; i < people.length; ++i) {
        people[i].x = randomIntFromInterval(1, cellsInRow - 1);
        people[i].y = randomIntFromInterval(1, cellsInColumn - 1);
    }

    for (var i = 0; i < cellsInRow; i++) {
        for(var p = 0; p < cellsInColumn; p++){
            $('<div />', {
                width: size - 1,
                height: size - 1
            }).addClass('cell')
            .attr("data-x", i)
            .attr("data-y", p)
            .appendTo(parent);
        }
    }

    for (var i = people.length - 1; i >= 0; i--) {
        var member = people[i];
        var $cell = $('.cell[data-x="' + member.x + '"][data-y="' + member.y + '"]');
        $cell.addClass('member_cell member_cell_' + member.id);
        $cell.attr('data-id', member.id);
        var template = $('#member-template').html();
        var rendered = Mustache.render(template, {member: member});
        $cell.html(rendered);
    };
}


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min)+min);
}
