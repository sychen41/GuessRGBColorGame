$('ul').on('click', 'li', function(){
	$(this).toggleClass('completed');
});

$('ul').on('click', 'span', function(event){
	$(this).parent().fadeOut(500, function(){ //$(this).parent() refer to li
		$(this).remove(); //$(this) is now the li
	});
	event.stopPropagation();
});

$('input[type="text"]').keypress(function(event){
	if (event.which === 13) {
		//append the new todo string to ul
		$('ul').append('<li><span class="fa fa-trash"></span> ' + $(this).val() + '</li>');
		//remove the input text
		$(this).val('');
	}
});

$('.fa-plus').click(function(){
	$('input').fadeToggle();
});