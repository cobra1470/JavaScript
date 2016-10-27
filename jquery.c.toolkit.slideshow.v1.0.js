/**
 * slide show
 * @authors Cobra Liu (lhg2work@sina.com)
 * @date    2016-05-24 16:02:24
 * @version v1.0
 * =======================================
 * effect 'slide' / 'fade'
 * autoScroll '1':yes / '0':no
 * stayTime 
 */
;(function($){
	$.extend($.fn, {
		slideShow: function(setting){
			var _dt = $.extend({
					effect: 'slide',
					autoScroll: 1,
					stayTime: 3000,
					showNum: 1
				}, setting);

			var effect = _dt.effect,
				autoScroll = _dt.autoScroll,
				stayTime = _dt.stayTime,
				showNum = _dt.showNum;

			var _this = this, 
				_index = 0,
				$title = _this.find('.w-title').find('a'),
				$ul = _this.find('.item-list'),
				$li = $ul.find('.i-img'),
				$len = $li.length,
				$perWidth = $li.eq(0).outerWidth(),
				showNum = parseInt(parseInt(_this.css('width')) / $perWidth);

			showNum = showNum > 0 ? showNum : 1;
			if($len <= showNum){
				_this.find('.btn-arrow').hide();
				return;
			};
			if(effect == 'slide') $ul.css('width', $perWidth * $len + 'px');
			if(autoScroll == 1){
				_this.hover(function(){
					clearInterval(_this.timerId);
				}, function(){
					_this.timerId = setInterval(function(){
						_this.scrollFun(1);
					}, stayTime);
				}).mouseout();
			}

			_this.scrollFun = function(n, $i){
				if($ul.is(':animated') || $li.is(':animated')) return;
				_index = ($i === undefined) ? $li.index($ul.find('.current')) + n : $i;

				if(_index > $len - showNum){
					_index = 0;
				}else if(_index < 0){
					_index = $len - showNum;
				}

				if(effect == 'fade'){
					$li.eq(_index).fadeIn(600)
						.siblings('li').fadeOut(600);
				}else{
					$ul.animate({
						'margin-left': -_index * $perWidth + 'px'
					}, 300);
				}
				
				$li.eq(_index).addClass('current').siblings().removeClass('current');
				$title.eq(_index).addClass('current').siblings().removeClass('current');
				return;
			}

			var startX, endX, touchX, startY, touchY, _mLeft;
			_this.bind('touchstart', function(e) {
				startX = e.originalEvent.targetTouches[0].pageX;
				startY = e.originalEvent.targetTouches[0].pageY;
				_mLeft = parseInt($ul.css('margin-left'));

				_this.bind('touchmove', function(e) {
					e.preventDefault();
					touchX = e.originalEvent.targetTouches[0].pageX;
					touchY = e.originalEvent.targetTouches[0].pageY;

					if( (startY - touchY) > 40){
						jQuery('body, html').animate({
							scrollTop: _this.height() - 60
						}, 120);
						return;
					}
					$ul.css('margin-left',_mLeft + touchX - startX + 'px');
				});

			});
			_this.bind('touchend', function(e) {
				_this.unbind('touchmove');
				endX = e.originalEvent.changedTouches[0].pageX;
				endY = e.originalEvent.changedTouches[0].pageY;

				var $slideLen = Math.abs(startX - endX);
				var $cMleft = parseInt($ul.css('margin-left'));

				if($slideLen < 30) return;

				if($slideLen >= 30 && $cMleft < 0 &&  $cMleft > -($len -1)*$perWidth){
					if(touchX - startX > 0){
						_this.scrollFun(-1);
					}else{
						_this.scrollFun(1);
					}
				}else if($cMleft >= 0){
					_this.scrollFun(0, 0);
				}else if( $cMleft <= -($len -1)*$perWidth){
					_this.scrollFun(0, $len - 1);
				}else{
					$ul.css('margin-left', _mLeft + 'px');
				}

			});

			_this.on('click', '.a-left', function(){
				_this.scrollFun(-1);
			});
			_this.on('click', '.a-right', function(){
				_this.scrollFun(1);
			});
			_this.on('click', '.w-title a', function(){
				_this.scrollFun(0, $title.index(this));
			});
			$(window).on('resize', function(){
				$ul.css('margin-left', 0);
				$perWidth = $li.eq(0).outerWidth();
				if(effect == 'slide') $ul.css('width', $perWidth * $len + 'px');
				_this.scrollFun(0, 0);
			});
		}
	});
}(jQuery));


jQuery.fn.setWidth = function(){
	var _this = this,
		$domWith = jQuery(window).width();
		
	this.find('li.i-img').css({
		width: this.css('width')
	});
}























