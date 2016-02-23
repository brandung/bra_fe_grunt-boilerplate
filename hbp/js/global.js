/**
 * Define Global Namespace
 */
var Capitan = function (out) {
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
}({}, (Capitan || {}), {
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

/**
 * Load main plugins via basket.js
 */
basket.require(
	{
		url: Capitan.Vars.folderPath + 'js/libs/vendor/jquery/jquery.min.js',
		unique: 0
	},
	{
		url: Capitan.Vars.folderPath + 'js/libs/vendor/modernizr/modernizr.custom.min.js',
		unique: 0
	},
	{
		url: Capitan.Vars.folderPath + 'js/libs/vendor/import/jquery.import.min.js',
		unique: 0
	}
).then(function () {
	(function ($) {
		// store commonly used jQuery objects to Vars object
		Capitan.Vars = $.extend(Capitan.Vars, {
			$html: $('html'),
			$body: $('body'),
			$window: $(window),
			$doc: $(document)
		});

		//Assets that are necessary globally and on every page, can and will be loaded here
		Capitan.Util.fetchBeforeRender = function () {
			return $.import([
				{
					condition: true,
					order: 0,
					fetch: [
						// <@bundle#before-render
						Capitan.Vars.folderPath + 'js/util/console-polyfill.js',
						Capitan.Vars.folderPath + 'js/util/inject-smartresize.js',
						Capitan.Vars.folderPath + 'js/function/assert-breakpoint.js',
						Capitan.Vars.folderPath + 'js/function/get-breakpoint.js',
						Capitan.Vars.folderPath + 'js/function/get-orientation.js',
						Capitan.Vars.folderPath + 'js/function/get-computed-style.js',
						Capitan.Vars.folderPath + 'js/util/set-breakpoints.js',
						Capitan.Vars.folderPath + 'js/handle/set-event-class.js',
						Capitan.Vars.folderPath + 'js/handle/resize-handler.js',
						Capitan.Vars.folderPath + 'js/function/get-unique.js'
						// bundle@>
					],
					callback: [
						{ method: Capitan.Util.loadComponents }
					],
					unique: 123718
				}
			], false);
		};

		// Component loader
		Capitan.Util.loadComponents = function () {
			$.import([
				// <@delete
				{
					condition: $('.mw-headline'),
					fetch: [
						Capitan.Vars.folderPath + 'js/libs/bra/bra_module-widget/bra_module-widget.js',
						Capitan.Vars.folderPath + 'js/libs/bra/bra_module-widget/bra_module-widget.css'
					],
					unique: Capitan.Function.getUnique()
				},
				// delete@>
				{
					condition: Capitan.Function.assertBreakpoint('lt', 'md'),
					fetch: [
						// <@bundle#h5bp-helper
						Capitan.Vars.folderPath + 'js/libs/vendor/h5bp/helper.js',
						Capitan.Vars.folderPath + 'js/util/h5bp-helper.js'
						// bundle@>
					],
					unique: Capitan.Function.getUnique()
				},
				{
					// load always and always from server
					condition: true,
					fetch: [
						Capitan.Vars.folderPath + 'js/hotfix.js',
						Capitan.Vars.folderPath + 'css/hotfix.css'
					],
					unique: new Date().getTime()
				},
				{
					condition: $('.alert'),
					fetch: [
						Capitan.Vars.folderPath + 'component/alert/alert.css'
					],
					unique: Capitan.Function.getUnique()
				},
				{
					condition: $('form'),
					fetch: [
						Capitan.Vars.folderPath + 'component/forms/forms.css'
					],
					unique: Capitan.Function.getUnique()
				},
				{
					condition: $('.btn'),
					fetch: [
						Capitan.Vars.folderPath + 'component/buttons/buttons.css'
					],
					unique: Capitan.Function.getUnique()
				}// <@newComponent@>
			], true);
		};

		// snippets placeholder
		// --- start|bra-pb: js ---
		// --- end|bra-pb: js ---

		/**
		 * document ready call
		 */
		$(function () {
			Capitan.Util.fetchBeforeRender();
		});
	})(jQuery);
}, function () {
	// <@delete
	console.error('main.js: fetching of scripts and initialization failed');
	// delete@>
});