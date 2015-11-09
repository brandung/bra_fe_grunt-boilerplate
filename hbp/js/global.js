/**##############################
#		Global Namespace		#
#################################*/
var Brandung = function (out) {
	out = out || {};

	for (var i = 1; i < arguments.length; i++) {
		if (!arguments[i]) {
			continue;
		}

		for (var key in arguments[i]) {
			if (arguments[i].hasOwnProperty(key)) {
				out[key] = arguments[i][key];
			}
		}
	}

	return out;
}({}, (Brandung || {}), {
	Vars: {
		// path to assets folder
		folderPath: '%%public%%/',
		// standard breakpoints
		breakpoints: {},
		// mobile first (xs, sm, md, lg, xl)
		currentBreakpoint: 'xs',
		// portrait first (portrait, landscape)
		currentOrientation: 'portrait',
		isIE: window.navigator.userAgent.indexOf("MSIE ") > -1 || // IE <= 10
			!(window.ActiveXObject) && "ActiveXObject" in window || // IE 11
			/x64|x32/ig.test(window.navigator.userAgent) // IE 12
	},
	// CSS components script namespace
	Component: {},
	// functions must return something
	Function: {},
	// everything that has to do with event handling
	Handle: {},
	// Should be used for scripts that have nothing to do with components, e.g. placeholder polyfills, plugins, etc.
	Util: {}
});

// abortion timeout for asset fetching, default 5000ms
basket.timeout = 60000;

// load main plugins
basket.require(
	{
		url: Brandung.Vars.folderPath + 'js/libs/vendor/jquery/jquery.min.js',
		unique: 0
	},
	{
		url: Brandung.Vars.folderPath + 'js/libs/vendor/modernizr/modernizr.custom.min.js',
		unique: 0
	},
	{
		url: Brandung.Vars.folderPath + 'js/libs/vendor/import/jquery.import.min.js',
		unique: 0
	}
).then(function () {
	(function ($) {
		// store commonly used jQuery objects to Vars object
		Brandung.Vars = $.extend(Brandung.Vars, {
			$html: $('html'),
			$body: $('body'),
			$window: $(window),
			$doc: $(document)
		});

		//Assets that are necessary globally and on every page, can and will be loaded here
		Brandung.Util.fetchBeforeRender = function () {
			return $.import([
				{
					condition: true,
					order: 0,
					fetch: [
						// <@bundle#before-render
						Brandung.Vars.folderPath + 'js/util/console-polyfill.js',
						Brandung.Vars.folderPath + 'js/util/inject-smartresize.js',
						Brandung.Vars.folderPath + 'js/function/assert-breakpoint.js',
						Brandung.Vars.folderPath + 'js/function/get-breakpoint.js',
						Brandung.Vars.folderPath + 'js/function/get-orientation.js',
						Brandung.Vars.folderPath + 'js/function/get-computed-style.js',
						Brandung.Vars.folderPath + 'js/util/set-breakpoints.js',
						Brandung.Vars.folderPath + 'js/handle/set-event-class.js',
						Brandung.Vars.folderPath + 'js/handle/resize-handler.js',
						Brandung.Vars.folderPath + 'js/function/get-unique.js'
						// bundle@>
					],
					callback: [
						{ method: Brandung.Util.loadComponents }
					],
					unique: 123718
				}
			], false);
		};

		// Component loader
		Brandung.Util.loadComponents = function () {
			$.import([
				// <@delete
				{
					condition: true,
					fetch: [
						Brandung.Vars.folderPath + 'js/libs/bra/dbug/bra/bra-module-widget/bra-module-widget.js',
						Brandung.Vars.folderPath + 'js/libs/bra/dbug/bra/bra-module-widget/bra-module-widget.css',
						Brandung.Vars.folderPath + 'js/util/init-debug-mode.js'
					],
					unique: Brandung.Function.getUnique()
				},
				// delete@>
				{
					condition: Brandung.Function.assertBreakpoint('lt', 'md'),
					fetch: [
						// <@bundle#h5bp-helper
						Brandung.Vars.folderPath + 'js/libs/vendor/h5bp/helper.js',
						Brandung.Vars.folderPath + 'js/util/h5bp-helper.js'
						// bundle@>
					],
					unique: Brandung.Function.getUnique()
				},
				{
					// load always and always from server
					condition: true,
					fetch: [
						Brandung.Vars.folderPath + 'js/hotfix.js',
						Brandung.Vars.folderPath + 'css/hotfix.css'
					],
					unique: new Date().getTime()
				},
				{
					condition: $('.alert'),
					fetch: [
						Brandung.Vars.folderPath + 'component/alert/alert.css'
					],
					unique: Brandung.Function.getUnique()
				},
				{
					condition: $('form'),
					fetch: [
						Brandung.Vars.folderPath + 'component/forms/forms.css'
					],
					unique: Brandung.Function.getUnique()
				},
				{
					condition: $('.btn'),
					fetch: [
						Brandung.Vars.folderPath + 'component/buttons/buttons.css'
					],
					unique: Brandung.Function.getUnique()
				}// <@newComponent@>
			], true);
		};

		// snippets placeholder
		// --- start|bra-pb: js ---
		// --- end|bra-pb: js ---

		/**
		 #####################################
		 #         document ready            #
		 #####################################
		 */
		$(function () {
			Brandung.Util.fetchBeforeRender();
		});
	})(jQuery);
}, function () {
	// <@delete
	console.error('main.js: fetching of scripts and initialization failed');
	// delete@>
});