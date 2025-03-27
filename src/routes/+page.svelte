<script lang="ts">
	import type { TemplateType, IssueRequest } from '$lib/types/issue';

	// Validation regex patterns
	const patterns = {
		title: /^.{5,70}$/, // 5-100 characters
		description: /^[\s\S]{10,}$/, // At least 10 characters
		steps: /^[\s\S]{10,}$/, // At least 10 characters
		expected: /^[\s\S]{5,}$/, // At least 5 characters
		actual: /^[\s\S]{5,}$/, // At least 5 characters
		useCase: /^[\s\S]{10,}$/, // At least 10 characters
		solution: /^[\s\S]{10,}$/, // At least 10 characters (required)
		email: /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	};

	// Error messages
	const errorMessages = {
		title: 'Title must be between 5 and 100 characters',
		description: 'Description should be at least 10 characters',
		steps: 'Steps should be at least 10 characters',
		expected: 'Expected behavior should be at least 5 characters',
		actual: 'Actual behavior should be at least 5 characters',
		useCase: 'Use case should be at least 10 characters',
		solution: 'Solution proposal should be at least 10 characters',
		email: 'Please enter a valid email address or leave it empty'
	};

	// Field validation status
	type ValidationStatus = {
		[key: string]: { valid: boolean; message: string };
	};

	let validationStatus: ValidationStatus = {};

	// Form data
	let formData = {
		title: '',
		type: 'default' as TemplateType,
		description: '',
		steps: '',
		expected: '',
		actual: '',
		useCase: '',
		solution: '',
		email: ''
	};

	let submitting: boolean = false;
	let result: any = null;
	let showEmailField: boolean = false;

	// Validate a field
	function validateField(field: string, value: string): { valid: boolean; message: string } {
		if (!patterns[field as keyof typeof patterns].test(value)) {
			return { valid: false, message: errorMessages[field as keyof typeof errorMessages] };
		}
		return { valid: true, message: '' };
	}

	// Handle input changes and validate
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement | HTMLTextAreaElement;
		const field = target.id;
		const value = target.value;

		validationStatus[field] = validateField(field, value);
	}

	// Check if the form is valid
	function isFormValid(): boolean {
		// Validate title for all forms
		validationStatus.title = validateField('title', formData.title);

		// Validate fields based on issue type
		if (formData.type === 'default') {
			validationStatus.description = validateField('description', formData.description);
		} else if (formData.type === 'bug-report') {
			validationStatus.steps = validateField('steps', formData.steps);
			validationStatus.expected = validateField('expected', formData.expected);
			validationStatus.actual = validateField('actual', formData.actual);
		} else if (formData.type === 'feature-request') {
			validationStatus.useCase = validateField('useCase', formData.useCase);
			validationStatus.solution = validateField('solution', formData.solution);
		}

		// Validate email if provided
		if (showEmailField) {
			validationStatus.email = validateField('email', formData.email);
		}

		// Check if all required fields are valid
		return Object.values(validationStatus).every((status) => status.valid);
	}

	// Get formatted title with issue type prefix
	function getFormattedTitle(type: TemplateType, title: string): string {
		switch (type) {
			case 'bug-report':
				return `[BUG] ${title}`;
			case 'feature-request':
				return `[FEAT] ${title}`;
			default:
				return title;
		}
	}

	// Form submission
	async function submitIssue(): Promise<void> {
		if (!isFormValid()) {
			return;
		}

		submitting = true;
		result = null;

		try {
			// Build the appropriate request based on the form type
			let requestData: IssueRequest;

			// Format title with issue type prefix
			const formattedTitle = getFormattedTitle(formData.type, formData.title);

			// Common fields
			const commonFields = {
				title: formattedTitle,
				...(showEmailField && formData.email ? { email: formData.email } : {})
			};

			// Create the appropriate request type based on the discriminated union
			if (formData.type === 'default') {
				requestData = {
					...commonFields,
					type: 'default',
					description: formData.description
				};
			} else if (formData.type === 'bug-report') {
				requestData = {
					...commonFields,
					type: 'bug-report',
					steps: formData.steps,
					expected: formData.expected,
					actual: formData.actual
				};
			} else {
				requestData = {
					...commonFields,
					type: 'feature-request',
					useCase: formData.useCase,
					solution: formData.solution
				};
			}

			const response = await fetch('/api/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData)
			});

			result = await response.json();

			if (result.success) {
				// Reset form on success
				formData = {
					title: '',
					type: 'default',
					description: '',
					steps: '',
					expected: '',
					actual: '',
					useCase: '',
					solution: '',
					email: ''
				};
				showEmailField = false;
				validationStatus = {};
			}
		} catch (error) {
			result = {
				success: false,
				message: 'Could not submit your issue. Please try again later.'
			};
		} finally {
			submitting = false;
		}
	}

	// Reset form fields when template type changes
	function handleTemplateChange() {
		// Clear validation status when changing forms
		validationStatus = {};
	}
</script>

<svelte:head>
	<title>Submit an Issue</title>
</svelte:head>

<main class="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
	<div class="prose prose-blue max-w-none">
		<h1>Report an Issue</h1>

		<p class="mb-6">Please fill out this form to report a problem or suggest an improvement.</p>
	</div>

	{#if result}
		<div
			class="my-6 rounded-lg p-4 {result.success
				? 'border border-green-200 bg-green-50'
				: 'border border-red-200 bg-red-50'}"
		>
			<div class="prose prose-sm">
				{#if result.success}
					<h2 class="mt-0 text-green-700">Thank you!</h2>
					<p class="text-green-700">Your issue has been submitted successfully.</p>
					<p>
						<a
							href={result.issueUrl}
							target="_blank"
							rel="noopener"
							class="text-blue-600 underline hover:text-blue-800"
						>
							View your issue on GitHub
						</a>
					</p>
				{:else}
					<h2 class="mt-0 text-red-700">Something went wrong</h2>
					<p class="text-red-700">{result.message || 'Please try again later.'}</p>
				{/if}
			</div>
		</div>
	{/if}

	<form on:submit|preventDefault={submitIssue} class="space-y-6">
		<!-- Issue Type Selection -->
		<div>
			<label for="type" class="mb-1 block text-sm font-medium text-gray-700"> Issue Type </label>
			<select
				id="type"
				bind:value={formData.type}
				on:change={handleTemplateChange}
				class="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
			>
				<option value="default">General Issue</option>
				<option value="bug-report">Bug Report</option>
				<option value="feature-request">Feature Request</option>
			</select>
		</div>

		<!-- Title Field -->
		<div>
			<label for="title" class="mb-1 block text-sm font-medium text-gray-700">
				What's the issue about? <span class="text-red-500">*</span>
			</label>
			<input
				id="title"
				bind:value={formData.title}
				on:input={handleInput}
				placeholder="Brief summary of the issue"
				required
				class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {validationStatus
					.title?.valid === false
					? 'border-red-300'
					: ''}"
			/>
			{#if validationStatus.title?.valid === false}
				<p class="mt-1 text-sm text-red-600">{validationStatus.title.message}</p>
			{/if}
		</div>

		<!-- Default Template Fields -->
		{#if formData.type === 'default'}
			<div>
				<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
					Description <span class="text-red-500">*</span>
				</label>
				<textarea
					id="description"
					bind:value={formData.description}
					on:input={handleInput}
					rows="4"
					placeholder="Please provide details about your issue"
					required
					class="form-textarea block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {validationStatus
						.description?.valid === false
						? 'border-red-300'
						: ''}"
				></textarea>
				{#if validationStatus.description?.valid === false}
					<p class="mt-1 text-sm text-red-600">{validationStatus.description.message}</p>
				{/if}
			</div>
		{/if}

		<!-- Bug Report Fields -->
		{#if formData.type === 'bug-report'}
			<div>
				<label for="steps" class="mb-1 block text-sm font-medium text-gray-700">
					Steps to Reproduce <span class="text-red-500">*</span>
				</label>
				<textarea
					id="steps"
					bind:value={formData.steps}
					on:input={handleInput}
					rows="3"
					placeholder="1. Click on...
2. Navigate to...
3. Observe that..."
					required
					class="form-textarea block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {validationStatus
						.steps?.valid === false
						? 'border-red-300'
						: ''}"
				></textarea>
				{#if validationStatus.steps?.valid === false}
					<p class="mt-1 text-sm text-red-600">{validationStatus.steps.message}</p>
				{/if}
			</div>

			<div>
				<label for="expected" class="mb-1 block text-sm font-medium text-gray-700">
					Expected Behavior <span class="text-red-500">*</span>
				</label>
				<textarea
					id="expected"
					bind:value={formData.expected}
					on:input={handleInput}
					rows="2"
					placeholder="What should have happened?"
					required
					class="form-textarea block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {validationStatus
						.expected?.valid === false
						? 'border-red-300'
						: ''}"
				></textarea>
				{#if validationStatus.expected?.valid === false}
					<p class="mt-1 text-sm text-red-600">{validationStatus.expected.message}</p>
				{/if}
			</div>

			<div>
				<label for="actual" class="mb-1 block text-sm font-medium text-gray-700">
					Actual Behavior <span class="text-red-500">*</span>
				</label>
				<textarea
					id="actual"
					bind:value={formData.actual}
					on:input={handleInput}
					rows="2"
					placeholder="What actually happened instead?"
					required
					class="form-textarea block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {validationStatus
						.actual?.valid === false
						? 'border-red-300'
						: ''}"
				></textarea>
				{#if validationStatus.actual?.valid === false}
					<p class="mt-1 text-sm text-red-600">{validationStatus.actual.message}</p>
				{/if}
			</div>
		{/if}

		<!-- Feature Request Fields -->
		{#if formData.type === 'feature-request'}
			<div>
				<label for="useCase" class="mb-1 block text-sm font-medium text-gray-700">
					Use Case <span class="text-red-500">*</span>
				</label>
				<textarea
					id="useCase"
					bind:value={formData.useCase}
					on:input={handleInput}
					rows="3"
					placeholder="When would this feature be useful? What problem does it solve?"
					required
					class="form-textarea block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {validationStatus
						.useCase?.valid === false
						? 'border-red-300'
						: ''}"
				></textarea>
				{#if validationStatus.useCase?.valid === false}
					<p class="mt-1 text-sm text-red-600">{validationStatus.useCase.message}</p>
				{/if}
			</div>

			<div>
				<label for="solution" class="mb-1 block text-sm font-medium text-gray-700">
					Proposed Solution <span class="text-red-500">*</span>
				</label>
				<textarea
					id="solution"
					bind:value={formData.solution}
					on:input={handleInput}
					rows="3"
					placeholder="How do you think this feature should be implemented?"
					required
					class="form-textarea block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {validationStatus
						.solution?.valid === false
						? 'border-red-300'
						: ''}"
				></textarea>
				{#if validationStatus.solution?.valid === false}
					<p class="mt-1 text-sm text-red-600">{validationStatus.solution.message}</p>
				{/if}
			</div>
		{/if}

		<!-- Email Field Toggle -->
		<div>
			<button
				type="button"
				class="text-sm text-blue-600 underline hover:text-blue-800"
				on:click={() => (showEmailField = !showEmailField)}
			>
				{showEmailField ? 'Hide contact information' : 'Add contact information'}
			</button>

			{#if showEmailField}
				<div class="mt-3">
					<label for="email" class="mb-1 block text-sm font-medium text-gray-700">
						Email address (optional)
					</label>
					<input
						id="email"
						type="email"
						bind:value={formData.email}
						on:input={handleInput}
						placeholder="your.email@example.com"
						class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 {validationStatus
							.email?.valid === false
							? 'border-red-300'
							: ''}"
					/>
					{#if validationStatus.email?.valid === false}
						<p class="mt-1 text-sm text-red-600">{validationStatus.email.message}</p>
					{/if}
					<p class="mt-1 text-sm text-gray-500">We'll use this to follow up if needed.</p>
				</div>
			{/if}
		</div>

		<!-- Submit Button -->
		<div>
			<button
				type="submit"
				disabled={submitting}
				class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{submitting ? 'Submitting...' : 'Submit Issue'}
			</button>
		</div>
	</form>
</main>
