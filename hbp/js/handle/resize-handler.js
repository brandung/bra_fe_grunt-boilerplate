/**
 * brandung
 *
 * Copyright brandung GmbH & Co.KG
 * http://www.brandung.de/
 *
 * Date: 19.08.2015
 * MIT License (MIT)
 *
 * Main resize handler
 * Sets the currentBreakpoint and currentOrientation variables and sets related classes on the html element; Triggers an event (on document), when the breakpoint has changed
 */
Brandung.Handle.resizeHandler = function () {
	var _ = {};

	_.handler = function () {
		var breakpoint, orientation;

		Brandung.Vars.currentBreakpoint = Brandung.Function.getBreakpoint();
		Brandung.Vars.currentOrientation = Brandung.Function.getOrientation();

		breakpoint = 'on-breakpoint-' + Brandung.Vars.currentBreakpoint;
		orientation = 'on-orientation-' + Brandung.Vars.currentOrientation;

		if (!Brandung.Vars.$html.hasClass(breakpoint)) {
			Brandung.Vars.$html[0]
				.className = Brandung.Vars.$html[0].className
				.replace(/\s?on-breakpoint-(xs|sm|md|lg|xl)/g, '');

			Brandung.Vars.$doc.trigger('on-set-class', [breakpoint]);
			Brandung.Vars.$doc.trigger('on-changed-breakpoint', [Brandung.Vars.currentBreakpoint]);
		}

		if (!Brandung.Vars.$html.hasClass(orientation)) {
			Brandung.Vars.$html[0]
				.className = Brandung.Vars.$html[0].className
				.replace(/\s?on-orientation-(landscape|portrait)/g, '');

			Brandung.Vars.$doc.trigger('on-set-class', [orientation]);
		}
	};

	// TODO: evaluate if smartresize is triggered on orientationchange
	Brandung.Vars.$window.smartresize(_.handler);
	_.handler();
}();