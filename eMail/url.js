var tablink;
chrome.tabs.getSelected(null,function(tab) {
    tablink = tab.url;
    jQuery('.url').html(tablink);
    var src = 'http://imajination.in/poc/email.php?url='+tablink;
    var ifr = '<iframe src="'+src+'"  width="100%" height="300px" frameborder="0" scrolling="no" onload="javascript:loaded();"></iframe>'
    jQuery('.iframe').html(ifr);
    window.setTimeout(function(){
    	jQuery('.overlay').fadeOut();
    },2000)
    
});
function loaded() {    	
    	jQuery('.overlay').fadeOut();
    }
