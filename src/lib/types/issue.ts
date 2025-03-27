/**
 * Available issue template types
 */
export type TemplateType = 'default' | 'bug-report' | 'feature-request';

/**
 * Common fields shared across all issue types
 */
interface IssueBase {
	title: string;
	email?: string;
	labels?: string[];
}

/**
 * Issue request payload definitions with discriminated union
 */
export type IssueRequest =
	| ({ type: 'default'; description: string } & IssueBase)
	| ({ type: 'bug-report'; steps: string; expected: string; actual: string } & IssueBase)
	| ({ type: 'feature-request'; useCase: string; solution: string } & IssueBase);

/**
 * Template data union type that matches the request types
 */
export type TemplateData =
	| { type: 'default'; description: string; email?: string }
	| { type: 'bug-report'; steps: string; expected: string; actual: string; email?: string }
	| { type: 'feature-request'; useCase: string; solution: string; email?: string };

/**
 * Success/error response from the API
 */
export interface IssueResponse {
	success: boolean;
	message?: string;
	issueUrl?: string;
	issueNumber?: number;
	error?: string;
}

/**
 * Type guards for narrowing issue request types
 */
export const isDefaultIssue = (
	request: IssueRequest
): request is IssueRequest & { type: 'default' } => request.type === 'default';

export const isBugReport = (
	request: IssueRequest
): request is IssueRequest & { type: 'bug-report' } => request.type === 'bug-report';

export const isFeatureRequest = (
	request: IssueRequest
): request is IssueRequest & { type: 'feature-request' } => request.type === 'feature-request';
