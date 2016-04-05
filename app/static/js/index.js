$(document).ready(function(){
    createGrid(125);
    loadPeople();
});

$(window).resize(function() {
    createGrid(125);
});

$(document).on('click','.member_cell', function(){
    if($('.close-card').length > 0) {
        // some other card is opened, wait until animations complete before starting this one
        $('.close-card').click();

        var self = this;
        setTimeout(function () {
            onMemberCellClick.call(self);
        }, 300);
    } else {
        onMemberCellClick.call(this);
    }
});

function findFirstAvailableCell(x, y) {
    var dx = [-1, -1, 1, 1];
    var dy = [1, -1, 1, -1];

    var $cell;
    for(var i = 0; i < 4; ++i) {
        $cell = $('.cell[data-x="' + (x+dx[i]) + '"][data-y="' + (y+dy[i]) + '"]');
        if(!$cell.hasClass('member_cell') && !$cell.hasClass('member_info_cell')) {
            break;
        }
    }

    return $cell;
}

function onMemberCellClick() {
    var id = $(this).attr('data-id'),
        x = parseInt($(this).attr('data-x'), 10),
        y = parseInt($(this).attr('data-y'), 10),
        $cell = $(this);

    var member;
    for(var i = 0; i < people.length; ++i) {
        if(people[i].id == id) {
            member = people[i];
        }
    }

    trackView(member);

    var $cellLeft, $cellRight, $cellAbove, $cellUnder;
    $cellLeft = $('.cell[data-x="' + x + '"][data-y="' + (y-1) + '"]');
    if($cellLeft.hasClass('member_cell') || $cellLeft.hasClass('member_info_cell')) {
        $cellLeft = findFirstAvailableCell(x, y);
    }
    openCell($cellLeft, '#member-template-info', member);

    $cellRight = $('.cell[data-x="' + x + '"][data-y="' + (y+1) + '"]');
    if($cellRight.hasClass('member_cell') || $cellRight.hasClass('member_info_cell')) {
        $cellRight = findFirstAvailableCell(x, y);
    }
    openCell($cellRight, '#member-template-links', member);

    $cellAbove = $('.cell[data-x="' + (x-1) + '"][data-y="' + y + '"]');
    if($cellAbove.hasClass('member_cell') || $cellAbove.hasClass('member_info_cell')) {
        $cellAbove = findFirstAvailableCell(x, y);
    }
    openCell($cellAbove, '#member-template-skills', member);

    $cellUnder = $('.cell[data-x="' + (x+1) + '"][data-y="' + y + '"]');
    if($cellUnder.hasClass('member_cell') || $cellUnder.hasClass('member_info_cell')) {
        $cellUnder = findFirstAvailableCell(x, y);
    }
    openCell($cellUnder, '#member-template-vote', member);

    var options = {
        placement: function (context, source) {
            var position = $(source).position();

            if (position.left > 515) {
                return "auto left";
            }

            if (position.left < 515) {
                return "auto right";
            }

            if (position.top < 110){
                return "auto bottom";
            }

            return "auto top";
        }
        ,
        trigger: "hover"
    };

    $cellAbove.find('[data-toggle="popover"]')
    .popover(options)
    .data("bs.popover")
    .tip()
    .addClass('custom-popover custom-popover-' + id);

    var template = $('#member-template-close').html();
    var rendered = Mustache.render(template, {member: member});
    $cell.off('.flip');
    $cell.html(rendered);
    $cell.find('.close-card').click(function(event) {
        event.stopPropagation();
        closeCell($cellUnder, id);
        closeCell($cellAbove, id);
        closeCell($cellLeft, id);
        closeCell($cellRight, id);
        // createGrid(125, false);
        // $cell.html('');
        $cell.replaceWith($cell.clone());
        // $cell.replaceWith("<div class='cell' data-x=" + member.x + " data-y=" + member.y + " style='width: 124px; height: 124px;'></div>");
        renderMemberCell(member);
    })
}

function openCell($cell, templateId, member) {
    var template = $(templateId).html();
    var rendered = Mustache.render(template, {member: member});

    $cell.html(rendered).addClass('member_info_cell member_cell_' + member.id);
    $cell.flip({trigger: 'manual', speed: 200});
    setTimeout(function() { $cell.flip(true) }, 50);
}

function closeCell($cell, memberId) {
    $cell.removeClass('member_info_cell member_cell_'  + memberId);
    $cell.flip(false);
    $cell.on('flip:done',function(){
        $(this).html('');
        $(this).replaceWith($(this).clone());
    });
}

var people = [];
function loadPeople() {
    $.getJSON( "/people", function(data) {
      people = data;
      createGrid(125);
    });
}

function trackView(member) {
    $.post( "/upvote/" + member.id, function(data) {
        // console.log(data);
    });
}

function generatePeoplePositions(cellsInRow, cellsInColumn) {
    for(var i = 0; i < people.length; ++i) {
        var iter = 0, ok;
        do {
            ++iter;
            people[i].x = randomIntFromInterval(1, cellsInRow - 2);
            people[i].y = randomIntFromInterval(1, cellsInColumn - 2);

            if(people[i].x == 1 && people[i].y < 3) {
                ok = false;
                continue;
            }

            ok = true;
            for(var j = 0; j < i; ++j) {
                var diffX = Math.abs(people[j].x - people[i].x);
                var diffY = Math.abs(people[j].y - people[i].y);
                // if(diffX == 1 && diffY == 1) continue;
                if(iter < 100) {
                    if(diffX <= 1 && diffY <= 1) {
                        // console.log(people[i].x, people[i].y, people[j].x, people[j].y);
                        ok = false;
                        break;
                    }
                } else {
                    if(diffX == 0 && diffY == 0) {
                        ok = false;
                        break;
                    }
                }
            }
        } while (!ok && iter < 200)
    }
}



function createGrid(size, randomizePositions) {
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

    if(randomizePositions || typeof(randomizePositions) === 'undefined') {
        generatePeoplePositions(cellsInRow, cellsInColumn);
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
        renderMemberCell(member);
    };
}

function renderMemberCell(member) {
    var $cell = $('.cell[data-x="' + member.x + '"][data-y="' + member.y + '"]');
    $cell.addClass('member_cell member_cell_' + member.id);
    $cell.attr('data-id', member.id);
    var template = $('#member-template').html();
    var rendered = Mustache.render(template, {member: member});
    $cell.html(rendered);
    $cell.flip({ trigger: 'hover' });
}


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min)+min);
}
