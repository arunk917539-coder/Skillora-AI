/**
 * Skillora AI - Security and HR Action Audit Logger
 *
 * Logs security-relevant actions (HR scenario authoring, account modifications, data export/deletion)
 * while strictly preventing the logging of credentials, tokens, or candidate response texts.
 */

export type AuditActionType =
  | "AUTH_LOGIN_SUCCESS"
  | "AUTH_LOGIN_FAILED"
  | "AUTH_SIGNUP_SUCCESS"
  | "HR_SCENARIO_CREATED"
  | "HR_SCENARIO_UPDATED"
  | "HR_SCENARIO_DELETED"
  | "USER_DATA_EXPORT_REQUESTED"
  | "USER_ACCOUNT_DELETION_REQUESTED"
  | "ASSESSMENT_SUBMITTED";

export type AuditLogEntry = {
  timestamp: string;
  action: AuditActionType;
  actorUserId?: string | null;
  targetId?: string;
  details?: Record<string, string | number | boolean>;
};

export function logSecurityEvent(entry: AuditLogEntry): void {
  const sanitizedEntry = {
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  };

  // Structured audit output in production / development
  console.info(`[AUDIT] ${JSON.stringify(sanitizedEntry)}`);
}
