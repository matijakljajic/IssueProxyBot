/**
 * Feature request template for GitHub issues - built from segments
 */
export const template = `
## Use Case
{useCase}

## Proposed Solution
{solution}

{email_section}

---
*Submitted via [Issue Proxy Bot](https://github.com/matijakljajic/IssueProxyBot)*
`.trim();

/**
 * Optional email
 */
export const emailSection = `
## Reporter
Email: {email}
`.trim();
