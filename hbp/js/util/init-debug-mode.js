/**
 * brandung
 *
 * Copyright brandung GmbH & Co.KG
 * http://www.brandung.de/
 *
 * Date: 19.08.2015
 * MIT License (MIT)
 *
 * Initializes the module overview widget for template development
 */
Brandung.Util.initDebugMode = function ($) {
	if (Brandung.Vars.isDev) {
		$('body').bra_moduleWidget();

		// hide widget on small displays
		var showWidget = function () {
			if (Brandung.Function.assertBreakpoint('lt', 'md')) {
				$('#bra-module-widget').hide();
			} else {
				$('#bra-module-widget').show();
			}
		};

		Brandung.Vars.$window.load(function () {
			showWidget();
		}).resize(function () {
			showWidget();
		});
	}
}(jQuery);