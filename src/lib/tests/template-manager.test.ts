import { describe, it, expect } from 'vitest';
import { isDefaultIssue, isBugReport, isFeatureRequest } from '$lib/types/issue';
import type { IssueRequest } from '$lib/types/issue';

describe('Issue Type Guards', () => {
	it('correctly identifies default issues', () => {
		const defaultIssue: IssueRequest = {
			type: 'default',
			title: 'Test Issue',
			description: 'Description goes here'
		};

		const bugReport: IssueRequest = {
			type: 'bug-report',
			title: 'Test Bug',
			steps: 'Step 1',
			expected: 'Expected result',
			actual: 'Actual result'
		};

		expect(isDefaultIssue(defaultIssue)).toBe(true);
		expect(isDefaultIssue(bugReport)).toBe(false);
	});

	it('correctly identifies bug reports', () => {
		const bugReport: IssueRequest = {
			type: 'bug-report',
			title: 'Test Bug',
			steps: 'Step 1',
			expected: 'Expected result',
			actual: 'Actual result'
		};

		const featureRequest: IssueRequest = {
			type: 'feature-request',
			title: 'Test Feature',
			useCase: 'Use case',
			solution: 'Solution'
		};

		expect(isBugReport(bugReport)).toBe(true);
		expect(isBugReport(featureRequest)).toBe(false);
	});

	it('correctly identifies feature requests', () => {
		const featureRequest: IssueRequest = {
			type: 'feature-request',
			title: 'Test Feature',
			useCase: 'Use case',
			solution: 'Solution'
		};

		const defaultIssue: IssueRequest = {
			type: 'default',
			title: 'Test Issue',
			description: 'Description'
		};

		expect(isFeatureRequest(featureRequest)).toBe(true);
		expect(isFeatureRequest(defaultIssue)).toBe(false);
	});

	it('handles all issue types with additional fields correctly', () => {
		const defaultWithEmail: IssueRequest = {
			type: 'default',
			title: 'Default with Email',
			description: 'Description',
			email: 'test@example.com',
			labels: ['documentation']
		};

		expect(isDefaultIssue(defaultWithEmail)).toBe(true);
		expect(isBugReport(defaultWithEmail)).toBe(false);
		expect(isFeatureRequest(defaultWithEmail)).toBe(false);
	});
});
