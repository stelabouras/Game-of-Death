/*
God is an HTML5 version of the awesome applet by Vincent "Vulume" Goossens

http://users.fulladsl.be/spb22044/demos/GameOfDeath/index.html
*/

window.ios = window.navigator.userAgent.indexOf('AppleWebKit') !== -1 && window.navigator.userAgent.indexOf('Mobile') !== -1;

/* Taken from: http://paulirish.com/2011/requestanimationframe-for-smart-animating/ */
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(callback, element) {
           		window.setTimeout(callback, 1000 / 60);
            };
})();

God = new function() {
	
	var swap = true;
	var asum;
	var bsum;
	var auxa;
	var auxb;
	var a;
	var b;
	
	var frameCount 	= 0;
	var tick 		= 0;

	var animating 	= true;

	var canvas;
	var context;
	
	var world = {
		width : 200,
		height: 200
	};
	
	// Initialization of the world, events and animation loop
	this.initialize = function() {
		
		var html = [];
		
		html.push('<canvas id="world" width="' + (world.width + 2) + '" height="' + (world.height + 2) + '">');
		html.push('Your browser does not support canvas element :( Sorry');
		html.push('</canvas>');
		html.push('<p>');
		html.push('<button onclick="God.toggleAnimation();">Play / Pause (space)</button>');
		html.push(' - ');
		html.push('<button onclick="God.clean();">Clean (c)</button>');
		html.push('</p>');

		$('#main').append(html.join(''));
				
		canvas	= $('#world')[0];
		context = canvas.getContext('2d');
		
		if(!window.ios) {
			
			document.addEventListener('keydown', function(event) {
			
				// space for pause/play
				if(event.keyCode == 32) {
				
					event.preventDefault();
				
					God.toggleAnimation();
				}
			
				// c for clear
				if(event.keyCode == 67 && event.metaKey == false && event.ctrlKey == false)
					God.clean();
			
			}, false);
		} 
		
		this.clean();
		
		animateWorld();
	}
	
	this.toggleAnimation 	= function() { animating = !animating; }
	this.clean				= function() { 

		frameCount 	= 0;
		swap		= true;
		
		a 		= new Array(world.width + 2);
		b 		= new Array(world.width + 2);
		auxa 	= new Array(world.width + 2);
		auxb 	= new Array(world.width + 2);
		
		for(var i = 0; i < world.width + 2; i++) {
			
			a[i] 	= new Array(world.height + 2);
			b[i] 	= new Array(world.height + 2);
			auxa[i] = new Array(world.height + 2);
			auxb[i] = new Array(world.height + 2);
			
			for(var j = 0; j < world.height + 2; j++) {
				
				a[i][j] = 0;
				b[i][j] = 0;
				auxa[i][j] = 0;
				auxb[i][j] = 0;
			}
		}
	}
	
	function animateWorld() {
	
		requestAnimFrame(animateWorld, canvas);
		
		tick = (frameCount++ % (window.ios ? 6 : 12));

		if(frameCount < 100) {
			
			for(var i = 1; i < world.width; i++) {
				
				a[i][0] = random(2);
				b[i][world.height] = random(2);				
			}
		}
		
		// every 1000 frames swap the leader 
		if(frameCount % 1000 == 0)
			swap = !swap;
			
		for(var i = 1; i < world.width; i++) {
			
			for(var j = 1; j < world.height; j++) {
				
				// apply the game of life rules to both swarms
				rules(a, auxa, i, j);
				rules(b, auxb, i, j);
				
				if(auxa[i][j] == 1 && auxb[i][j] == 1) {
					
					if( (swap && random(world.height) < j) ||
						(!swap && random(world.height) > j)
					  ) {
						auxa[i][j] = 1;
						auxb[i][j] = 0;
					} else {
						auxa[i][j] = 0;
						auxb[i][j] = 1;
					}
				}
			}
		}
			
		buildWorld();
	}

	function random(number) { return Math.floor(Math.random() * number) + 1; }
	
	// game of life rules
	function rules(x, aux, i, j) {
	
		var t = 0;
		
		t += x[i-1][j-1];
		t += x[i][j-1];
		t += x[i+1][j-1];
		t += x[i-1][j];
		t += x[i+1][j];
		t += x[i-1][j+1];
		t += x[i][j+1];
		t += x[i+1][j+1];

		if(x[i][j] == 1) {
			
			if(t < 2 || t > 4)
				aux[i][j] = 0;
				
		} else {
			
			if(t == 3)
				aux[i][j] = 1;
		}
	}

	function setPixel(imageData, x, y, red, green, blue) {
        
        var index = (x + y * imageData.width) * 4;
        
        imageData.data[index+0] = red;
        imageData.data[index+1] = green;
        imageData.data[index+2] = blue;
        imageData.data[index+3] = 0xff;
    }

	function buildWorld() {

		if(!animating)
			return;
			
		// set the background color
		context.fillStyle = "#000000";
		context.fillRect(-1, -1, world.width + 1, world.height + 1);
		
		var imageData = context.createImageData(world.width + 2, world.height + 2);
		
		// Draw the game of death :P
		for(var i = 0; i < world.width + 1; i++) {
			
			for(var j = 0; j < world.height + 1; j++) {
				
				a[i][j] = auxa[i][j];
				b[i][j] = auxb[i][j];

				if(a[i][j] == 1) {
					
					red 	= 204;
					green 	= 102;
					blue 	= 0;
					
				} else if(b[i][j] == 1){

					red 	= 0;
					green 	= 102;
					blue 	= 153;
					
				} else {
					
					red 	= 0;
					green 	= 0;
					blue 	= 0;
				}
					
				setPixel(imageData, i, j, red, green, blue);
			}
		}
		
		context.putImageData(imageData, 0, 0);
	}
};

God.initialize();