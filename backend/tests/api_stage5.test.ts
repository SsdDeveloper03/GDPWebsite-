import app from "../src/index.js";
import { prisma, disconnectDatabase } from "../src/config/database.js";
import bcrypt from "bcryptjs";
import type { Server } from "http";

async function runStage5Tests() {
  console.log("================================================================================");
  console.log("🛡️  STAGE 5: FULL INTEGRATION & SECURITY VERIFICATION SUITE");
  console.log("================================================================================");

  let server: Server;
  let port: number;
  let baseUrl: string;

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address();
      port = typeof addr === "object" && addr ? addr.port : 5003;
      baseUrl = `http://localhost:${port}`;
      console.log(`📡 Stage 5 Test Server running on ${baseUrl}`);
      resolve();
    });
  });

  const cleanupUserIds: string[] = [];
  const cleanupEpisodeIds: string[] = [];
  const cleanupGuestIds: string[] = [];
  const cleanupContactIds: string[] = [];
  const cleanupReviewIds: string[] = [];
  const cleanupAuditIds: string[] = [];

  const adminPassword = "Stage5TestAdmin#Password2026!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  let sessionCookie = "";
  let csrfToken = "";

  try {
    // -------------------------------------------------------------------------
    // Setup test admin user
    // -------------------------------------------------------------------------
    console.log("\n📦 Setting up test admin user in SQL Server...");
    const testAdmin = await prisma.user.create({
      data: {
        displayName: "Stage 5 Test Administrator",
        email: `stage5.admin.${Date.now()}@example.com`,
        passwordHash: adminPasswordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
      },
    });
    cleanupUserIds.push(testAdmin.id);
    console.log(`✅ Test Admin Created: ${testAdmin.email} (ID: ${testAdmin.id})`);

    // =========================================================================
    // PART 1: PUBLIC WORKFLOW INTEGRATION
    // =========================================================================
    console.log("\n================================================================================");
    console.log("PART 1: PUBLIC WEBSITE INTEGRATION AUDIT");
    console.log("================================================================================");

    // 1A. Episodes Public API
    console.log("\n--- 1A. Testing Public Episodes API ---");
    const pubEpisodesRes = await fetch(`${baseUrl}/api/episodes`);
    const pubEpisodesJson = await pubEpisodesRes.json();
    console.log(`GET /api/episodes status: ${pubEpisodesRes.status}, count: ${pubEpisodesJson.count}`);
    if (pubEpisodesRes.status !== 200 || !pubEpisodesJson.success) {
      throw new Error("Failed to fetch public episodes");
    }

    // Verify all returned episodes are strictly PUBLISHED
    for (const ep of pubEpisodesJson.data) {
      const inDb = await prisma.video.findUnique({ where: { id: ep.id } });
      if (!inDb || inDb.status !== "PUBLISHED") {
        throw new Error(`CRITICAL: Non-published episode exposed publicly: ID ${ep.id}, status: ${inDb?.status}`);
      }
    }
    console.log("✅ Verified: GET /api/episodes returns strictly PUBLISHED episodes.");

    // 1B. Become a Guest Form Submission & Security Checks
    console.log("\n--- 1B. Testing Become a Guest Form Submission ---");
    const guestApplyPayload = {
      fullName: "Stage 5 Test Founder",
      companyRole: "CEO & Co-Founder, Surat Tech",
      email: "stage5.founder@example.com",
      phone: "+91 98765 43210",
      expertiseArea: "Manufacturing Automation",
      topicSummary: "How textile exporters in Gujarat are adopting Industry 4.0 automation systems.",
      linkedinOrWebsite: "https://linkedin.com/in/surat-tech-founder",
      // Attacker trying to elevate status and inject notes
      status: "APPROVED",
      adminNotes: "Malicious injection attempt",
    };

    const guestApplyRes = await fetch(`${baseUrl}/api/guests/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guestApplyPayload),
    });
    const guestApplyJson = await guestApplyRes.json();
    console.log(`POST /api/guests/apply status: ${guestApplyRes.status}, ID: ${guestApplyJson.applicationId}`);
    if (guestApplyRes.status !== 201 || !guestApplyJson.applicationId) {
      throw new Error(`Guest application submission failed: ${JSON.stringify(guestApplyJson)}`);
    }
    cleanupGuestIds.push(guestApplyJson.applicationId);

    // Verify DB record integrity: status must be NEW, adminNotes must NOT be injected
    const guestInDb = await prisma.guestApplication.findUnique({
      where: { id: guestApplyJson.applicationId },
    });
    if (!guestInDb) throw new Error("Guest application row not found in SQL Server");
    if (guestInDb.status !== "NEW") {
      throw new Error(`Security Violation: Public submission was able to set status to ${guestInDb.status}`);
    }
    if (guestInDb.adminNotes !== null) {
      throw new Error(`Security Violation: Public submission was able to set adminNotes to ${guestInDb.adminNotes}`);
    }
    console.log("✅ Verified: Public guest application stored with status 'NEW' and adminNotes protected.");

    // Honeypot trap test
    const hpPayload = {
      ...guestApplyPayload,
      email: "bot@spammer.com",
      _hp: "I am a spam bot filling hidden fields",
    };
    const hpRes = await fetch(`${baseUrl}/api/guests/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hpPayload),
    });
    const hpJson = await hpRes.json();
    console.log(`POST /api/guests/apply with honeypot trap status: ${hpRes.status}`);
    if (hpRes.status !== 200 || !hpJson.success) {
      throw new Error("Honeypot trap did not return 200 silent success");
    }
    const hpInDb = await prisma.guestApplication.findFirst({
      where: { email: "bot@spammer.com" },
    });
    if (hpInDb) {
      cleanupGuestIds.push(hpInDb.id);
      throw new Error("Security Violation: Honeypot submission was saved to database!");
    }
    console.log("✅ Verified: Honeypot trap silently drops bot submissions without DB persistence.");

    // Validation test
    const invalidGuestRes = await fetch(`${baseUrl}/api/guests/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Incomplete Form" }),
    });
    console.log(`POST /api/guests/apply with invalid data status (Expected 400): ${invalidGuestRes.status}`);
    if (invalidGuestRes.status !== 400) throw new Error("Expected 400 for invalid guest application");
    console.log("✅ Verified: Zod validation rejects malformed guest submissions.");

    // 1C. Contact Form Submission
    console.log("\n--- 1C. Testing Contact Form Submission ---");
    const contactPayload = {
      name: "Stage 5 Test Client",
      email: "stage5.client@example.com",
      phone: "+91 99887 76655",
      subject: "Podcast Production & Studio Booking",
      message: "We would like to book a 3-episode personal branding series at GDP Studio.",
    };

    const contactRes = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactPayload),
    });
    const contactJson = await contactRes.json();
    console.log(`POST /api/contact status: ${contactRes.status}, ID: ${contactJson.inquiryId}`);
    if (contactRes.status !== 201 || !contactJson.inquiryId) {
      throw new Error(`Contact inquiry submission failed: ${JSON.stringify(contactJson)}`);
    }
    cleanupContactIds.push(contactJson.inquiryId);

    const contactInDb = await prisma.contactInquiry.findUnique({
      where: { id: contactJson.inquiryId },
    });
    if (!contactInDb || contactInDb.status !== "NEW") {
      throw new Error("Contact inquiry not stored with status 'NEW'");
    }
    console.log("✅ Verified: Contact inquiry stored in dbo.ContactInquiry with status 'NEW'.");

    const invalidContactRes = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Only Name" }),
    });
    console.log(`POST /api/contact invalid data status (Expected 400): ${invalidContactRes.status}`);
    if (invalidContactRes.status !== 400) throw new Error("Expected 400 for invalid contact inquiry");
    console.log("✅ Verified: Zod validation rejects malformed contact messages.");

    // 1D. Reviews Public Workflow
    console.log("\n--- 1D. Testing Reviews Public API ---");
    const pubReviewsRes = await fetch(`${baseUrl}/api/reviews`);
    const pubReviewsJson = await pubReviewsRes.json();
    console.log(`GET /api/reviews status: ${pubReviewsRes.status}, count: ${pubReviewsJson.count}`);
    if (pubReviewsRes.status !== 200 || !pubReviewsJson.success) {
      throw new Error("Failed to fetch public reviews");
    }

    // Verify only APPROVED reviews are ever returned
    for (const rev of pubReviewsJson.data) {
      const revInDb = await prisma.review.findUnique({ where: { id: rev.id } });
      if (!revInDb || revInDb.status !== "APPROVED") {
        throw new Error(`Security Violation: Unapproved review exposed publicly: ID ${rev.id}, status: ${revInDb?.status}`);
      }
    }

    // Insert a dummy PENDING review to verify it is NOT returned in public API
    const testReviewUser = await prisma.user.create({
      data: {
        displayName: "Pending Reviewer",
        email: `pending.reviewer.${Date.now()}@example.com`,
        role: "USER",
        status: "ACTIVE",
      },
    });
    cleanupUserIds.push(testReviewUser.id);

    const pendingReview = await prisma.review.create({
      data: {
        userId: testReviewUser.id,
        rating: 5,
        title: "Pending Test Review",
        content: "This review should NEVER appear publicly until approved.",
        status: "PENDING",
      },
    });
    cleanupReviewIds.push(pendingReview.id);

    const pubReviewsAfterRes = await fetch(`${baseUrl}/api/reviews`);
    const pubReviewsAfterJson = await pubReviewsAfterRes.json();
    const leaked = pubReviewsAfterJson.data.some((r: any) => r.id === pendingReview.id);
    if (leaked) {
      throw new Error("CRITICAL: PENDING review leaked into public GET /api/reviews!");
    }
    console.log("✅ Verified: Pending/unapproved reviews are NEVER exposed in public API.");

    // =========================================================================
    // PART 2: ADMIN-TO-PUBLIC INTEGRATION
    // =========================================================================
    console.log("\n================================================================================");
    console.log("PART 2: ADMIN-TO-PUBLIC INTEGRATION & LIFECYCLE AUDIT");
    console.log("================================================================================");

    // Step 1: Admin Login & Session Regeneration
    console.log("\n--- Step 1: Admin Authentication ---");
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testAdmin.email, password: adminPassword }),
    });
    const loginJson = await loginRes.json();
    const setCookieHeader = loginRes.headers.get("set-cookie");
    if (!setCookieHeader) throw new Error("No set-cookie header received upon login");
    sessionCookie = setCookieHeader.split(";")[0];
    csrfToken = loginJson.csrfToken;
    console.log(`Admin Login Status: ${loginRes.status}, Session Cookie: Established, CSRF Token: Present`);

    // Verify session stored in dbo.Session
    const sessionInDb = await prisma.session.findFirst({
      where: { userId: testAdmin.id },
    });
    if (!sessionInDb) throw new Error("Active session was not saved to dbo.Session");
    console.log(`✅ Verified: Session saved in dbo.Session (sid: ${sessionInDb.sid})`);

    // Step 2: Create Episode as DRAFT -> Confirm Hidden Publicly
    console.log("\n--- Step 2: Create DRAFT Episode & Verify Hidden Publicly ---");
    const createEpisodeRes = await fetch(`${baseUrl}/api/admin/episodes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({
        title: "Stage 5 Integration Test Podcast",
        description: "Testing end-to-end lifecycle from draft to publication and archival.",
        youtubeVideoId: "dQw4w9WgXcQ",
        thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        guestName: "Bhavesh J. Chudasama",
        guestRole: "Founder & Host",
        category: "Personal Branding",
        status: "DRAFT",
        isFeatured: false,
        displayOrder: 99,
      }),
    });
    const createEpisodeJson = await createEpisodeRes.json();
    console.log(`POST /api/admin/episodes (DRAFT) status: ${createEpisodeRes.status}, ID: ${createEpisodeJson.episode?.id}`);
    if (createEpisodeRes.status !== 201 || !createEpisodeJson.episode?.id) {
      throw new Error(`Failed to create draft episode: ${JSON.stringify(createEpisodeJson)}`);
    }
    const testEpisodeId = createEpisodeJson.episode.id;
    cleanupEpisodeIds.push(testEpisodeId);

    // Verify hidden from public list
    const checkPubList1 = await fetch(`${baseUrl}/api/episodes`);
    const checkPubList1Json = await checkPubList1.json();
    const foundInList1 = checkPubList1Json.data.some((e: any) => e.id === testEpisodeId);
    if (foundInList1) throw new Error("CRITICAL: DRAFT episode is visible in GET /api/episodes!");

    // Verify public detail endpoint returns 404
    const checkPubDetail1 = await fetch(`${baseUrl}/api/episodes/${testEpisodeId}`);
    console.log(`GET /api/episodes/${testEpisodeId} for DRAFT (Expected 404): ${checkPubDetail1.status}`);
    if (checkPubDetail1.status !== 404) throw new Error("Expected 404 for draft episode detail endpoint");
    console.log("✅ Verified: Draft episode is completely hidden from public listings and detail route.");

    // Step 3: Publish Episode -> Confirm Visible Publicly
    console.log("\n--- Step 3: Publish Episode & Verify Visible Publicly ---");
    const publishRes = await fetch(`${baseUrl}/api/admin/episodes/${testEpisodeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({
        title: "Stage 5 Integration Test Podcast",
        youtubeVideoId: "dQw4w9WgXcQ",
        category: "Personal Branding",
        status: "PUBLISHED",
      }),
    });
    console.log(`PUT /api/admin/episodes/${testEpisodeId} (PUBLISHED) status: ${publishRes.status}`);
    if (publishRes.status !== 200) throw new Error("Failed to publish episode");

    // Verify visible in public list
    const checkPubList2 = await fetch(`${baseUrl}/api/episodes`);
    const checkPubList2Json = await checkPubList2.json();
    const foundInList2 = checkPubList2Json.data.some((e: any) => e.id === testEpisodeId);
    if (!foundInList2) throw new Error("PUBLISHED episode is NOT appearing in GET /api/episodes!");

    // Verify public detail returns 200 with details
    const checkPubDetail2 = await fetch(`${baseUrl}/api/episodes/${testEpisodeId}`);
    const checkPubDetail2Json = await checkPubDetail2.json();
    console.log(`GET /api/episodes/${testEpisodeId} for PUBLISHED status: ${checkPubDetail2.status}`);
    if (checkPubDetail2.status !== 200 || checkPubDetail2Json.data.title !== "Stage 5 Integration Test Podcast") {
      throw new Error("Published episode detail verification failed");
    }
    console.log("✅ Verified: Published episode is now live and accessible publicly.");

    // Step 4: Edit Episode -> Verify Updates Appear
    console.log("\n--- Step 4: Edit Episode & Verify Updates Reflected Publicly ---");
    const updatedTitle = "Stage 5 Updated Podcast Title — Studio Edition";
    const updateRes = await fetch(`${baseUrl}/api/admin/episodes/${testEpisodeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({
        title: updatedTitle,
        category: "Business Growth",
        status: "PUBLISHED",
      }),
    });
    console.log(`PUT /api/admin/episodes/${testEpisodeId} update status: ${updateRes.status}`);
    if (updateRes.status !== 200) throw new Error("Failed to update episode details");

    const checkPubDetail3 = await fetch(`${baseUrl}/api/episodes/${testEpisodeId}`);
    const checkPubDetail3Json = await checkPubDetail3.json();
    if (checkPubDetail3Json.data.title !== updatedTitle || checkPubDetail3Json.data.category !== "Business Growth") {
      throw new Error("Updated episode details did not reflect in public API");
    }
    console.log("✅ Verified: Updated episode metadata reflects immediately on public endpoints.");

    // Step 5: Archive Episode -> Confirm No Longer Publicly Accessible
    console.log("\n--- Step 5: Archive Episode & Verify Removal from Public API ---");
    const archiveRes = await fetch(`${baseUrl}/api/admin/episodes/${testEpisodeId}`, {
      method: "DELETE",
      headers: {
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
    });
    console.log(`DELETE /api/admin/episodes/${testEpisodeId} (Archive) status: ${archiveRes.status}`);
    if (archiveRes.status !== 200) throw new Error("Failed to archive episode");

    const checkPubList3 = await fetch(`${baseUrl}/api/episodes`);
    const checkPubList3Json = await checkPubList3.json();
    const foundInList3 = checkPubList3Json.data.some((e: any) => e.id === testEpisodeId);
    if (foundInList3) throw new Error("CRITICAL: ARCHIVED episode is still visible in GET /api/episodes!");

    const checkPubDetail4 = await fetch(`${baseUrl}/api/episodes/${testEpisodeId}`);
    console.log(`GET /api/episodes/${testEpisodeId} for ARCHIVED (Expected 404): ${checkPubDetail4.status}`);
    if (checkPubDetail4.status !== 404) throw new Error("Expected 404 for archived episode detail endpoint");
    console.log("✅ Verified: Archived episode is immediately removed from public access.");

    // Step 6: Guest Application Review & Private Notes
    console.log("\n--- Step 6: Admin Guest Application Review & Notes ---");
    const adminGuestsRes = await fetch(`${baseUrl}/api/admin/guests`, {
      headers: { Cookie: sessionCookie },
    });
    const adminGuestsJson = await adminGuestsRes.json();
    const guestItem = adminGuestsJson.data.find((g: any) => g.id === guestApplyJson.applicationId);
    if (!guestItem) throw new Error("Test guest application was not listed in admin guest portal");

    // Admin updates status to CONTACTED
    const patchGuestStatusRes = await fetch(`${baseUrl}/api/admin/guests/${guestItem.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ status: "CONTACTED" }),
    });
    console.log(`PATCH /api/admin/guests/:id/status status: ${patchGuestStatusRes.status}`);
    if (patchGuestStatusRes.status !== 200) throw new Error("Failed to update guest status");

    // Admin adds internal notes
    const privateNote = "CONFIDENTIAL: Guest requested recording slot in late November. Preliminary discussion completed.";
    const patchGuestNotesRes = await fetch(`${baseUrl}/api/admin/guests/${guestItem.id}/notes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ adminNotes: privateNote }),
    });
    console.log(`PATCH /api/admin/guests/:id/notes status: ${patchGuestNotesRes.status}`);
    if (patchGuestNotesRes.status !== 200) throw new Error("Failed to save private admin notes");

    // Verify persistence in DB
    const updatedGuestInDb = await prisma.guestApplication.findUnique({
      where: { id: guestItem.id },
    });
    if (updatedGuestInDb?.status !== "CONTACTED" || updatedGuestInDb?.adminNotes !== privateNote) {
      throw new Error("Guest status and notes were not persisted in database");
    }
    console.log("✅ Verified: Admin status and confidential notes persisted securely.");

    // Step 7: Contact Message Review & Status Management
    console.log("\n--- Step 7: Admin Contact Inquiry Management ---");
    const adminMessagesRes = await fetch(`${baseUrl}/api/admin/messages`, {
      headers: { Cookie: sessionCookie },
    });
    const adminMessagesJson = await adminMessagesRes.json();
    const msgItem = adminMessagesJson.data.find((m: any) => m.id === contactJson.inquiryId);
    if (!msgItem) throw new Error("Test contact message was not listed in admin messages portal");

    // Admin marks as READ
    const patchMsgStatusRes = await fetch(`${baseUrl}/api/admin/messages/${msgItem.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ status: "READ" }),
    });
    console.log(`PATCH /api/admin/messages/:id/status status: ${patchMsgStatusRes.status}`);
    if (patchMsgStatusRes.status !== 200) throw new Error("Failed to update contact message status");

    const updatedMsgInDb = await prisma.contactInquiry.findUnique({
      where: { id: msgItem.id },
    });
    if (updatedMsgInDb?.status !== "READ") throw new Error("Contact status was not persisted in database");
    console.log("✅ Verified: Admin message status transition to READ persisted.");

    // Step 8: Dashboard Statistics Consistency Check
    console.log("\n--- Step 8: Dashboard Statistics Database Consistency ---");
    const statsRes = await fetch(`${baseUrl}/api/admin/dashboard/stats`, {
      headers: { Cookie: sessionCookie },
    });
    const statsJson = await statsRes.json();
    console.log(`GET /api/admin/dashboard/stats status: ${statsRes.status}`);
    if (statsRes.status !== 200 || !statsJson.stats) {
      throw new Error("Failed to fetch dashboard statistics");
    }

    const dbEpisodeCount = await prisma.video.count();
    const dbPublishedCount = await prisma.video.count({ where: { status: "PUBLISHED" } });
    const dbDraftCount = await prisma.video.count({ where: { status: "DRAFT" } });
    const dbArchivedCount = await prisma.video.count({ where: { status: "ARCHIVED" } });
    const dbTotalGuests = await prisma.guestApplication.count();
    const dbTotalMessages = await prisma.contactInquiry.count();

    console.log("DB Stats vs API Stats:");
    console.log(`  Episodes (Total): DB=${dbEpisodeCount}, API=${statsJson.stats.episodes.total}`);
    console.log(`  Episodes (Published): DB=${dbPublishedCount}, API=${statsJson.stats.episodes.published}`);
    console.log(`  Episodes (Draft): DB=${dbDraftCount}, API=${statsJson.stats.episodes.draft}`);
    console.log(`  Episodes (Archived): DB=${dbArchivedCount}, API=${statsJson.stats.episodes.archived}`);
    console.log(`  Guests (Total): DB=${dbTotalGuests}, API=${statsJson.stats.guestApplications.total}`);
    console.log(`  Messages (Total): DB=${dbTotalMessages}, API=${statsJson.stats.contactMessages.total}`);

    if (
      statsJson.stats.episodes.total !== dbEpisodeCount ||
      statsJson.stats.episodes.published !== dbPublishedCount ||
      statsJson.stats.episodes.draft !== dbDraftCount ||
      statsJson.stats.episodes.archived !== dbArchivedCount ||
      statsJson.stats.guestApplications.total !== dbTotalGuests ||
      statsJson.stats.contactMessages.total !== dbTotalMessages
    ) {
      throw new Error("Dashboard statistics mismatch with underlying database counts!");
    }
    console.log("✅ Verified: Dashboard statistics accurately match 100% of SQL Server tables.");

    // Step 9: Audit Trail Integrity Verification
    console.log("\n--- Step 9: Audit Trail Verification in dbo.AuditLog ---");
    const adminAuditLogs = await prisma.auditLog.findMany({
      where: { userId: testAdmin.id },
      orderBy: { createdAt: "desc" },
    });
    console.log(`Recorded Audit Logs for Test Admin (${adminAuditLogs.length} entries):`);
    for (const log of adminAuditLogs) {
      console.log(`  - Action: ${log.action}, Entity: ${log.entity}, ID: ${log.entityId}`);
    }

    const actions = adminAuditLogs.map((a) => a.action);
    const expectedActions = [
      "ADMIN_LOGIN",
      "EPISODE_CREATED",
      "EPISODE_UPDATED",
      "EPISODE_ARCHIVED",
      "GUEST_STATUS_UPDATED",
      "GUEST_NOTES_UPDATED",
      "CONTACT_STATUS_UPDATED",
    ];

    for (const exp of expectedActions) {
      if (!actions.includes(exp)) {
        throw new Error(`Missing expected audit action in dbo.AuditLog: ${exp}`);
      }
    }
    console.log("✅ Verified: All administrative mutations generated comprehensive audit records.");

    // Step 10: Admin Logout & Session Destruction
    console.log("\n--- Step 10: Logout & Invalidation ---");
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: sessionCookie,
        "x-csrf-token": csrfToken,
      },
    });
    console.log(`POST /api/auth/logout status: ${logoutRes.status}`);
    if (logoutRes.status !== 200) throw new Error("Logout request failed");

    // Verify session destroyed in SQL Server
    const sessionAfterLogout = await prisma.session.findFirst({
      where: { userId: testAdmin.id },
    });
    if (sessionAfterLogout) {
      throw new Error("Security Violation: Session record still persists in dbo.Session after logout!");
    }

    const checkMeAfterLogout = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    console.log(`GET /api/auth/me after logout (Expected 401): ${checkMeAfterLogout.status}`);
    if (checkMeAfterLogout.status !== 401) {
      throw new Error("Expected 401 for destroyed session");
    }
    console.log("✅ Verified: Session destroyed from dbo.Session and cookie invalidated.");

    console.log("\n🎉 ALL STAGE 5 INTEGRATION & SECURITY TESTS PASSED PERFECTLY!");
  } catch (error: any) {
    console.error("\n❌ STAGE 5 TEST SUITE FAILED:", error.message);
    throw error;
  } finally {
    // -------------------------------------------------------------------------
    // Clean up ONLY test records created during this test run
    // -------------------------------------------------------------------------
    console.log("\n🧹 Cleaning up test artifacts from SQL Server...");
    try {
      if (cleanupEpisodeIds.length > 0) {
        await prisma.video.deleteMany({ where: { id: { in: cleanupEpisodeIds } } });
        console.log(`  - Cleaned ${cleanupEpisodeIds.length} test episode(s)`);
      }
      if (cleanupGuestIds.length > 0) {
        await prisma.guestApplication.deleteMany({ where: { id: { in: cleanupGuestIds } } });
        console.log(`  - Cleaned ${cleanupGuestIds.length} test guest application(s)`);
      }
      if (cleanupContactIds.length > 0) {
        await prisma.contactInquiry.deleteMany({ where: { id: { in: cleanupContactIds } } });
        console.log(`  - Cleaned ${cleanupContactIds.length} test contact inquiry/inquiries`);
      }
      if (cleanupReviewIds.length > 0) {
        await prisma.review.deleteMany({ where: { id: { in: cleanupReviewIds } } });
        console.log(`  - Cleaned ${cleanupReviewIds.length} test review(s)`);
      }
      if (cleanupUserIds.length > 0) {
        await prisma.session.deleteMany({ where: { userId: { in: cleanupUserIds } } });
        await prisma.auditLog.deleteMany({ where: { userId: { in: cleanupUserIds } } });
        await prisma.user.deleteMany({ where: { id: { in: cleanupUserIds } } });
        console.log(`  - Cleaned ${cleanupUserIds.length} test user(s) and associated sessions/audit logs`);
      }
      console.log("✅ Cleanup complete. Zero stray test data remaining in GDPWebsiteDB.");
    } catch (cleanupErr: any) {
      console.error("Cleanup warning:", cleanupErr.message);
    }

    if (server!) {
      server.close();
    }
    await disconnectDatabase();
    console.log("🔒 Database disconnected gracefully.");
  }
}

runStage5Tests().catch(() => {
  process.exit(1);
});
