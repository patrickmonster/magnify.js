(function (factory) {
    typeof define === "function" && define.amd
        ? define(factory)
        : factory();
})(function () {
    "use strict";
	function randomAlphaNumeric(length){
		var s = '';
		Array.from({ length }).some(function(){
			s += Math.random().toString(36).slice(2);
			return s.length >= length;
		});
		return s.slice(0, length);
	};

	function over_point(p, move){
		return (p - 50)* -1 + (p - 50)  / move;
		// return p - 50 / move;
	}
	
	function moveEvent(event){
		var x = event.layerX;
		var y = event.layerY;

		var px = x / this.width * 100; 
		var py = y / this.height * 100; 

		this.style.innerHTML='.' + this.id + '{clip-path: circle('+this.circle_size+'% at '+ px + '% ' + py + '%)}';

		var ex = over_point(px, this.magnify_move);
		var ey = over_point(py, this.magnify_move);
		this.style.innerHTML += '.' + this.id + '{ transform: scale('+ this.magnify_size +') translate(' + ex + '%, ' + ey + '%)}';
	}
	
	function stopEvent(event){
		this.style.innerHTML ='.' + this.id  + "{clip-path: circle(0%)}";
	}

	function init(){
		this.magnify_obj = this.target.cloneNode(true);
		this.style = document.createElement('style');
		var style = document.createElement("style");

		this.target.parentNode.appendChild(this.magnify_obj);
		this.target.parentNode.appendChild(style);
		this.target.parentNode.appendChild(this.style);

		
		var size = this.magnify_obj.getBoundingClientRect();
		this.width = size.width;
		this.height = size.height;
		this.id = "magnify" + randomAlphaNumeric(5);// 5자리 렌덤코드

		this.magnify_obj.classList.add(this.id);


		var _this = this;

		this.target.ontouchmove = this.target.onmousemove = function(event){
			moveEvent.call(_this,event);
		};
		this.target.onmouseout = this.target.ontouchend = function(event){
			stopEvent.call(_this,event);
		};

		style.innerHTML = '.' + this.id + '{transform: scale('+this.magnify_size+');position: absolute;top: 0;left: 0;pointer-events: none}';
		stopEvent.call(_this,null);
	}

	/**
	 * 
	 * @param {*} target 확대할 오브젝트
	 * @param {circle_size, magnify_size , magnify_move} options 옵션값 {원형 크기, 확대 스케일, 움직이면서 이동거리(보정값)}
	 * @returns 
	 */
	function magnify(target, options = {}){
		this.circle_size =  options.circle_size || 15;// 원 둘래
		this.magnify_size =  options.magnify_size || 2;// 확대 스캐일
		this.magnify_move =  options.magnify_move || 2.5;// 움직임 이동 거리
		this.target = target;
		if(this.target){
			init.call(this);
		}
		return this;
	}
    if (window) {
        if (typeof window.define == "function" && window.define.amd) {
            window.define("magnify", function () {
                return magnify;
            });
        } else if (window) {
            window.magnify = function(option){return magnify.call({},option)};
        }
    }
});