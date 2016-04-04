function createGrid(size) {
    var ratioW = Math.floor($(window).width()/size),
        ratioH = Math.floor($(window).height()/size);

    $('.container').html('');
    
    var parent = $('<div />', {
        width: ratioW  * size + size, 
        height: ratioH  * size + size
    }).addClass('grid').appendTo('.container');

    var leftoverSize = ratioW * size % (size -1);

    for (var i = 0; i < ratioH + 1; i++) {
        for(var p = 0; p < ratioW + 1; p++){
            $('<div />', {
                width: size - 1, 
                height: size - 1
            }).addClass('cell').appendTo(parent);
        }
    }
}

createGrid(125);

$(window).resize(function() {
	createGrid(125);
});
