/**
 * Default simple template for GitHub issues
 */
export const template = `
## Description
{description}

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
