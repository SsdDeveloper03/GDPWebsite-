import app from "../src/index.js";
import { prisma, disconnectDatabase } from "../src/config/database.js";
import type { Server } from "http";

async function runTests() {
  console.log("🧪 Starting Stage 2 API Integration Tests...");
  let server: Server;
  let port: number;
  let baseUrl: string;

  // Start app on ephemeral port
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address();
      port = typeof addr === "object" && addr ? addr.port : 5001;
      baseUrl = `http://localhost:${port}`;
      console.log(`📡 Test server running on ${baseUrl}`);
      resolve();
    });
  });

  let createdGuestAppId: string | null = null;
  let createdContactId: string | null = null;

  try {
    // 1. Health check
    console.log("\n1️⃣ Testing GET /api/health...");
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.log("Health Status:", healthRes.status, healthData.status);
    if (healthRes.status !== 200 || healthData.status !== "ok") {
      throw new Error("Health check failed");
    }

    // 2. Guest Application: Valid submission
    console.log("\n2️⃣ Testing POST /api/guests/apply (Valid)...");
    const validGuestPayload = {
      fullName: "Test Founder",
      companyRole: "CEO, Tech Solutions",
      email: "test.founder@example.com",
      phone: "+91 98765 43210",
      expertiseArea: "Cloud Architecture",
      topicSummary: "Sharing lessons on enterprise cloud migration in Gujarat.",
      linkedinOrWebsite: "https://linkedin.com/in/testfounder",
      consent: true,
    };
    const guestRes = await fetch(`${baseUrl}/api/guests/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validGuestPayload),
    });
    const guestData = await guestRes.json();
    console.log("Guest Apply Status:", guestRes.status, guestData);
    if (guestRes.status !== 201 || !guestData.success || !guestData.applicationId) {
      throw new Error("Valid guest application failed");
    }
    createdGuestAppId = guestData.applicationId;

    // Verify row in database
    const savedApp = await prisma.guestApplication.findUnique({
      where: { id: createdGuestAppId! },
    });
    console.log("Saved GuestApplication in DB:", {
      id: savedApp?.id,
      fullName: savedApp?.fullName,
      status: savedApp?.status, // Must be 'NEW'
    });
    if (savedApp?.status !== "NEW") throw new Error("Status should be NEW");

    // 3. Guest Application: Invalid email
    console.log("\n3️⃣ Testing POST /api/guests/apply (Invalid Email)...");
    const invalidGuestPayload = {
      ...validGuestPayload,
      email: "not-an-email",
    };
    const invalidGuestRes = await fetch(`${baseUrl}/api/guests/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidGuestPayload),
    });
    console.log("Invalid Email Status (Expected 400):", invalidGuestRes.status);
    if (invalidGuestRes.status !== 400) throw new Error("Expected 400 for invalid email");

    // 4. Guest Application: Honeypot trap
    console.log("\n4️⃣ Testing POST /api/guests/apply (Honeypot Trap)...");
    const honeypotGuestPayload = {
      ...validGuestPayload,
      fullName: "Bot User",
      email: "bot@spammer.com",
      _hp: "I am a spam bot filling hidden fields",
    };
    const honeypotGuestRes = await fetch(`${baseUrl}/api/guests/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(honeypotGuestPayload),
    });
    const honeypotData = await honeypotGuestRes.json();
    console.log("Honeypot Status (Expected 200 silent success):", honeypotGuestRes.status, honeypotData);
    // Verify bot was NOT saved in database
    const botRow = await prisma.guestApplication.findFirst({
      where: { email: "bot@spammer.com" },
    });
    if (botRow) throw new Error("Bot submission was saved to DB!");
    console.log("Verified: Honeypot submission was NOT persisted to database.");

    // 5. Contact Inquiry: Valid submission
    console.log("\n5️⃣ Testing POST /api/contact (Valid)...");
    const validContactPayload = {
      name: "Inquiry Sender",
      email: "sender@example.com",
      phone: "+91 91234 56789",
      subject: "Studio Booking Inquiry",
      message: "We would like to book a recording session for next month.",
    };
    const contactRes = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validContactPayload),
    });
    const contactData = await contactRes.json();
    console.log("Contact Status:", contactRes.status, contactData);
    if (contactRes.status !== 201 || !contactData.success || !contactData.inquiryId) {
      throw new Error("Valid contact inquiry failed");
    }
    createdContactId = contactData.inquiryId;

    // Verify row in database
    const savedInquiry = await prisma.contactInquiry.findUnique({
      where: { id: createdContactId! },
    });
    console.log("Saved ContactInquiry in DB:", {
      id: savedInquiry?.id,
      name: savedInquiry?.name,
      status: savedInquiry?.status,
    });
    if (savedInquiry?.status !== "NEW") throw new Error("Contact status should be NEW");

    // 6. Contact Inquiry: Missing message
    console.log("\n6️⃣ Testing POST /api/contact (Missing Message)...");
    const invalidContactRes = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A", email: "a@a.com" }),
    });
    console.log("Missing Message Status (Expected 400):", invalidContactRes.status);
    if (invalidContactRes.status !== 400) throw new Error("Expected 400 for missing message");

    // 7. Episodes: GET /api/episodes
    console.log("\n7️⃣ Testing GET /api/episodes...");
    const episodesRes = await fetch(`${baseUrl}/api/episodes`);
    const episodesData = await episodesRes.json();
    console.log("Episodes Status:", episodesRes.status, "Count:", episodesData.count);
    if (episodesRes.status !== 200 || !episodesData.success) {
      throw new Error("Get episodes failed");
    }

    // 8. Episodes: Non-existent episode 404
    console.log("\n8️⃣ Testing GET /api/episodes/:id (404 Test)...");
    const notFoundRes = await fetch(`${baseUrl}/api/episodes/non-existent-id`);
    console.log("Episode Not Found Status (Expected 404):", notFoundRes.status);
    if (notFoundRes.status !== 404) throw new Error("Expected 404 for non-existent episode");

    // 9. Reviews: GET /api/reviews
    console.log("\n9️⃣ Testing GET /api/reviews...");
    const reviewsRes = await fetch(`${baseUrl}/api/reviews`);
    const reviewsData = await reviewsRes.json();
    console.log("Reviews Status:", reviewsRes.status, "Count:", reviewsData.count, "Summary:", reviewsData.summary);
    if (reviewsRes.status !== 200 || !reviewsData.success) {
      throw new Error("Get reviews failed");
    }

    console.log("\n✨ All Stage 2 API Integration Tests Passed Successfully!");
  } finally {
    // Clean up test rows
    if (createdGuestAppId) {
      await prisma.guestApplication.delete({ where: { id: createdGuestAppId } }).catch(() => {});
      console.log("Cleaned up test GuestApplication row.");
    }
    if (createdContactId) {
      await prisma.contactInquiry.delete({ where: { id: createdContactId } }).catch(() => {});
      console.log("Cleaned up test ContactInquiry row.");
    }

    // Close server and database connection
    server!.close();
    await disconnectDatabase();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
