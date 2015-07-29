/**
 * Interactive prompt for your Grunt config using console
 * https://www.npmjs.com/package/grunt-prompt
 */

// TODO: get all system files and push it to the 'choices' array

module.exports = {
	init: {
		options: {
			questions: [
				{
					config: 'initSystem',
					type: 'list',
					message: 'Which system you want to initialize?',
					choices: ['zend', 'typo3']
				}
			]
		}
	}
};