$(document).ready(function(){
    createGrid(125);
    loadPeople();
});

$(window).resize(function() {
    createGrid(125);
});

$(document).on('click','.member_cell', function(){
    var id = $(this).attr('data-id'),
        x = $(this).attr('data-x'),
        y = $(this).attr('data-y');

    var member;
    for(var i = 0; i < people.length; ++i) {
        if(people[i].id == id) {
            member = people[i];
        }
    }

    var $cellLeft = $('.cell[data-x="' + x + '"][data-y="' + (y-1) + '"]');
    console.log("left cell", $cellLeft);

    var $cellRight = $('.cell[data-x="' + x + '"][data-y="' + (parseInt(y, 10)+1) + '"]');
    console.log("right cell", $cellRight);

    var $cellAbove = $('.cell[data-x="' + (x-1) + '"][data-y="' + y + '"]');
    console.log("above cell", $cellAbove);

    var template = $('#member-template-info').html();
    var rendered = Mustache.render(template, {member: member});
    $cellLeft.html(rendered).addClass('member_cell_' + id);
    $cellLeft.flip({trigger: 'manual'});
    setTimeout(function() { $cellLeft.flip(true) }, 50);

    template = $('#member-template-links').html();
    rendered = Mustache.render(template, {member: member});
    $cellRight.html(rendered).addClass('member_cell_' + id);
    $cellRight.flip({trigger: 'manual'});
    setTimeout(function() { $cellRight.flip(true) }, 50);

    template = $('#member-template-skills').html();
    rendered = Mustache.render(template, {member: member});
    $cellAbove.html(rendered).addClass('member_cell_' + id);
    $cellAbove.find('[data-toggle="popover"]').popover();
    $cellAbove.flip({trigger: 'manual'});
    setTimeout(function() { $cellAbove.flip(true) }, 50);
});

var people = [];
function loadPeople() {
    $.getJSON( "/people", function(data) {
      people = data;
      createGrid(125);
    });
}

function generatePeoplePositions(cellsInRow, cellsInColumn) {
    for(var i = 0; i < people.length; ++i) {
        var iter = 0, ok;
        do {
            ++iter;
            people[i].x = randomIntFromInterval(1, cellsInRow - 2);
            people[i].y = randomIntFromInterval(1, cellsInColumn - 2);

            ok = true;
            for(var j = 0; j < i; ++j) {
                var diffX = Math.abs(people[j].x - people[i].x);
                var diffY = Math.abs(people[j].y - people[i].y);
                if(diffX == 1 && diffY == 1) continue;
                if(diffX <= 1 && diffY <= 1) {
                    // console.log(people[i].x, people[i].y, people[j].x, people[j].y);
                    ok = false;
                    break;
                }
            }
        } while (!ok && iter < 100)
    }
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

    generatePeoplePositions(cellsInRow, cellsInColumn);

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
        $cell.flip({ trigger: 'hover' });
    };
}


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min)+min);
}
