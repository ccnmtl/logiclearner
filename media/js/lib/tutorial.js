jQuery(document).ready(function(){
    jQuery('.tutorial-prompt').click(function() {
        var segment = jQuery(this).data('segment');
        var segmentClass = 'tutorial-' + segment;
        var segmentGuide = '#guide-' + segment;
        var segmentLocation = '#helper-' + segment;
        jQuery('#tutorial-container').attr('class', segmentClass);
        jQuery('.guide__box').hide();
        jQuery(segmentGuide).show();
        jQuery('html, body').animate({
            scrollTop: jQuery(segmentLocation).offset().top - 200
        },'fast');
    });
    jQuery('.tutorial-close').click(function() {
        jQuery('.guide__box').hide();
        jQuery('#tutorial-container').removeClass();
    });
});