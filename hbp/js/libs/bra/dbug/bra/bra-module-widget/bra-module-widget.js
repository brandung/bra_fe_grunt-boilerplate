/**
 * bra_module-widget.js v1.0
 * https://github.com/brandung/bra-module-widget
 *
 * Insert widget in _modules.html
 * for quick navigation to each module element on page
 *
 * @author: Simon Kemmerling
 *
 * Copyright 2014, brandung GmbH & Co. KG
 * http://www.brandung.de
 *
 * MIT License (MIT)
 */

(function ($) {

	var methods = {

		// init plugin
		init: function (options) {
			// set defaults
			var settings = $.extend({
				widgetName: 'bra-module-widget',		// String: Selector name of the widget
				mwHeader: '.mw-header',					// Selector: Widget Header
				mwContainer: '.mw-container',			// Selector: Widget Container
				deepLinkObj: '.mw-headline',			// Selector: Selector to navigate
				isStickyHeader: true,					// Boolean: set sticky header value
				stickyHeader: '.main-nav-wrapper',		// Selector: Sticky Header wrapper

				// Callback API
				onInit: function () {
				}					// Callback triggered immediately after initialization
			}, options || {});

			var self = this;

			this.each(function () {
				// bind settings to object
				self.data('widget', settings);
				// add widget to page
				methods._addWidget.call(self);
			});

			// trigger callback after initialization
			settings.onInit();

			return this;
		},

		///////////////////////////////////////////////////

		/**
		 * append widget to body
		 *
		 * @private
		 */
		_addWidget: function () {
			var $self = this,
				settings = $self.data('widget');

			// DOM of widget
			settings.widget = $('<div id="' + settings.widgetName + '">' +
				'<div class="mw-header">' +
				'	<h3>Modules overview</h3><span class="mw-remove" title="Remove">Remove</span><span class="mw-grid" title="Show grid">Show grid</span><span class="mw-open" title="Show module list">Open</span>' +
				'</div>' +
				'<div class="mw-container">' +
				'</div>' +
				'</div>');

			// bind click event
			settings.widget.find('.mw-open').on('click', function () {
				$(this).toggleClass('is-active');
				methods._showHide(settings);
			});

			settings.widget.find('.mw-grid').on('click', function () {
				$(this).toggleClass('is-active');
				methods._toggleGrid();
			});

			settings.widget.find('.mw-remove').on('click', function () {
				settings.widget.remove();
			});

			// append widget
			settings.widget.appendTo('body');

			// get deep links
			methods._getDeepLinks.call(settings);

			// bind draggable event
			methods._draggable.call(settings);

		},

		_toggleGrid: function () {
			$('body').toggleClass('util-show-grid');
		},

		/**
		 * show/hide widget container
		 *
		 * @param settings
		 * @private
		 */
		_showHide: function (settings) {
			if (settings.widget.find('span').hasClass('is-active')) {
				$(settings.mwContainer).slideDown();
			} else {
				$(settings.mwContainer).slideUp();
			}
		},

		/**
		 * get deep links
		 *
		 * @private
		 */
		_getDeepLinks: function () {
			var settings = this,
				links = $('<ul></ul>');

			$(settings.deepLinkObj).each(function () {
				var text = $(this).text();

				if(!/^\d+\.\W/ig.test(text)) {
					text = '&nbsp;&nbsp;&nbsp;&nbsp;' + text;
				}

				$('<li>' + text + '</li>').appendTo(links);
			});

			links.find('li').on('click', function () {
				var $self = $(this),
					selfText = $.trim($self.text()),
					headerHeight = 0;

				console.log(selfText);

				// if sticky header is in use get height of sticky element
				if (settings.isStickyHeader) {
					headerHeight = $(settings.stickyHeader).height()
				}

				// get element top position
				// and scroll to
				$(settings.deepLinkObj).each(function () {
					if ($(this).text() === selfText) {
						var topPos = $(this).offset().top - headerHeight;

						$('body').stop().animate({'scrollTop': topPos}, 'fast', function () {
							return;
						});

						return false;
					}
				})
			});

			// append to widget container
			links.appendTo($(settings.mwContainer));
		},

		/**
		 * draggable function for widget
		 *
		 * @private
		 */
		_draggable: function () {
			var settings = this;

			$(settings.mwHeader).css('cursor', 'move').on("mousedown", function (e) {
				var $drag = $(this).addClass('active-handle').parent().addClass('mw-draggable');

				var z_idx = $drag.css('z-index'),
					drg_h = $drag.outerHeight(),
					drg_w = $drag.outerWidth(),
					pos_y = $drag.offset().top + drg_h - e.pageY,
					pos_x = $drag.offset().left + drg_w - e.pageX;

				$drag.css('z-index', 1000).parents().on("mousemove", function (e) {
					$('.mw-draggable').offset({
						top: e.pageY + pos_y - drg_h,
						left: e.pageX + pos_x - drg_w
					}).on("mouseup", function () {
						$(this).removeClass('mw-draggable').css('z-index', z_idx);
					});
				});

				e.preventDefault();

			}).on("mouseup", function () {
				$(this).removeClass('active-handle').parent().removeClass('mw-draggable');
			});
		}

	};

	$.fn.bra_moduleWidget = function (method) {
		if (methods[method]) {
			return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			// Default to "init"
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.bra_pagination');
		}
	};
})(jQuery);