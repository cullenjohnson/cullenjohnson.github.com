// jQuery content slider
// modified by Cullen Johnson
// Original script at: http://fearlessflyer.com/2010/08/how-to-create-your-own-jquery-content-slider/

$(window).load( function() {
	var slider = $('.slider').first()
	var panel_list = $('.slider_panel')
	
	var ANIMATION_NS = 500;
	
	//do some width calculations
	var panel_width = panel_list.first().width()
	var total_width = (panel_width + 10) * panel_list.length
	
	//create slider window
	$('.slider').wrap('<div class="slider_window" />')
	
	//re-style everything
	$('.slider_window').css({
		overflow: 'hidden',
		width: function() {
			return panel_width + 5;
		}, 
		height: panel_list.first().height()
	});
	
	$(panel_list).css('width', panel_width)
	$(slider).css('width', total_width)
	
	//for each panel...
	$('.slider_panel').each(
		function(i){
		//for each link, bind the click event.
		$(this).children('a')
			.bind("click", function(){
			
				//if the link is of the class 'next'...
				if($(this).is(".next"))	{
					slider = $(this).parent('div').parent('div');
					$(slider).animate({
						"left": (-(i + 1) * panel_width)		
							}, 
						ANIMATION_NS
					)
				} 
				
				//if the link is of the class 'previous'...
				else if($(this).is(".previous")){
					$(slider).animate({
							"left": (-(i - 1) * panel_width)	
						},
						ANIMATION_NS
					)
				}
				
				//if the link is of the class 'startover'...
				else if($(this).is(".startover")){
					$(slider).animate(
						{
							"left": (0)				
						}, 
						ANIMATION_NS
					)
			}
			});//close .bind()							 
		});//close .each()
});