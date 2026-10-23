/**
 * Skillora AI - Data Retention & Governance Configuration
 *
 * NOTE: The values below represent default technical configurations.
 * Final retention schedules and legal hold rules must be reviewed and
 * approved by qualified legal counsel and organizational leadership.
 */

export const DATA_RETENTION_CONFIG = {
  /** Retention period for completed assessment records and rubric evaluations (in days) */
  COMPLETED_ASSESSMENT_RETENTION_DAYS: Number(process.env.RETENTION_COMPLETED_DAYS || 365), // Default: 1 Year

  /** Retention period for abandoned / incomplete assessment drafts (in days) */
  INCOMPLETE_ASSESSMENT_RETENTION_DAYS: Number(process.env.RETENTION_INCOMPLETE_DAYS || 30), // Default: 30 Days

  /** Retention period for audit logs of sensitive HR actions (in days) */
  AUDIT_LOG_RETENTION_DAYS: Number(process.env.RETENTION_AUDIT_LOGS_DAYS || 730), // Default: 2 Years

  /** Policy versions */
  PRIVACY_POLICY_VERSION: "2026-10-v1",
  TERMS_VERSION: "2026-10-v1",
  COOKIE_POLICY_VERSION: "2026-10-v1",

  /** Contact & Organization Placeholders */
  ORGANIZATION_NAME: process.env.NEXT_PUBLIC_ORG_NAME || "[Organization Legal Name]",
  PRIVACY_EMAIL: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "privacy@skillora.ai.example",
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@skillora.ai.example",
  ORGANIZATION_ADDRESS: process.env.NEXT_PUBLIC_ORG_ADDRESS || "[Registered Physical Address, City, Country]",
  GOVERNING_JURISDICTION: process.env.NEXT_PUBLIC_JURISDICTION || "[Applicable Governing Jurisdiction, e.g. State / Country]",
} as const;
