import app from "../src/index.js";
import { prisma, disconnectDatabase } from "../src/config/database.js";
import bcrypt from "bcryptjs";
import type { Server } from "http";

async function runTests() {
  console.log("🧪 Starting Stage 3A & 3B Comprehensive API Integration Tests...");
  let server: Server;
  let port: number;
  let baseUrl: string;

  // Start app on ephemeral port
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address();
      port = typeof addr === "object" && addr ? addr.port : 5002;
      baseUrl = `http://localhost:${port}`;
      console.log(`📡 Test server running on ${baseUrl}`);
      resolve();
    });
  });

  // Track created IDs for strict cleanup
  const cleanupUserIds: string[] = [];
  const cleanupEpisodeIds: string[] = [];
  const cleanupGuestIds: string[] = [];
  const cleanupContactIds: string[] = [];
  const cleanupAuditIds: string[] = [];

  const testPassword = "TestAdminSecure#Password2026!";
  const testPasswordHash = await bcrypt.hash(testPassword, 10);

  try {
    // -------------------------------------------------------------------------
    // Setup test users in SQL Server
    // -------------------------------------------------------------------------
    console.log("\n📦 Setting up test users in SQL Server...");

    // 1. Valid Active Admin
    const activeAdmin = await prisma.user.create({
      data: {
        displayName: "Stage 3 Test Admin",
        email: `stage3.admin.${Date.now()}@example.com`,
        passwordHash: testPasswordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
      },
    });
    cleanupUserIds.push(activeAdmin.id);

    // 2. Inactive / Suspended Admin
    const suspendedAdmin = await prisma.user.create({
      data: {
        displayName: "Stage 3 Suspended Admin",
        email: `stage3.suspended.${Date.now()}@example.com`,
        passwordHash: testPasswordHash,
        role: "ADMIN",
        status: "SUSPENDED",
        emailVerified: true,
      },
    });
    cleanupUserIds.push(suspendedAdmin.id);

    // 3. Regular Active User (Non-Admin)
    const regularUser = await prisma.user.create({
      data: {
        displayName: "Stage 3 Regular User",
        email: `stage3.regular.${Date.now()}@example.com`,
        passwordHash: testPasswordHash,
        role: "USER",
        status: "ACTIVE",
        emailVerified: true,
      },
    });
    cleanupUserIds.push(regularUser.id);

    console.log(`✅ Test users created. Admin: ${activeAdmin.email}`);

    // =========================================================================
    // 1. Unauthenticated Rejection Tests
    // =========================================================================
    console.log("\n1️⃣ Testing unauthenticated access to protected endpoints...");

    const unauthMe = await fetch(`${baseUrl}/api/auth/me`);
    console.log("GET /api/auth/me without session (Expected 401):", unauthMe.status);
    if (unauthMe.status !== 401) throw new Error("Expected 401 for unauthenticated /api/auth/me");

    const unauthStats = await fetch(`${baseUrl}/api/admin/dashboard/stats`);
    console.log("GET /api/admin/dashboard/stats without session (Expected 401):", unauthStats.status);
    if (unauthStats.status !== 401) throw new Error("Expected 401 for unauthenticated /api/admin/dashboard/stats");

    const unauthEpisodes = await fetch(`${baseUrl}/api/admin/episodes`);
    console.log("GET /api/admin/episodes without session (Expected 401):", unauthEpisodes.status);
    if (unauthEpisodes.status !== 401) throw new Error("Expected 401 for unauthenticated /api/admin/episodes");

    // =========================================================================
    // 2. Login Failure & Generic Error Tests
    // =========================================================================
    console.log("\n2️⃣ Testing login failures and generic error messages...");

    // A. Invalid Email Format
    const invalidEmailRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid-email", password: "password123" }),
    });
    console.log("POST /api/auth/login with invalid email format (Expected 400):", invalidEmailRes.status);
    if (invalidEmailRes.status !== 400) throw new Error("Expected 400 for invalid email format");

    // B. Non-existent User
    const nonExistentRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "doesnotexist@example.com", password: "wrongpassword" }),
    });
    const nonExistentData = await nonExistentRes.json();
    console.log("POST /api/auth/login non-existent user (Expected 401):", nonExistentRes.status, nonExistentData.message);
    if (nonExistentRes.status !== 401 || nonExistentData.message !== "Invalid email or password.") {
      throw new Error("Expected generic 401 error message for non-existent user");
    }

    // C. Wrong Password for Existing Admin
    const wrongPassRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: activeAdmin.email, password: "IncorrectPassword123!" }),
    });
    const wrongPassData = await wrongPassRes.json();
    console.log("POST /api/auth/login wrong password (Expected 401):", wrongPassRes.status, wrongPassData.message);
    if (wrongPassRes.status !== 401 || wrongPassData.message !== "Invalid email or password.") {
      throw new Error("Expected generic 401 error message for incorrect password");
    }

    // D. Inactive / Suspended Admin
    const suspendedRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: suspendedAdmin.email, password: testPassword }),
    });
    const suspendedData = await suspendedRes.json();
    console.log("POST /api/auth/login suspended admin (Expected 401):", suspendedRes.status, suspendedData.message);
    if (suspendedRes.status !== 401 || suspendedData.message !== "Invalid email or password.") {
      throw new Error("Expected generic 401 for inactive administrator account");
    }

    // E. Regular (Non-Admin) User
    const regularRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regularUser.email, password: testPassword }),
    });
    const regularData = await regularRes.json();
    console.log("POST /api/auth/login non-admin user (Expected 401):", regularRes.status, regularData.message);
    if (regularRes.status !== 401 || regularData.message !== "Invalid email or password.") {
      throw new Error("Expected generic 401 for non-admin user login attempt");
    }

    // =========================================================================
    // 3. Successful Admin Login, Session & CSRF Token Issuance
    // =========================================================================
    console.log("\n3️⃣ Testing successful administrator login...");

    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: activeAdmin.email, password: testPassword }),
    });

    console.log("POST /api/auth/login status:", loginRes.status);
    if (loginRes.status !== 200) throw new Error("Expected 200 for successful admin login");

    const rawCookies = loginRes.headers.get("set-cookie") || "";
    console.log("Session Cookie Header present:", rawCookies.includes("gdp.sid"));
    if (!rawCookies.includes("gdp.sid")) throw new Error("gdp.sid session cookie not set in response");

    // Extract cookie value for subsequent requests
    const cookieMatch = rawCookies.match(/gdp\.sid=([^;]+)/);
    const sessionCookie = cookieMatch ? `gdp.sid=${cookieMatch[1]}` : "";
    if (!sessionCookie) throw new Error("Could not parse gdp.sid cookie value");

    const loginData = await loginRes.json();
    console.log("Login Response payload:", {
      success: loginData.success,
      email: loginData.user?.email,
      role: loginData.user?.role,
      csrfToken: !!loginData.csrfToken,
      hasPasswordHash: "passwordHash" in loginData.user,
    });

    if (
      !loginData.success ||
      loginData.user.role !== "ADMIN" ||
      !loginData.csrfToken ||
      "passwordHash" in loginData.user
    ) {
      throw new Error("Login response validation failed (role must be ADMIN, csrfToken present, passwordHash absent)");
    }

    const csrfToken = loginData.csrfToken;

    // Verify session row in SQL Server dbo.Session
    const sidValue = decodeURIComponent(cookieMatch![1]).split(".")[0]?.replace(/^s:/, "");
    const sessionRow = await prisma.session.findFirst({
      where: {
        userId: activeAdmin.id,
      },
    });
    console.log("Verified SQL Server dbo.Session persistence:", {
      id: sessionRow?.id,
      sid: sessionRow?.sid,
      userId: sessionRow?.userId,
      expiresAt: sessionRow?.expiresAt,
    });
    if (!sessionRow) throw new Error("Session was not persisted to dbo.Session in SQL Server");

    // =========================================================================
    // 4. GET /api/auth/me with Authenticated Session
    // =========================================================================
    console.log("\n4️⃣ Testing GET /api/auth/me with session cookie...");

    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    const meData = await meRes.json();
    console.log("GET /api/auth/me status:", meRes.status, "User:", meData.user?.email);
    if (meRes.status !== 200 || meData.user?.id !== activeAdmin.id || !meData.csrfToken) {
      throw new Error("GET /api/auth/me failed to return authenticated user");
    }

    // =========================================================================
    // 5. CSRF Protection Enforcement on Mutating Admin Requests
    // =========================================================================
    console.log("\n5️⃣ Testing CSRF protection on mutating admin requests...");

    const episodePayload = {
      title: "Stage 3 Test Episode",
      description: "Testing CRUD operations in Stage 3B",
      youtubeVideoId: "test_yt_12345",
      guestName: "Guest Expert",
      guestRole: "CTO",
      category: "Technology",
      status: "PUBLISHED",
      displayOrder: 1,
    };

    // A. Request without CSRF token
    const noCsrfRes = await fetch(`${baseUrl}/api/admin/episodes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify(episodePayload),
    });
    console.log("POST /api/admin/episodes without CSRF token (Expected 403):", noCsrfRes.status);
    if (noCsrfRes.status !== 403) throw new Error("Expected 403 for missing CSRF token");

    // B. Request with invalid CSRF token
    const badCsrfRes = await fetch(`${baseUrl}/api/admin/episodes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": "invalid_csrf_token_value",
      },
      body: JSON.stringify(episodePayload),
    });
    console.log("POST /api/admin/episodes with bad CSRF token (Expected 403):", badCsrfRes.status);
    if (badCsrfRes.status !== 403) throw new Error("Expected 403 for invalid CSRF token");

    // =========================================================================
    // 6. Stage 3B — Episode Management CRUD
    // =========================================================================
    console.log("\n6️⃣ Testing Episode Management (Create, Read, Update, Soft-Archive)...");

    // Create episode with valid CSRF
    const createEpRes = await fetch(`${baseUrl}/api/admin/episodes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify(episodePayload),
    });
    const createEpData = await createEpRes.json();
    console.log("POST /api/admin/episodes create status:", createEpRes.status, "ID:", createEpData.episode?.id);
    if (createEpRes.status !== 201 || !createEpData.episode?.id) {
      throw new Error("Failed to create episode via admin API");
    }
    const createdEpId = createEpData.episode.id;
    cleanupEpisodeIds.push(createdEpId);

    // Verify publishedAt automatically set
    if (!createEpData.episode.publishedAt) {
      throw new Error("Expected publishedAt to be automatically set for PUBLISHED episode");
    }

    // GET /api/admin/episodes (List)
    const listEpRes = await fetch(`${baseUrl}/api/admin/episodes?limit=10&page=1`, {
      headers: { Cookie: sessionCookie },
    });
    const listEpData = await listEpRes.json();
    console.log("GET /api/admin/episodes list status:", listEpRes.status, "Total count:", listEpData.pagination?.total);
    if (listEpRes.status !== 200 || !Array.isArray(listEpData.episodes)) {
      throw new Error("Failed to list episodes");
    }

    // GET /api/admin/episodes/:id (Single)
    const getEpRes = await fetch(`${baseUrl}/api/admin/episodes/${createdEpId}`, {
      headers: { Cookie: sessionCookie },
    });
    const getEpData = await getEpRes.json();
    console.log("GET /api/admin/episodes/:id status:", getEpRes.status, "Title:", getEpData.episode?.title);
    if (getEpRes.status !== 200 || getEpData.episode?.title !== episodePayload.title) {
      throw new Error("Failed to get episode by ID");
    }

    // PUT /api/admin/episodes/:id (Update)
    const updateEpRes = await fetch(`${baseUrl}/api/admin/episodes/${createdEpId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({
        title: "Updated Stage 3 Episode Title",
        isFeatured: true,
      }),
    });
    const updateEpData = await updateEpRes.json();
    console.log("PUT /api/admin/episodes/:id update status:", updateEpRes.status, "New Title:", updateEpData.episode?.title);
    if (updateEpRes.status !== 200 || updateEpData.episode?.title !== "Updated Stage 3 Episode Title") {
      throw new Error("Failed to update episode");
    }

    // DELETE /api/admin/episodes/:id (Soft-Archive)
    const deleteEpRes = await fetch(`${baseUrl}/api/admin/episodes/${createdEpId}`, {
      method: "DELETE",
      headers: {
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
    });
    const deleteEpData = await deleteEpRes.json();
    console.log("DELETE /api/admin/episodes/:id status:", deleteEpRes.status, deleteEpData.message);
    if (deleteEpRes.status !== 200 || deleteEpData.episode?.status !== "ARCHIVED") {
      throw new Error("Expected episode status to be soft-archived to ARCHIVED");
    }

    // Verify record still exists in SQL Server
    const archivedEpInDb = await prisma.video.findUnique({ where: { id: createdEpId } });
    if (!archivedEpInDb || archivedEpInDb.status !== "ARCHIVED") {
      throw new Error("Archived episode should still exist in database with status ARCHIVED");
    }

    // =========================================================================
    // 7. Stage 3B — Guest Applications Management
    // =========================================================================
    console.log("\n7️⃣ Testing Guest Applications Management...");

    // Create a guest application record in database
    const testGuest = await prisma.guestApplication.create({
      data: {
        fullName: "Stage 3 Guest Candidate",
        companyRole: "Managing Director",
        email: "stage3.guest@example.com",
        expertiseArea: "Fintech",
        topicSummary: "Scaling digital payments across India",
        status: "NEW",
      },
    });
    cleanupGuestIds.push(testGuest.id);

    // GET /api/admin/guests
    const getGuestsRes = await fetch(`${baseUrl}/api/admin/guests?status=NEW`, {
      headers: { Cookie: sessionCookie },
    });
    const getGuestsData = await getGuestsRes.json();
    console.log("GET /api/admin/guests status:", getGuestsRes.status, "Count:", getGuestsData.guests?.length);
    if (getGuestsRes.status !== 200) throw new Error("Failed to list guest applications");

    // GET /api/admin/guests/:id
    const getSingleGuestRes = await fetch(`${baseUrl}/api/admin/guests/${testGuest.id}`, {
      headers: { Cookie: sessionCookie },
    });
    const singleGuestData = await getSingleGuestRes.json();
    console.log("GET /api/admin/guests/:id status:", getSingleGuestRes.status, "Name:", singleGuestData.guest?.fullName);
    if (getSingleGuestRes.status !== 200 || singleGuestData.guest?.id !== testGuest.id) {
      throw new Error("Failed to get guest application by ID");
    }

    // PATCH /api/admin/guests/:id/status
    const updateGuestStatusRes = await fetch(`${baseUrl}/api/admin/guests/${testGuest.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ status: "APPROVED" }),
    });
    const guestStatusData = await updateGuestStatusRes.json();
    console.log("PATCH /api/admin/guests/:id/status status:", updateGuestStatusRes.status, "New Status:", guestStatusData.guest?.status);
    if (updateGuestStatusRes.status !== 200 || guestStatusData.guest?.status !== "APPROVED") {
      throw new Error("Failed to update guest status");
    }

    // PATCH /api/admin/guests/:id/notes
    const updateGuestNotesRes = await fetch(`${baseUrl}/api/admin/guests/${testGuest.id}/notes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ adminNotes: "Interview scheduled for next Tuesday at 3 PM." }),
    });
    const guestNotesData = await updateGuestNotesRes.json();
    console.log("PATCH /api/admin/guests/:id/notes status:", updateGuestNotesRes.status, "Notes saved:", !!guestNotesData.guest?.adminNotes);
    if (updateGuestNotesRes.status !== 200 || !guestNotesData.guest?.adminNotes?.includes("Interview scheduled")) {
      throw new Error("Failed to update guest admin notes");
    }

    // =========================================================================
    // 8. Stage 3B — Contact Messages Management
    // =========================================================================
    console.log("\n8️⃣ Testing Contact Messages Management...");

    const testContact = await prisma.contactInquiry.create({
      data: {
        name: "Stage 3 Contact Tester",
        email: "stage3.contact@example.com",
        subject: "Partnership Enquiry",
        message: "We would like to explore podcast sponsorship.",
        status: "NEW",
      },
    });
    cleanupContactIds.push(testContact.id);

    // GET /api/admin/messages
    const getMessagesRes = await fetch(`${baseUrl}/api/admin/messages?status=NEW`, {
      headers: { Cookie: sessionCookie },
    });
    const getMessagesData = await getMessagesRes.json();
    console.log("GET /api/admin/messages status:", getMessagesRes.status, "Count:", getMessagesData.messages?.length);
    if (getMessagesRes.status !== 200) throw new Error("Failed to list contact messages");

    // GET /api/admin/messages/:id
    const getSingleMsgRes = await fetch(`${baseUrl}/api/admin/messages/${testContact.id}`, {
      headers: { Cookie: sessionCookie },
    });
    const singleMsgData = await getSingleMsgRes.json();
    console.log("GET /api/admin/messages/:id status:", getSingleMsgRes.status, "Subject:", singleMsgData.message?.subject);
    if (getSingleMsgRes.status !== 200 || singleMsgData.message?.id !== testContact.id) {
      throw new Error("Failed to get contact message by ID");
    }

    // PATCH /api/admin/messages/:id/status
    const updateMsgStatusRes = await fetch(`${baseUrl}/api/admin/messages/${testContact.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ status: "READ" }),
    });
    const msgStatusData = await updateMsgStatusRes.json();
    const updatedStatus = msgStatusData.contact?.status || msgStatusData.data?.status;
    console.log("PATCH /api/admin/messages/:id/status status:", updateMsgStatusRes.status, "New Status:", updatedStatus);
    if (updateMsgStatusRes.status !== 200 || updatedStatus !== "READ") {
      throw new Error("Failed to update contact message status");
    }

    // =========================================================================
    // 9. Stage 3B — Dashboard Statistics
    // =========================================================================
    console.log("\n9️⃣ Testing Dashboard Statistics (Real Database Counts)...");

    const statsRes = await fetch(`${baseUrl}/api/admin/dashboard/stats`, {
      headers: { Cookie: sessionCookie },
    });
    const statsData = await statsRes.json();
    console.log("GET /api/admin/dashboard/stats status:", statsRes.status, "Stats:", statsData.stats);
    if (
      statsRes.status !== 200 ||
      typeof statsData.stats?.episodes?.total !== "number" ||
      typeof statsData.stats?.guests?.new !== "number" ||
      typeof statsData.stats?.messages?.new !== "number"
    ) {
      throw new Error("Dashboard stats failed or returned invalid format");
    }

    // =========================================================================
    // 10. Audit Logging Verification
    // =========================================================================
    console.log("\n🔟 Verifying Audit Logs in SQL Server dbo.AuditLog...");

    const auditRows = await prisma.auditLog.findMany({
      where: {
        userId: activeAdmin.id,
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(`Found ${auditRows.length} audit log entries for activeAdmin:`);
    for (const log of auditRows) {
      console.log(`  - [${log.action}] on ${log.entity} (${log.entityId}): ${log.details}`);
      cleanupAuditIds.push(log.id);
    }

    const recordedActions = auditRows.map((r) => r.action);
    if (!recordedActions.includes("ADMIN_LOGIN")) throw new Error("Expected ADMIN_LOGIN audit log");
    if (!recordedActions.includes("EPISODE_CREATED")) throw new Error("Expected EPISODE_CREATED audit log");
    if (!recordedActions.includes("EPISODE_ARCHIVED")) throw new Error("Expected EPISODE_ARCHIVED audit log");
    if (!recordedActions.includes("GUEST_STATUS_UPDATED")) throw new Error("Expected GUEST_STATUS_UPDATED audit log");
    if (!recordedActions.includes("CONTACT_STATUS_UPDATED")) throw new Error("Expected CONTACT_STATUS_UPDATED audit log");

    // =========================================================================
    // 11. Logout & Session Invalidation
    // =========================================================================
    console.log("\n1️⃣1️⃣ Testing Logout & Server-Side Session Invalidation...");

    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: sessionCookie },
    });
    const logoutData = await logoutRes.json();
    console.log("POST /api/auth/logout status:", logoutRes.status, logoutData.message);
    if (logoutRes.status !== 200) throw new Error("Failed to logout");

    // Verify session destroyed in database
    const sessionAfterLogout = await prisma.session.findFirst({
      where: { userId: activeAdmin.id },
    });
    console.log("Session in DB after logout (Expected null):", sessionAfterLogout);
    if (sessionAfterLogout) throw new Error("Session was not destroyed in SQL Server on logout");

    // Verify accessing /api/auth/me now returns 401
    const postLogoutMe = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    console.log("GET /api/auth/me after logout (Expected 401):", postLogoutMe.status);
    if (postLogoutMe.status !== 401) throw new Error("Expected 401 after logout");

    console.log("\n🎉 ALL STAGE 3A & 3B TESTS PASSED SUCCESSFULLY!");
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error);
    throw error;
  } finally {
    // -------------------------------------------------------------------------
    // Safe Cleanup of Test Records
    // -------------------------------------------------------------------------
    console.log("\n🧹 Cleaning up test artifacts from SQL Server...");
    try {
      if (cleanupAuditIds.length > 0) {
        await prisma.auditLog.deleteMany({ where: { id: { in: cleanupAuditIds } } });
      }
      if (cleanupEpisodeIds.length > 0) {
        await prisma.video.deleteMany({ where: { id: { in: cleanupEpisodeIds } } });
      }
      if (cleanupGuestIds.length > 0) {
        await prisma.guestApplication.deleteMany({ where: { id: { in: cleanupGuestIds } } });
      }
      if (cleanupContactIds.length > 0) {
        await prisma.contactInquiry.deleteMany({ where: { id: { in: cleanupContactIds } } });
      }
      if (cleanupUserIds.length > 0) {
        await prisma.session.deleteMany({ where: { userId: { in: cleanupUserIds } } });
        await prisma.user.deleteMany({ where: { id: { in: cleanupUserIds } } });
      }
      console.log("✅ Cleanup complete.");
    } catch (cleanupErr) {
      console.error("Cleanup warning:", cleanupErr);
    }

    server.close();
    await disconnectDatabase();
  }
}

runTests()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
