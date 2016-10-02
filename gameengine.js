var DWIDTH, DHEIGHT, SCALINGFACTOR, BANNERHEIGHT, GAMESPACE;
var levels = [];
	var SIZES = {
		point : 15,
		flag : { x : 40, y : 55 },
		//comumn : 30 + 2,
		column : 50,
		pointsbar : 20,
		margin : {
			x : 20,// * SCALINGFACTOR
			y : 70
		}
	}
	
	var Game = {
		name			: "ghostgame",
		width      		: 6,//9 | 7
		height     		: 9,//6 | 9
//		points     		: 0,
		objectsnum 		: 5,//6
//		level			: 1,
//		maxlevelsnum	: 10, // mappoints.length
		up				: {
			playerA : false,
			playerB : false,
			move : 2,
			block : false
		},
		map : [],
		sublevel : 0,
		sublevels : 0,
		S : {
			w : 0,
			h : 0
		},
		persons : [],
		checked : [],
		checktime : 5,

		logmap : function(){// выводит первоначальный массив в консоль
			for(var i = 0; i < this.height; i++) {
				var str = "";
				for(var j = 0; j < this.width; j++) {
					str += this.map[i][j] + ' ';
				}
				console.log(str);
			}
		},
		logarr2 : function(a){// выводит в консоль двумерный массив
			for(i in a) {
				var str = "";
				for(j in a[i]) {
					str += a[i][j] + ' ';
				}
				console.log(str);
			}
		},
// document.onclick = function(e){console.log(e.pageX + ' ' + e.pageY)}	
		resetall : function() {
			localStorage[Game.name + 'level'] = 0;
			localStorage[Game.name + 'points'] = 0;
		},
		
		draw : function() {
			var SCALINGH = DHEIGHT / 320;
			$('#map').html('');
			for(i in this.map) {
				var l = $('<div>')
					.addClass('window1')
					.css({
						left : ( this.map[i].x ) * SCALINGFACTOR,//SCALINGW
						top : ( this.map[i].y ) * SCALINGH,//SCALINGH
						width : Game.S.w * SCALINGFACTOR,
						height : Game.S.h * SCALINGH
					})
				$('#map').append(l);
			}
		},
		
		win : function(player) {
		
			$('#youwin').html(lang.youwin).show();
			//$('#gamescreen').hide();
			
			var l = parseInt(localStorage[Game.name + 'level']);
			if(this.sublevel < this.sublevels) {
				this.sublevel++;
			}// else {
				//if(l < levels.length - 1) {
					localStorage[Game.name + 'level'] = l + 1;
					//this.sublevel = 0;
				//}
			//}
			//if(l < Game.mappoints.length - 1) {
			//	localStorage.match3v2level = l + 1;
				setTimeout(function() {
					$('#youwin').hide();
					Game.startgame();
				}, 3000);
			//}
			
		},
		
		gameover : function(player) {
		
			clearTimeout(Game.timer);
			$('#starttimer').hide();
			
			$('#youwin').html(lang.gameover).show();
				setTimeout(function() {
					$('#youwin').hide();
					Game.sublevel = 0;
					Game.startgame();
				}, 3000);
			
		},

		drawpersons : function(i) {
			Game.persons = [];
			$('.window1').removeClass('persone0').removeClass('persone1');
			
			//var count = (Math.random() * 5)|0;
			var count = 1 + ((Game.map.length / 2)|0) + this.sublevel;
			for( var i = 0; i < count; i++ ) {
				var index = (Math.random() * Game.map.length)|0;
				if( typeof Game.persons[index] == 'undefined' ) {
					//var persone = ( count > 1 ) ? ( (Math.random() * 2)|0 ) : 1;//0 - man, 1 - ghost
					var persone = (Math.random() * 2)|0;//0 - man, 1 - ghost
					Game.persons[index] = persone;
					$('.window1').eq(index)
						.addClass('persone' + persone);
				} else {
					i--;
				}
			}
			setTimeout(function() {
				$('.window1').removeClass('persone0').removeClass('persone1');
				Game.checktimer(Game.checktime);
			}, 1000);
		},
		
		check : function() {
			
			var ghostcount = 0;
			for(i in Game.persons) {
				if(Game.persons[i] == 1) {ghostcount++}
				$('.window1').eq(i)
					.addClass('persone' + Game.persons[i]);
			}
			var f = true;
			var ghostcount2 = 0;
			for(i in Game.checked) {
				console.log('--->', i);
				if(typeof Game.persons[i] != 'undefined') {
					if(Game.persons[i] == 1) {ghostcount2++}
					if(Game.persons[i] != 1) {
						f = false;
					}
				} else {
					f = false;
				}
			}
			if(ghostcount != ghostcount2) {
				f = false;
			}
			if(Game.checked.length == 0 && ghostcount > 0) { f = false; }
			return f;
		},
		
		checktimer : function(i) {
			
			if(i == 0) {
				$('#checktimer').hide();
				if(this.check()) {
					Game.win();
				} else {
					Game.gameover();
				}
				//console.log('check');
			} else {
				$('#checktimer:hidden').show()
				$('#timer').html(i);
				i--;
				var ff = function() {
					Game.checktimer(i);
				}
				Game.timer = setTimeout(ff, 1000);
				
			}
			
		},
		
		starttimer : function(i) {
			if(typeof i == 'undefined') {return;}
			if(i == 0) {
				$('#starttimer').hide()
				this.drawpersons();
			} else {
				var ff = function() {
					i--;
					Game.starttimer(i);
				}
				$('#starttimer').show().css({'font-size' : '1pt'}).html(i).animate({'font-size' : '100pt'}, 500, ff)
			}
		},
		
		startgame : function() {
			//console.log('--->boobs');
			//this.init();
			Game.persons = [];
			Game.checked = [];
			var l = parseInt(localStorage[Game.name + 'level']);
			$('#level').html(l + 1);
			
			l = ( l > levels.length - 1 ) ? ( levels.length - 1 ) : l;
			
			this.map = levels[l].map;
			this.S.w = levels[l].w;
			this.S.h = levels[l].h;
			this.sublevels = levels[l].sublevels;
			
			$('#map').css({
				'background-image' : 'url(home' + ( l + 1 ) + '.jpg)',
				width : DWIDTH + 'px',
				height : DHEIGHT + 'px'
			});
			$('#starttimer').css({
				width  : DWIDTH  + 'px',
				height : DHEIGHT + 'px',
				'line-height' : DHEIGHT + 'px'
			});
			
			this.draw();
			this.starttimer(3);
			
			$('#map').delegate('.window1', 'click', function() {
				if( $(this).hasClass('choise') == false ) {
					$(this).addClass('choise');
					Game.checked[$(this).index()] = true;
				}
				console.log('click', $(this).index());
				//
			})
		},
		
		init : function() {
			//$('#mapsplash').append(' in');
			if(
				typeof(localStorage[Game.name + 'level']) === 'undefined' ||
				typeof(localStorage[Game.name + 'points']) === 'undefined'
			){
				localStorage[Game.name + 'level'] = 0;
				localStorage[Game.name + 'points'] = 0;
			}
			$('#points').html(localStorage[Game.name + 'points']);
			//this.drawmap();
		}
	}
	
	$(document).ready(function() {
		//$('#mapsplash').append('ready');
	
		DWIDTH = document.body.clientWidth;
		DHEIGHT	= document.body.clientHeight;
		SCALINGFACTOR = DWIDTH / 480;
		BANNERHEIGHT = SCALINGFACTOR * 50;
		SIZES.margin.x = SIZES.margin.x * SCALINGFACTOR;
		SIZES.margin.y = SIZES.margin.y * SCALINGFACTOR;
		SIZES.column = SIZES.column / 480 * DWIDTH;
		
		
		GAMESPACE = {
			X : DWIDTH - ( SIZES.margin.x * 2 ),
			Y : DHEIGHT - BANNERHEIGHT - SIZES.margin.y
		}
		
		Game.width = 8;//( GAMESPACE.X / SIZES.column )|0;
		SIZES.column = GAMESPACE.X / Game.width;
		Game.height = Game.width;
		
		SIZES.margin.x = ( ( DWIDTH - (SIZES.column * Game.width) ) / 2 );
		SIZES.margin.y = DHEIGHT / 2 - GAMESPACE.X / 2;

		$('#youwin').css({
			width : (DWIDTH - 30 + 'px'),
			top : DHEIGHT / 2 - 50 + 'px'
		});
		
		$('#pointsbar').css({
			height : ( SIZES.pointsbar * SCALINGFACTOR )|0,
			'line-height' : ( ( ( SIZES.pointsbar * SCALINGFACTOR )|0 ) + 'px' )
		});

		Game.init();

		//if( parseInt(localStorage.match3v2level) == 0 ) {
			$('#continue').remove()
		//}
		var _l, _t, _w, _h;
		_w = (156 * SCALINGFACTOR) + 'px';//548
		_h = (70 * SCALINGFACTOR);//247
		_l = (DWIDTH / 2 - 78 * SCALINGFACTOR) + 'px';
		//_t = 270 * SCALINGFACTOR;
		_t = 100 / 320 * DHEIGHT
		
		var _logow = 400 / 420 * DWIDTH ,
		    _logoh = 77 / 320 * DHEIGHT,
		    _logot = 77 / 320 * DHEIGHT,
		    _logol = DWIDTH / 2 - _logow / 2;
		$('#logo').css({
			left   : _logol + 'px', 
			top    : _logot + 'px', 
			width  : _logow + 'px', 
			height : _logoh + 'px'
		});
		//$('#startscreen>div:eq(0)').css({left:_l,top:(_t + 'px'),width:_w,height:_h + 'px'});
		_t += _h + 3;
		$('#newgame').css({left:_l,top:(_t + 'px'),width:_w,height:_h + 'px'});
		
		$('#newgame').click(function(){
			Game.resetall();
			$('#startscreen').hide();
			$('#gamescreen').show();
			Game.startgame();
		});
		$('#continue').click(function(){
			$('#startscreen').hide();
			$('#gamescreen').show();
			Game.startgame();
		});
	});