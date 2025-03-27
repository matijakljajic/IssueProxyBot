// Import all templates
import * as defaultTemplate from '$lib/templates/generic-issue';
import * as bugReportTemplate from '$lib/templates/bug-report';
import * as featureRequestTemplate from '$lib/templates/feature-request';
import type { TemplateType, TemplateData } from '$lib/types/issue';

/**
 * Formats an issue body using the specified template
 *
 * @param data Template data with type discriminator
 * @returns Formatted issue body
 */
export function formatIssue(data: TemplateData): string {
	// Select the appropriate template
	const templateModule = getTemplateModule(data.type);

	// Start with the template
	let result = templateModule.template;

	// Replace all placeholders with the provided data
	for (const [key, value] of Object.entries(data)) {
		// Skip the type field since it's not a template placeholder
		if (key !== 'type' && value !== undefined) {
			result = result.replace(new RegExp(`{${key}}`, 'g'), value);
		}
	}

	// Handle email section
	if (data.email) {
		const formattedEmailSection = templateModule.emailSection.replace('{email}', data.email);
		result = result.replace('{email_section}', formattedEmailSection);
	} else {
		result = result.replace('{email_section}', '');
	}

	// Remove any remaining placeholders with empty strings
	result = result.replace(/{[^{}]+}/g, '');

	return result;
}

/**
 * Get the template module based on type
 */
function getTemplateModule(type: TemplateType) {
	switch (type) {
		case 'bug-report':
			return bugReportTemplate;
		case 'feature-request':
			return featureRequestTemplate;
		case 'default':
		default:
			return defaultTemplate;
	}
}
