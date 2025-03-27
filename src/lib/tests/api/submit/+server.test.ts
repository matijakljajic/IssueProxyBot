import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatIssue } from '$lib/utils/template-manager';

// Mock formatIssue
vi.mock('$lib/utils/template-manager', () => ({
	formatIssue: vi.fn().mockReturnValue('Formatted issue body')
}));

// Mock the Octokit class
const mockOctokitRequest = vi.fn().mockResolvedValue({
	data: {
		html_url: 'https://github.com/user/repo/issues/123',
		number: 123
	}
});

class MockOctokit {
	request = mockOctokitRequest;
}

vi.mock('@octokit/core', () => ({
	Octokit: vi.fn().mockImplementation(() => new MockOctokit())
}));

// Import POST after mocking dependencies
import { POST } from '../../../../routes/api/submit/+server';

describe('Issue API Endpoint', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		// Reset the mock implementation of request
		mockOctokitRequest.mockResolvedValue({
			data: {
				html_url: 'https://github.com/user/repo/issues/123',
				number: 123
			}
		});
	});

	it('handles default issues correctly', async () => {
		const mockRequest = {
			json: vi.fn().mockResolvedValue({
				type: 'default',
				title: 'Test Issue',
				description: 'This is a test description'
			})
		};

		// Use platform prop to inject environment variables
		const response = await POST({
			request: mockRequest,
			platform: {
				env: {
					GITHUB_TOKEN: 'test-token',
					REPO_OWNER: 'test-owner',
					REPO_NAME: 'test-repo'
				}
			}
		} as any);

		const result = await response.json();

		expect(result.success).toBe(true);
		expect(result.issueNumber).toBe(123);
		expect(formatIssue).toHaveBeenCalledWith({
			type: 'default',
			description: 'This is a test description',
			email: undefined
		});
	});

	// Other tests follow the same pattern, using platform.env
	// ...

	it('handles missing GitHub token', async () => {
		const mockRequest = {
			json: vi.fn().mockResolvedValue({
				type: 'default',
				title: 'Test Issue',
				description: 'Description'
			})
		};

		const response = await POST({
			request: mockRequest,
			platform: {
				env: {
					// No GITHUB_TOKEN
					REPO_OWNER: 'test-owner',
					REPO_NAME: 'test-repo'
				}
			}
		} as any);

		const result = await response.json();

		expect(result.success).toBe(false);
		expect(result.message).toContain('GitHub token is missing');
	});
});
