/* jslint browser: true, debug: true */
/* global define, module, exports, console */
(function(root, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.vanillaCountdown = factory();
	}

}(this, function() {

	'use strict';

	var vanillaCountdown = function(options, element) {

		if (!options || typeof(options) !== 'object') {
			console.error('Invalid parameter, must be an Object!');
			return false;
		}

		if (!element.ELEMENT_NODE) {
			console.error('Invalid element parameter, must be a DOM node');
			return false;
		}

		var that = this,
			YY = options.year,
			MM = options.month,
			DD = options.day,
			HH = options.hour,
			MI = options.minute,
			SS = options.second,
			interval;


		that.init = function() {

			interval = setInterval(function() {
				countDown();
			}, 1000);

		};

		Number.prototype.converted = function() {
			return (this < 10) ? ("0" + this) : this;
		};

		function countDown() {

			var actual_date = new Date(),
				actual_day = actual_date.getDate(),
				future_date = new Date(YY, MM - 1, DD, HH, MI, SS),
				ss = parseInt((future_date - actual_date) / 1000),
				mm = parseInt(ss / 60),
				hh = parseInt(mm / 60),
				countdown_string = '',
				dd = parseInt(hh / 24);

			ss = ss - (mm * 60);
			mm = mm - (hh * 60);
			hh = hh - (dd * 24);
			// Default
			countdown_string = '<span class="vanilla-countdown-numbers"> \
				            <span class="number-hour">{{number_hour}}</span> \
				            <span class="number-minute">{{number_minute}}</span> \
				            <span class="number-second">{{number_second}}</span> \
				        </span>';

			var text_template = '<span class="vanilla-countdown-texts">	\
						    	 <span class="text-hour">{{text_hour}}</span> \
						    	 <span class="text-minute">{{text_minute}}</span> \
						    	 <span class="text-second">{{text_second}}</span> \
						   </span>';

			if(options.text !== false)
				countdown_string += text_template;

			var variables = {
				'number_hour': toString(hh).length ? hh.converted() + ':' : '',
				'number_minute': (toString(mm).length) ? mm.converted() + ':' : '',
				'number_second': ss.converted(),
				'text_day': (dd > 1) ? 'dias' : 'dia',
				'text_hour': (hh > 1) ? 'hrs' : 'hrs',
				'text_minute': (mm > 1) ? 'min' : 'min',
				'text_second': (ss > 1) ? 'seg' : 'seg'		
			};

			var tags = countdown_string.match(/{{.*?}}/g);
			tags.forEach(function(tag){
				var tagValue = tag.substr(2, tag.length - 4);
				//split & join > replace
				//http://jsperf.com/replace-all-vs-split-join
				countdown_string = countdown_string
							.split(tag)
							.join(variables[tagValue]);
			});


			element.innerHTML = countdown_string;

            var event = document.createEvent('Event');
            event.initEvent('countDownRendered', true, true);
            window.dispatchEvent(event);


			if ((future_date.getTime() < actual_date.getTime()) || ss < 0) {

				var second_element = document.querySelector('.vanilla-countdown-numbers .number-second');
				second_element.innerHTML = '00';
				clearInterval(interval);
                if( typeof  options.action  == "function" )
                options.action();

				return false;

			}

		}

	};

	return vanillaCountdown;

}));
