//equalHeight function
function equalHeight(group) {
	var tallest = 0;
	group.each(function() {
		var thisHeight = $(this).height();
		if(thisHeight > tallest) {
			tallest = thisHeight;
		}
	});
	group.height(tallest);
}


//On page load 
$(function() {

	//Popovers - footer
	$('.map-label').toggle(function(){
        $('#contacts').fadeIn();
	}, function(){
		$('#contacts').fadeOut();
	});
	
	//shadow on boxes
	$('.box').shadow('lifted');
	$('.shadow').shadow('lifted');

	//translation
	$('.translation').click(function(){
		$('.lang').after('<div id="MicrosoftTranslatorWidget" class="translation-box"></div>');
		setTimeout(function() { 
			var s = document.createElement("script"); 
			s.type = "text/javascript"; 
			s.charset = "UTF-8"; 
			s.src = ((location && location.href && location.href.indexOf('https') == 0) ? "https://ssl.microsofttranslator.com" : "http://www.microsofttranslator.com" ) + "/ajax/v2/widget.aspx?mode=manual&from=bg&layout=ts"; 
			var p = document.getElementsByTagName('head')[0] || document.documentElement; p.insertBefore(s, p.firstChild); 
		}, 0); 
	});
	
	//fix menu on hover (original effect is on click)
	$('.dropdown, .dropdown-submenu').hover(function(){
		$(this).children('.dropdown-menu').show();
		$(this).children('.dropdown-submenu').hide();
	},function(){
		$(this).children('.dropdown-menu').hide();
		$(this).children('.dropdown-submenu').show();
	});
	$('.dropdown-menu').hover(
		function(){
			$(this).parent('li').addClass('active');
		},
		function(){
			$(this).parent('li').removeClass('active');
		}
	);

	
	
});
