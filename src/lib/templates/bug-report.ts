/**
 * Bug report template for GitHub issues - built from segments
 */
export const template = `
## Steps to Reproduce
{steps}

## Expected Behavior
{expected}

## Actual Behavior
{actual}

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
