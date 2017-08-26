/***********************************************************************
* FILENAME : coordinate_tool.js 
* 
* LOADED BY : index.html 			PATH:../index.html
* 
*
* DESCRIPTION :
*       A tool for gernerating coordinates of points or label boxes on a loaded picture. 
*       User left click on the picture, it will appears 3 boxes which are create point, 
*				create box and canle the operating.
*       Once the point or the lable box has been created, the coordinates of them will show
*				up in the textareas down bellow the page.
*				User can copy the text to the xml file in order to config a new quiz more conveniency.
*
* PUBLIC FUNCTIONS :
*       drawBox(x,y) 
*       int     FM_DecompressFile( FileHandle )
*
* NOTES :
*       
*       The code needs to be supported by JqueryJS.
*
*    
* 
* AUTHOR :    Daming Zhang        START DATE :    14 Aug 2017
*
* LAST CHANGES : Daming Zhang     DATE : 23 Aug 2017
*
* 
*
**/


/**
  * @desc opens a modal window to display a message
  * @param string $msg - the message to be displayed
  * @return bool - success or failure
*/
$(document).ready(function(){

	// Preloading Images
	$.preloadImages = function() {
		for(var i = 0; i<arguments.length; i++) {
			$('<img>').attr('src', arguments[i]);
		}
	}
	$.preloadImages('images/logo_active.png');

	// Crypt Mail
	/*function UnCryptMailto(s)
	{
		var n = 0;
		var r = '';
		for( var i = 0; i < s.length; i++)
		{
			n = s.charCodeAt( i );
			if( n >= 8364)
				n = 128;
			r += String.fromCharCode( n - 1 );
		}
		return r;
	}*/
	//var key = 'nbjmnfAebsjpepnj/ef';
	//var emailHtml = '<a href="'+UnCryptMailto('nbjmup;') + UnCryptMailto(key)+'">' + UnCryptMailto(key) + '</a>';
	//$('.email').html(emailHtml);
	//$('#social a.feedback').attr('href', UnCryptMailto('nbjmup;') + UnCryptMailto(key));

	// Check if Browser has Flash activated
	var useFlash = false;
	try
	{
		var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
		if (fo)
		{	
			useFlash = true;
		}
	}
	catch (e)
	{
		if (navigator.mimeTypes
		&& navigator.mimeTypes['application/x-shockwave-flash'] != undefined
		&& navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
			useFlash = true;
		}
	}

	// Check if IE
	//if(navigator.appName.indexOf("Internet Explorer") != -1 || navigator.userAgent.toLowerCase().indexOf('msie') != -1)
		//useFlash = false;

	// deactivate flash switch if browser don't support flash or is IE
	if(useFlash == false)
		$('#flashUploadSwitch').hide();

	// Switch -> Flash Upload
	var uploadHtml5Drag = true;
	var uploadSwitchAllowed = true;
	$('#flashUploadSwitch').click(function(e) {
		if(uploadSwitchAllowed)
		{
			uploadSwitchAllowed = false;
			if(uploadHtml5Drag)
			{
				$('#uploadForm').slideUp(400, function() {
					$('#flashUploadSwitch').find('.flash').hide().next().show();
					$('#flashUpload').slideDown(400, function() {
						uploadHtml5Drag = false;
						uploadSwitchAllowed = true;
					});
				});
			} else {
				$('#flashUpload').slideUp(400, function() {
					$('#flashUploadSwitch').find('.flash').show().next().hide();
					$('#uploadForm').slideDown(400, function() {
						uploadHtml5Drag = true;
						uploadSwitchAllowed = true;
					});
				});
			}
		}
		e.preventDefault();
	});

	// Set Content Width exactly same with Navi Width
	var width = $('#navi ul').width() - $('#navi ul a').css('margin-left').split('px')[0] - $('#navi ul a').css('margin-right').split('px')[0];
	$('.infobox').width(width + 'px');

	// Top Navigation css and animation to slide up and down
	$('#navi a, a[rel^="#"]').click(function(e) {
		var current = $('#navi').attr('currentValue');
		var rel = $(this).attr('rel');
		$('#navi').attr('currentValue', rel);
		//if($(this).css('display') != 'block')
		$(current).slideUp(400, function() {
			$(rel).slideDown(400, function() {
				resizeHtml();
				if(rel == '#imagemap4posis')
					$('#dots').show();
			});
			resizeHtml();
		});
		if(current == '#imagemap4posis')
			$('#dots').hide();
		e.preventDefault();
	});

	// Logo
	$('#logo').hover(function() {
		$(this).attr('src', 'images/logo_active.png');
	}, function() {
		$(this).attr('src', 'images/logo.png');
	});

	resizeUploadContainer();

	// Set a coordinate point
	$('#mapContainer').click(function(e) {
		setCoordinates(e, 1);
		e.preventDefault();
	});

	// The button of changing a new image 
	$('#newUpload span, .textareaButton3').click(function(e) {
		// $('#dots').hide();
		// $('#navi').attr('currentValue', '#upload');

  //       // scroll window top
  //       $('html, body').animate({ scrollTop: 0 }, 200);

  //       // change view
		// $('#imagemap4posis').slideUp(400, function() {
		// 	$('#upload').slideDown(400, function() {
		// 		resizeHtml();
		// 	});
		// });
		window.location.reload();
	});

	// When can't see an image, the tips slideDown
	$('#urlMessage a').click(function(e) {
		$('#dots').empty();
		$('#imagemap4posis #mapContainer').find('img').attr('src', '#');
		$('#navi').attr('currentValue', '#upload');
		$('#imagemap4posis').slideUp(400, function() {
			$('#upload').slideDown(400, function() {
				resizeHtml();
			});
			removeErrorMessage();
		});
		e.preventDefault();
	});

	// Upload picture 
	$('#uploadUndo, #uploadUndo2').click(function(e) {
		$('#upload').slideUp(400, function() {
			if($('#imagemap4posis #mapContainer').find('img').attr('src') == '#') {
				$('#upload').slideDown(400);
				$('#navi').attr('currentValue', '#upload');
			} else {
				$('#navi').attr('currentValue', '#imagemap4posis');
				$('#imagemap4posis').slideDown(400, function() {
					resizeHtml();
					$('#dots').show();
				});
			}
		});
	});

	// insert image path via url
	$('#linkform').submit(function(e) {
		enterImagelinkForm();
		e.preventDefault();
	});
	$('.imageurl_submit').click(function(e) {
		enterImagelinkForm();
		e.preventDefault();
	});

	// When the image url box lose it focus, it changes the CSS style
	$('#imageurl').focusout(function() {
		var val = $('#imageurl').val().trim();
		if(val !=  '')
			$(this).addClass('active');
		else
			$(this).removeClass('active');
	});

	// Image Generator Buttons
	//$('.clearButton').click(addArea);

/*	function addArea() {
		console.log('addarea()')
		$('#coordsText').val('');
		
	}*/

	
	$('.clearCurrentButton').click(removeLast);
	// Delete the last point or box 
	function removeLast() {
		console.log('removelast()')
		var coordsContent = $('#coordsText').val().split(',');
		coordsContent = coordsContent.slice(0,coordsContent.length-1)
		$('#coordsText').val(coordsContent)
		$('.dot:last').remove();
		//$('#mapContainer').find('area:last').remove();
		//hightlight();

		// update textarea

		var textareaVal = $('#areaText').val();
		var tmpArr = textareaVal.split('\n');
		textareaVal = tmpArr.slice(0,tmpArr.length-1).toString();
		textareaVal=textareaVal.replace(/,/g,'\n');
		//textarea = textareaVal.replace('<area' + lastCoords+'/>\n    ', '');
		$('#areaText').val(textareaVal);

		// var textareaVal = $('#areaText').val();
		// var tmpArr = textareaVal.split('<area');
		// var lastCoords = tmpArr[tmpArr.length - 1].split('/>')[0];
		// textarea = textareaVal.replace('<area' + lastCoords+'/>\n    ', '');
		// $('#areaText').val(textarea);
	}

	// Keyboard support
/*	document.addEventListener('keydown', function (e) {
		console.log(e.keyCode);
		switch (e.keyCode) {
			case 65:
				addArea();
				break;

			case 90:
				removeLast();
				break;
		}
	}, false);*/

	// Clear All points and boxes
	$('.clearAllButton').click(function() {
		$('#coordsText').val('');
		$('#areaText').val('');
		$('#mapContainer').find('map').empty();
		$('.dot').remove();
	//	hightlight();
		textarea = "";
	});

	var timeoutIdShow = 0
	var timeoutIdHide = 0

	$('#info').mouseover(function() {
		clearTimeout(timeoutIdHide);
		timeoutIdShow = setTimeout(function() {
			$('#infotext').stop(true, true).show(200);
			$('#info').stop(true, true).animate({opacity: 1}, 200);
		}, 200);
	});
	$('#infotext').mouseover(function() {
		clearTimeout(timeoutIdHide);
	});
	$('#infotext').mouseleave(function() {
		clearTimeout(timeoutIdShow);
		timeoutIdHide = setTimeout(function() {
			$('#infotext').stop(true, true).hide(200);
			$('#info').stop(true, true).animate({opacity: 0.5}, 200);
		}, 200);
	});

/*	// show donate popup
	setTimeout(function() {
		$('#feedbackPopup').slideDown(400);
	}, 10000);
    $('#social').hover(function() {
        $('#feedbackPopup').slideDown(400);
    });

	// close donate popup
	$('#feedbackPopup a').click('a', function(e) {
		$('#feedbackPopup').slideUp(400);
		e.preventDefault();
	});

	// donate close-button fadeIn & fadeOut
	var timeoutIdHideBtn = 0
	$('#feedbackPopup').mouseover(function() {
		clearTimeout(timeoutIdHideBtn);
		$('#feedbackPopup a').show();
	});
	$('#feedbackPopup').mouseout(function() {
		timeoutIdHideBtn = setTimeout(function() {
			$('#feedbackPopup a').hide();
		}, 100);
	});
	$('#feedbackPopup a').mouseover(function() {
		clearTimeout(timeoutIdHideBtn);
	});
	$('#feedbackPopup a').mouseout(function() {
		clearTimeout(timeoutIdHideBtn);
	});*/
});
function drawBox(x,y){
	
	var offset = $('#mapContainer').offset();
	var imgOffset = $('#main').offset();
	var gapX = parseInt(imgOffset.left)-parseInt(offset.left)
	//var gapY = parseInt(imgOffset.top)-parseInt(offset.top)
	var imgWidth=$('#main').width()
	
	//var labelWidth =$(".label")[0].width()
	$(".panel").remove()
	var dotsWidth =$('#mapContainer').width()
	var dotsHeight =$('#mapContainer').height()
	x -= parseInt(offset.left);
	y -= parseInt(offset.top);
	 
	if(x < gapX) { 
		x =0; 
	}
/*	else if(x<imgWidth){
		x= imgWidth+8+gapX	
	}*/
	else if(x>(imgWidth+8+gapX)){
		x=imgWidth+8+gapX	
	}
	if(y < 0) { y = 0; }
	$('#mapContainer').append('<div class= "dot label" contenteditable="true" style="left: '+ (x)/dotsWidth*100 +'%; top: '+ (y)/dotsHeight*100 +'%; border: 2px solid green;"></div>')
	type = 'box'
	
	
	
	//var value = $('#coordsText').val();
	if(value == ''||typeof value==null) {
		value = (x-gapX)+'.'+y;
		areaValue="<question labelx='"+(x-gapX)+"' labely='"+y+"'>"+""+"</question><answer>"+""+"</answer>"
		coordsLength = value.length;
		counter++;
	} else {
		value = value+','+(x-gapX)+'.'+y;
		areaValue = areaValue + '\n' + "<question labelx='"+(x-gapX)+"' labely='"+y+"'>"+""+"</question><answer>"+""+"</answer>"
		coordsLength = value.length;
	}	
	//if(status)
		$('#coordsText').val(value);
		$('#areaText').val(areaValue)
		$('#mapContainer').append($('.imgmapMainImage'));
//	$('#mapContainer').children('div').remove();
	$('.imgmapMainImage').removeClass('maphilighted');
	$('canvas').remove();
}
function drawPoint(x,y){
	
	$(".panel").remove()
	
	//var value = $('#coordsText').val();
	var offset = $('#mapContainer').offset();
	var imgOffset = $('#main').offset();
	var gapX = parseInt(imgOffset.left)-parseInt(offset.left)
	//alert(gapX)
	//var gapY = parseInt(imgOffset.top)
	var imgWidth=$('#main').width()
	
	var dotsWidth =$('#mapContainer').width()
	var dotsHeight =$('#mapContainer').height()
	x -= parseInt(offset.left);
	y -= parseInt(offset.top);

	if(x < gapX||x-gapX >imgWidth) { 
		alert("You can't set a point out of the picture") 
		
		}
	else{
			$('#mapContainer').append('<img class="dot" src="images/dot.png" style="left: '+ (x)/dotsWidth*100 +'%; top: '+ (y)/dotsHeight*100 +'%;" />');
	type = 'point';
	if(value == ''||typeof value==null) {
		value = (x-gapX)+'.'+(y);
		areaValue="targetx='" + (x-gapX) + "' targety='" + (y) +"'";
		coordsLength = value.length;
		counter++;
	} else {
		value = value+','+(x-gapX)+'.'+(y);
		areaValue = areaValue + '\n' + "targetx='" + (x-gapX) + "' targety='" + (y) +"'"
		coordsLength = value.length;
	}
	}

	//	if(status)
		$('#coordsText').val(value);
		$('#areaText').val(areaValue)
		
		$('#mapContainer').append($('.imgmapMainImage'));
//	$('#mapContainer').children('div').remove();
	$('.imgmapMainImage').removeClass('maphilighted');
	$('canvas').remove();
	
}
function cancel(){
	$(".panel").remove()
	}

$(window).resize(function() {
	resizeUploadContainer();
});

var counter = 1;
var coordsLength = 0;
var textarea = '';
var type='';
var value = ''
var areaValue = '';
function setCoordinates(e, status) {
	$(".panel").remove();
	value = $('#coordsText').val();
	areaValue = $('#areaText').val();
	var x = e.pageX;
	var y = e.pageY;
	
	
	$('#dots').append('<div class= "panel" style="left: '+ (x-1) +'px; top: '+ (y-1) +'px;"><button class="option" onclick="drawBox('+x+','+y+')">Box</button><button class="option" onclick="drawPoint('+x+','+y+')">Point</button><button class="option" onclick="cancel()">Cancel</button></div>')
	//$('#dots').append('<img class="dot" src="images/dot.png" style="left: '+ (x-1) +'px; top: '+ (y-1) +'px;" />');



}
	
	//var areaValue = $('#areaText').val();
/*	if(value == '') {
		value = x+'.'+y;
		//areaValue = "targetx='" + x + "' targety='" + y +"'"
		coordsLength = value.length;
		counter++;
	} else {
		value = value+','+x+'.'+y;
		areaValue = areaValue + '\n' + "targetx='" + x + "' targety='" + y +"'"
		coordsLength = value.length;
	}*/
//	if(status)
//		$('#coordsText').val(value);
//		$('#areaText').val(areaValue);

	// if($('#area'+counter).length != 0)
	// 	$('#area'+counter).remove();
	// var countKomma = value.split(',').length;
	// var shape = (countKomma <= 4) ? 'rect' : 'poly';
	// if(countKomma >= 4) {
	// 	var html = '<area shape="'+shape+'" id="area'+counter+'" class="area" coords="'+value+'" href="#" alt="" title="">';
	// 	$('map').append(html);
	// }

//	$('#mapContainer').append($('.imgmapMainImage'));
//	$('#mapContainer').children('div').remove();
//	$('.imgmapMainImage').removeClass('maphilighted');
//	$('canvas').remove();

	//hightlight();

	// var area = '<area alt="" title="" href="#" shape="'+shape+'" coords="'+value+'" />\n';
	//var textarea = $('#areaText').val();
	// if(textarea == '')
	// {
	// 	// create textarea context
	// 	textarea = '<img src="url/to/your/image.jpg" alt="" usemap="#Map" />\n'
	// 			+ '<map name="Map" id="Map">\n'
	// 			+ '    ' + area
	// 			+ '    [...]\n'
	// 			+ '</map>';
	// }
	// else
	// {
	// 	if(countKomma == 2)
	// 	{
	// 		// new <area> context
	// 		textarea = textarea.replace('[...]', area + '    [...]');
	// 	}
	// 	else
	// 	{
	// 		// edit / update <area> context
	// 		var arr = value.split(',');
	// 		var oldCoor = '';
	// 		for(var i = 0; i < arr.length -2; i++)
	// 		{
	// 			if(i >= 1)
	// 				oldCoor += ',';
	// 			oldCoor += arr[i];
	// 		}
	// 		textarea = textarea.replace('shape="rect" coords="'+oldCoor, 'shape="'+shape+'" coords="'+oldCoor);
	// 		textarea = textarea.replace(oldCoor, value);
	// 	}
	// }
	// $('#areaText').val(textarea);

/*function hightlight() {
	$('.imgmapMainImage').maphilight({
		strokeColor: '4F95EA',
		alwaysOn: true,
		fillColor: '365E71',
		fillOpacity: 0.2,
		shadow: true,
		shadowColor: '000000',
		shadowRadius: 5,
		shadowOpacity: 0.6,
		shadowPosition: 'outside'
	});
}*/

function resizeUploadContainer() {
	if($('#upload').length) {
		var val = (($(window).height() - $('#logo').outerHeight() - $('#upload').outerHeight()) / 2) * 0.6;
		if(val < 100) { val = 100; }
		$('.infobox').css('margin-top', val+'px');
		
	}
	resizeHtml();
}
// @desc Load the image generator
function loadImagemapGenerator(width, height) {
	$('#mapContainer img');
	if(width == 0)
		width = $('#mapContainer img').width();
	if(height == 0)
		height = $('#mapContainer img').height();
	$('#newUpload').width(width-8);
	$('#mapContainer').width(width*1.6);
	widthTmp = (width < 350) ? 364 : width;
	widthTmp2 = (width < 350) ? 350 : width;
	$('div.form').width(widthTmp+4);
	$('div.form input').width(widthTmp2-34);
	width = (width < 363) ? 363 : width;
	$('div.form textarea').css({'width': width-10});
	$('#mapContainer').height(height);

	resizeHtml();
}

// @desc Resize the html page
function resizeHtml() {
	var current, height;
	$.each($('.infobox'), function() {
		if($(this).css('display') != 'none')
		current = $(this);
	});

	if(typeof(current) == 'undefined') {
		height = $('#imagemap4posis').outerHeight() + $('#header').outerHeight();
	} else {
		height = $(current).outerHeight(true) + $('#header').outerHeight();
	}

	if((typeof(current) == 'undefined' && height > $(window).height())
		|| (typeof(current) != 'undefined' && height > $(window).height())) {
		$('html').height(height);
		$('footer').css('top', height - 30 +'px');
	} else if(typeof(current) != 'undefined') {
		$('html').height('100%');
		$('footer').css('top', $(window).height() - 30 +'px');
	}
}
// @desc Remove old picture picture and the text area of recoding the coordinate
function removeOldMapAndValues() {
	if($('.imgmapMainImage').hasClass('maphilighted')) {
		$('#mapContainer').append($('.imgmapMainImage'));
		$('#mapContainer').children('div').remove();
		$('.imgmapMainImage').removeClass('maphilighted').css('opacity', 1);
		$('#dots').empty();
		$('#coordsText').val('');
		$('#areaText').val('');
		$('#map').children('area').remove();
	}
}
// @desc Hide the error tips panel
function removeErrorMessage() {
	$('#urlMessage').hide();
}

// @desc Load image by its link before the page load the image generator
function enterImagelinkForm() {
	removeErrorMessage();
	var url = $('#imageurl').val().trim();
	var error = true;

	var urlBegin = url.substr(0, 4);
	if(urlBegin == 'http' || urlBegin == 'www.')
		error = false;

	var parts = url.split('.');
	var ext = parts[parts.length-1].toLowerCase();
	if(ext == 'gif' || ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'tif' || ext == 'tiff' || ext == 'bmp')
		error = false;

	error = false;
	if(error == false) {
		$('#imagemap4posis #mapContainer').find('img').attr('src', url);
		removeOldMapAndValues();
		jQuery.ajax({
			type: 'POST',
			url: 'upload_ident.php',
			data: {'file': url, 'width': 0, 'height': 0},
			//data: {'data': '[true, "'+url+'", 0, 0]'},
			dataType : 'json'
		});
		$('#navi').attr('currentValue', '#imagemap4posis');
		$('#upload').slideUp(400, function() {
			$('#uploadUndo, #uploadUndo2').show();
			$('#imagemap4posis').slideDown(400, function() {
				resizeHtml();

				// not correct loaded yet?
				setTimeout(function() {
					loadImagemapGenerator();
				}, 300);

				setTimeout(function() {
					if($('#main').width() <= 20 && $('#main').height() <= 20)
						$('#urlMessage').slideDown(600);
				}, 1000);

			});
			loadImagemapGenerator(0, 0);
		});
	} else {
		$('a.imageurl_submit').parent().find('.error').remove();
		$('a.imageurl_submit').after('<p class="error hidden">Incorrect input (Example: www. [...] .jpg / .png / .gif)</p>');
		$('a.imageurl_submit').parent().find('.error').slideDown(400).delay(5000).slideUp(400, function(){ $(this).remove(); });
	}
}
