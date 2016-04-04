$(document).ready(function(){
    createGrid(125);
});

$(window).resize(function() {
    createGrid(125);
});

$(document).on('mouseenter','.my-elements', function(){
   //picture
}).on('mouseleave','.my-elements', function(){
    //render template
});


function createGrid(size) {
    var ratioW = Math.floor($(window).width()/size),
        ratioH = Math.floor($(window).height()/size);

    $('.container').html('');
    
    var parent = $('<div />', {
        width: ratioW  * size + size, 
        height: ratioH  * size + size
    }).addClass('grid').appendTo('.container');

    var leftoverSize = ratioW * size % (size -1);

    var people = [
    	{id: 1, first_name: 'Sven', last_name: 'Vidak', x: 2, y: 5},
    	{id: 2, first_name: 'Arijana', last_name: 'Brlek', x: 2, y: 6},
    	{id: 3, first_name: 'Marko', last_name: 'Sertić', x: 2, y: 7},
    	{id: 4, first_name: 'Nino', last_name: 'Uzelac', x: 2, y: 8},
    ];

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
    	$cell.addClass('member_cell_' + member.id);
        var template = $('#member-template').html();
        var rendered = Mustache.render(template, {member: member});
        $cell.html(rendered);
        $cell.flip({ trigger: 'hover' });
    };
}


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min)+min);
}
