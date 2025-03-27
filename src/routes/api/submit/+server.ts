import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { Octokit } from '@octokit/core';
import { env } from '$env/dynamic/private';
import { formatIssue } from '$lib/utils/template-manager';
import {
	type IssueRequest,
	type IssueResponse,
	type TemplateData,
	isDefaultIssue,
	isBugReport,
	isFeatureRequest
} from '$lib/types/issue';

type Platform = {
	env?: Record<string, string>;
};

type RequestEvent = {
	request: Request;
	platform?: Platform;
};

export const POST: RequestHandler = async ({ request, platform }: RequestEvent) => {
	try {
		// Get environment variables from multiple possible sources
		const GITHUB_TOKEN = platform?.env?.GITHUB_TOKEN || env.GITHUB_TOKEN;
		const REPO_OWNER = platform?.env?.REPO_OWNER || env.REPO_OWNER;
		const REPO_NAME = platform?.env?.REPO_NAME || env.REPO_NAME;

		// Check if environment variables are set
		if (!GITHUB_TOKEN) {
			console.error('GITHUB_TOKEN is missing');
			return json(
				{
					success: false,
					message: 'Server configuration error: GitHub token is missing'
				} as IssueResponse,
				{ status: 500 }
			);
		}

		if (!REPO_OWNER || !REPO_NAME) {
			console.error('Repository configuration is incomplete');
			return json(
				{
					success: false,
					message: 'Server configuration error: Repository information is missing'
				} as IssueResponse,
				{ status: 500 }
			);
		}

		// Parse the request body
		let requestData: IssueRequest;
		try {
			requestData = (await request.json()) as IssueRequest;
		} catch (error) {
			return json(
				{
					success: false,
					message: 'Invalid JSON in request body'
				} as IssueResponse,
				{ status: 400 }
			);
		}

		// Extract common fields
		const { title, type, email = '', labels = [] } = requestData;

		// Validate required common field
		if (!title || typeof title !== 'string') {
			return json(
				{
					success: false,
					message: 'Title is required and must be a string'
				} as IssueResponse,
				{ status: 400 }
			);
		}

		// Prepare template data based on request type
		let templateData: TemplateData;

		// Validate and prepare data by type using type guards
		if (isDefaultIssue(requestData)) {
			if (!requestData.description) {
				return json(
					{
						success: false,
						message: 'Description is required for general issues'
					} as IssueResponse,
					{ status: 400 }
				);
			}
			templateData = {
				type: 'default',
				description: requestData.description,
				email: email || undefined
			};
		} else if (isBugReport(requestData)) {
			if (!requestData.steps || !requestData.expected || !requestData.actual) {
				return json(
					{
						success: false,
						message: 'Bug reports require steps, expected behavior, and actual behavior'
					} as IssueResponse,
					{ status: 400 }
				);
			}

			templateData = {
				type: 'bug-report',
				steps: requestData.steps,
				expected: requestData.expected,
				actual: requestData.actual,
				email: email || undefined
			};
		} else if (isFeatureRequest(requestData)) {
			if (!requestData.useCase || !requestData.solution) {
				return json(
					{
						success: false,
						message: 'Feature requests require both a use case and a solution proposal'
					} as IssueResponse,
					{ status: 400 }
				);
			}

			templateData = {
				type: 'feature-request',
				useCase: requestData.useCase,
				solution: requestData.solution,
				email: email || undefined
			};
		} else {
			return json(
				{
					success: false,
					message: 'Invalid template type'
				} as IssueResponse,
				{ status: 400 }
			);
		}

		// Format the issue body using the template with segments
		const issueBody = formatIssue(templateData);

		// Initialize GitHub API client
		const octokit = new Octokit({ auth: GITHUB_TOKEN });

		console.log(`Creating issue in ${REPO_OWNER}/${REPO_NAME}: ${title}`);

		// Create the issue on GitHub
		const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
			owner: REPO_OWNER,
			repo: REPO_NAME,
			title,
			body: issueBody,
			labels: Array.isArray(labels) ? labels : []
		});

		console.log(`Issue created successfully: #${response.data.number}`);

		// Return success with the issue URL
		return json({
			success: true,
			message: 'Issue created successfully',
			issueUrl: response.data.html_url,
			issueNumber: response.data.number
		} as IssueResponse);
	} catch (error) {
		console.error('Error creating issue:', error);

		return json(
			{
				success: false,
				message: 'Failed to create issue',
				error: error instanceof Error ? error.message : 'Unknown error'
			} as IssueResponse,
			{ status: 500 }
		);
	}
};
