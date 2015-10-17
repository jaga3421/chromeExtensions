/*
* yoda.js
*
* @project:    Yoda Chrome Extension
* @date:       2015-13-Aug
* @author:     Jagadeesh Jayachandran, jjayachandran2@sapient.com;
* @namespaces: yoda
*
*/
var yoda = window.yoda || {};
yoda.handTracking = (function (window, $, namespace) {
    // public methods
    var init,
    //private methods
    _createView,
    //private properties
    _clsInactive = 'inactive',
    _flagFirstTime = true, // has the user already activated it once ?
    _yodaPanel,
    _yodaTitle,
    _yodaClose;

    _createView = function(){
        $('body').append('<div class="yoda-panel inactive"></div>');
        _yodaPanelInactive = $('.yoda-panel.inactive'),
        _yodaPanel = $('.yoda-panel');

        _yodaPanel.append('<div class="yodaHeader"><span class="title">Jedi Mode</span><span class="mode">Toggle</span"></div>');
        //_yodaPanel.append('<canvas id="yodaCamera"></canvas>');
        _yodaTitle = $('.yoda-panel .yodaHeader');
        _yodaIndicator = $('.yoda-panel .yodaHeader .mode');


        _bindEvents();
    };

    _bindEvents = function() {

        // 01 : Toggle JEDI mode
        $(_yodaTitle).on('click',function(){
            if(_yodaPanel.hasClass(_clsInactive)){
                //switch to jedi Mode
                _jediModeON();
            }
            else {
                //switch off jedi Mode
                _jediModeOFF();
            }
        });

        
    }

    _jediModeON = function() {
        _yodaPanel.removeClass(_clsInactive);
        // http://stackoverflow.com/questions/11803215/how-to-include-multiple-js-files-using-jquery-getscript-method
        if(_flagFirstTime){
           _flagFirstTime = false;  
           _activateTracking();    
        }
        else {
           _activateTracking();
        }
    };

    _activateTracking = function() {

        var canvas = $('<canvas id="yodaCamera">').get(0),
            context = canvas.getContext('2d'),
            video = document.createElement('video'),
            fist_pos_old,
            detector;
        
        //document.getElementsByTagName('body')[0].appendChild(canvas);
        _yodaPanel.append(canvas);
        
        try {
            compatibility.getUserMedia({video: true}, function(stream) {
                try {
                    video.src = compatibility.URL.createObjectURL(stream);
                } catch (error) {
                    video.src = stream;
                }
                compatibility.requestAnimationFrame(play);
            }, function (error) {
                console.log("WebRTC not available");
            });
        } catch (error) {
            console.log(error);
        }
        
        function play() {
            compatibility.requestAnimationFrame(play);
            if (video.paused) video.play();
            
            if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
                
                /* Prepare the detector once the video dimensions are known: */
                if (!detector) {
                    var width = ~~(80 * video.videoWidth / video.videoHeight);
                    var height = 80;
                    detector = new objectdetect.detector(width, height, 1.1, objectdetect.handfist);
                }
            
                /* Draw video overlay: */
                canvas.width = ~~(100 * video.videoWidth / video.videoHeight);
                canvas.height = 100;
                context.drawImage(video, 0, 0, canvas.clientWidth, canvas.clientHeight);
                
                var coords = detector.detect(video, 1);
                if (coords[0]) {
                    var coord = coords[0];
                    
                    /* Rescale coordinates from detector to video coordinate space: */
                    coord[0] *= video.videoWidth / detector.canvas.width;
                    coord[1] *= video.videoHeight / detector.canvas.height;
                    coord[2] *= video.videoWidth / detector.canvas.width;
                    coord[3] *= video.videoHeight / detector.canvas.height;
                
                    /* Find coordinates with maximum confidence: */
                    var coord = coords[0];
                    for (var i = coords.length - 1; i >= 0; --i)
                        if (coords[i][4] > coord[4]) coord = coords[i];
                    
                    /* Scroll window: */
                    var fist_pos = [coord[0] + coord[2] / 2, coord[1] + coord[3] / 2];
                    if (fist_pos_old) {
                        var dx = (fist_pos[0] - fist_pos_old[0]) / video.videoWidth,
                                dy = (fist_pos[1] - fist_pos_old[1]) / video.videoHeight;
                        
                            window.scrollBy(dx * 200, dy * 200);
                    } else fist_pos_old = fist_pos;
                    
                    /* Draw coordinates on video overlay: */
                    context.beginPath();
                    context.lineWidth = '2';
                    context.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    context.fillRect(
                        coord[0] / video.videoWidth * canvas.clientWidth,
                        coord[1] / video.videoHeight * canvas.clientHeight,
                        coord[2] / video.videoWidth * canvas.clientWidth,
                        coord[3] / video.videoHeight * canvas.clientHeight);
                    context.stroke();
                } else fist_pos_old = null;
            }
        }
    }

    _jediModeOFF = function() {
        _yodaPanel.addClass(_clsInactive);
    }

    init = function () {
        console.log('hi')
        _createView();
    };
    return {
        init: init
    }; 

}(this, jQuery, 'yoda'));
jQuery(yoda.handTracking.init());
