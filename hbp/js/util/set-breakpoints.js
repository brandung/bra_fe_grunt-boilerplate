/**
 * brandung
 *
 * Copyright brandung GmbH & Co.KG
 * http://www.brandung.de/
 *
 * Date: 24.08.2015
 * MIT License (MIT)
 *
 * Sets the breakpoint variable by parsing a json object inside of a pseudo element of the body (checkout layout.scss for more information)
 */
Brandung.Util.setBreakpoints = function () {
	Brandung.Vars.breakpoints = JSON.parse(Brandung.Function.getComputedStyle('body', ':before', 'content'));
}();