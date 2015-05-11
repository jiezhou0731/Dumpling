
/*
  black overlay, scene.
<div class="andrew-overlay">
	<div class="andrew-overlay-scene">
		// scene here;
	</div>
</div>
<script>
$(".andrew-overlay").trigger('andrew_overlay_hide');
$(".andrew-overlay").trigger('andrew_overlay_show');
</script>
 */
$(window).resize(function(){
	$(".andrew-overlay").height($(window).height());
	$(".andrew-overlay").width($(window).width());
	margin_top=($(window).height()-$(".andrew-overlay-scene").height())/2;
	if (margin_top<0) margin_top=0;
	$(".andrew-overlay-scene").css("margin-top",margin_top);
});
$(function(){
	
	$(".andrew-overlay").bind('andrew_overlay_hide',function(){
		$(".andrew-overlay").hide();
	});
	$(".andrew-overlay").trigger('andrew_overlay_hide');
	$(".andrew-overlay").bind('andrew_overlay_show',function(){
		// stop scroll event propagate.
		$(this).find('.andrew-overlay-scene').on('wheel', function(e) {
		    var scene = $(this);
            height = scene.height()+30;
            scrollHeight = scene[0].scrollHeight;
		    scrollTop=scene.scrollTop();
		    var oEvent = e.originalEvent,
            	    d  = oEvent.deltaY || oEvent.wheelDelta;
		    if((scrollTop >= (scrollHeight - height) && d > 0) || (scrollTop === 0 && d < 0)) {
		      e.preventDefault();
		    }
		  });
		
		$("body").css("overflow", "hidden");
		if ($(".andrew-overlay-scene").height()<700) {
			$(".andrew-overlay-scene").css('height','700px');
		}
		margin_top=($(window).height()-$(".andrew-overlay-scene").height())/2;
		if (margin_top<0) margin_top=0;
		$(".andrew-overlay-scene").css("margin-top",margin_top);
		$(".andrew-overlay").show();
	});
	$(".andrew-overlay-scene").click(function(event) { 
	       event.stopPropagation();
	});
	$(".andrew-overlay").click(function(){
		$(".andrew-overlay").trigger('andrew_overlay_hide');
		$("body").css("overflow", "scroll");
	});
	$(".andrew-overlay-esc").click(function(){
		$(".andrew-overlay").trigger('andrew_overlay_hide');
		$("body").css("overflow", "scroll");
	});
});

/* End andrew-scene. */

