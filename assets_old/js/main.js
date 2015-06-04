;(function(){

	// Menu settings
	$('#menuToggle, .menu-close').on('click', function(){
		$('#menuToggle').toggleClass('active');
		$('body').toggleClass('body-push-toleft');
		$('#theMenu').toggleClass('menu-open');
		$('.listing_container, .image_slider, .home_container, .show_pg_content').toggleClass('opacity_01');
		// $('.topbar, .image_slider, .home_container').toggleClass('side_menu_opened');

	});
	$(".fa-search").on('click',function(){
		$(".seach_field").toggle();
	});
	$('.page_refresh').click(function() {
	    location.reload();
	});
	$('select').change( function() {
	  location.href = $(this).val();
	});
	$('.popup_close_btn').on('click', function(){
		$('.popup').hide();
	});
	setTimeout(function(){
		$('.popup').hide();
	},5000); // 3 seconds.

})(jQuery)

