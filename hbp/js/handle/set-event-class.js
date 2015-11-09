/**
 * brandung
 *
 * Copyright brandung GmbH & Co.KG
 * http://www.brandung.de/
 *
 * Date: 19.08.2015
 * MIT License (MIT)
 *
 * Adds a given class to the html element, when the event 'on-set-class' occurs, e.g. when the breakpoint has changed (see handle/resize-handler.js for more information)
 */
Brandung.Handle.setEventClass = function () {
	var _ = {};

	_.handler = function (event, className) {
		Brandung.Vars.$html.addClass(className);
	};

	Brandung.Vars.$doc.on('on-set-class', _.handler);
}();