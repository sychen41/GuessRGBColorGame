$('li').on('click', function(){
	$(this).toggleClass('completed');
});

$('span').on('click',function(event){
	$(this).parent().fadeOut(500, function(){ //$(this).parent() refer to li
		$(this).remove(); //$(this) is now the li
	});
	event.stopPropagation();
});