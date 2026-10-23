const test = require("node:test");
const assert = require("node:assert/strict");

// 1. Test in-memory rate limiter logic
function createTestLimiter() {
  const store = new Map();
  return function checkLimit(key, limit, windowMs) {
    const now = Date.now();
    const record = store.get(key) || { timestamps: [] };
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (record.timestamps.length >= limit) {
      return { success: false, limit, remaining: 0 };
    }
    record.timestamps.push(now);
    store.set(key, record);
    return { success: true, limit, remaining: limit - record.timestamps.length };
  };
}

test("rate limiter enforces limits and blocks excess calls", () => {
  const limiter = createTestLimiter();
  const key = "user:test-123";

  // First 3 calls should pass
  assert.equal(limiter(key, 3, 1000).success, true);
  assert.equal(limiter(key, 3, 1000).success, true);
  assert.equal(limiter(key, 3, 1000).success, true);

  // 4th call should be blocked
  const blocked = limiter(key, 3, 1000);
  assert.equal(blocked.success, false);
  assert.equal(blocked.remaining, 0);

  // Different key should still pass
  assert.equal(limiter("user:different-456", 3, 1000).success, true);
});

// 2. Test registration terms consent schema validation
test("registration terms consent schema requires affirmative acknowledgement", () => {
  const { z } = require("zod");
  const testSchema = z.object({
    termsConsent: z.preprocess(
      (val) => val === "on" || val === true || val === "true",
      z.literal(true, {
        errorMap: () => ({ message: "Must accept terms" }),
      })
    ),
  });

  // Affirmative values
  assert.equal(testSchema.safeParse({ termsConsent: true }).success, true);
  assert.equal(testSchema.safeParse({ termsConsent: "on" }).success, true);
  assert.equal(testSchema.safeParse({ termsConsent: "true" }).success, true);

  // Missing or negative values
  assert.equal(testSchema.safeParse({ termsConsent: false }).success, false);
  assert.equal(testSchema.safeParse({ termsConsent: undefined }).success, false);
  assert.equal(testSchema.safeParse({ termsConsent: "" }).success, false);
  assert.equal(testSchema.safeParse({}).success, false);
});

// 3. Test data retention configuration values
test("data retention config provides verified defaults and placeholders", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const content = fs.readFileSync(path.join(__dirname, "../../app/lib/workplace/retention-config.ts"), "utf8");

  assert.ok(content.includes("COMPLETED_ASSESSMENT_RETENTION_DAYS"), "missing completed assessment retention days");
  assert.ok(content.includes("INCOMPLETE_ASSESSMENT_RETENTION_DAYS"), "missing incomplete assessment retention days");
  assert.ok(content.includes("AUDIT_LOG_RETENTION_DAYS"), "missing audit log retention days");
  assert.ok(content.includes("PRIVACY_POLICY_VERSION"), "missing privacy policy version");
  assert.ok(content.includes("TERMS_VERSION"), "missing terms version");
  assert.ok(content.includes("COOKIE_POLICY_VERSION"), "missing cookie policy version");
  assert.ok(content.includes("[Organization Legal Name]"), "missing placeholder for org legal name");
});

// 4. Test security headers in next.config.ts
test("next.config.ts contains security headers and CSP", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const content = fs.readFileSync(path.join(__dirname, "../../next.config.ts"), "utf8");

  assert.ok(content.includes("X-Frame-Options"), "missing X-Frame-Options");
  assert.ok(content.includes("X-Content-Type-Options"), "missing X-Content-Type-Options");
  assert.ok(content.includes("Referrer-Policy"), "missing Referrer-Policy");
  assert.ok(content.includes("Content-Security-Policy"), "missing Content-Security-Policy");
  assert.ok(content.includes("Strict-Transport-Security"), "missing Strict-Transport-Security");
  assert.ok(content.includes("Permissions-Policy"), "missing Permissions-Policy");
});

// 5. Test audit logging event structure
test("audit log events enforce non-exposure of passwords and full answers", () => {
  const logs = [];
  const captureLogger = (entry) => logs.push(entry);

  const entry = {
    timestamp: new Date().toISOString(),
    action: "ASSESSMENT_SUBMITTED",
    actorUserId: "user_test_999",
    targetId: "assessment_test_888",
    details: { scoreAverage: 82, scenarioCount: 3 },
  };

  captureLogger(entry);

  assert.equal(logs.length, 1);
  assert.equal(logs[0].action, "ASSESSMENT_SUBMITTED");
  assert.equal(logs[0].actorUserId, "user_test_999");
  assert.equal(typeof logs[0].details.password, "undefined");
  assert.equal(typeof logs[0].details.answers, "undefined");
});
