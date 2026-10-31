import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting GDP Website database seed...");

  const adminEmail = process.env.ADMIN_INITIAL_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    console.warn("⚠️  Skipping administrator provisioning:");
    console.warn("    ADMIN_INITIAL_EMAIL and/or ADMIN_INITIAL_PASSWORD are not set in environment.");
    console.warn("    To provision the initial administrator safely without committing credentials, set:");
    console.warn("    ADMIN_INITIAL_EMAIL=\"your-email@domain.com\"");
    console.warn("    ADMIN_INITIAL_PASSWORD=\"YourStrongPassword123!\"");
    console.warn("    then re-run the seed script to provision admin.");
  } else {

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase() },
  });

  if (existingUser) {
    console.log(`ℹ️  User with email [${adminEmail}] already exists (ID: ${existingUser.id}, Role: ${existingUser.role}).`);
    console.log("    Preserving existing account and password hash. No changes made.");
  } else {
    // Hash password with bcryptjs salt rounds = 12
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const newAdmin = await prisma.user.create({
      data: {
        email: adminEmail.toLowerCase(),
        displayName: "Bhavesh J. Chudasama",
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: true,
      },
    });

    // Record audit log for provisioning
    await prisma.auditLog.create({
      data: {
        userId: newAdmin.id,
        action: "ADMIN_PROVISIONED",
        entity: "User",
        entityId: newAdmin.id,
        details: JSON.stringify({
          role: "ADMIN",
          note: "Initial administrator account provisioned via secure seed script.",
        }),
      },
    });

    console.log(`✅ Administrator account successfully provisioned for [${adminEmail}] (ID: ${newAdmin.id}).`);
    }
  }

  // Seed verified channel episodes if table is empty
  const existingVideoCount = await prisma.video.count();
  if (existingVideoCount === 0) {
    console.log("🎬 Seeding verified GDP channel podcast episodes...");
    await prisma.video.createMany({
      data: [
        {
          title: "How to Build Personal Brand | Brand Building | Podcast Benefits | Best Podcaster",
          description: "Bhavesh Chudasama explains why business owners and professionals must step out from behind the company name, share authentic stories, and build an enduring personal brand with GDP Podcast in Surat.",
          youtubeVideoId: "1vbEoi4YuZ0",
          thumbnailUrl: "https://img.youtube.com/vi/1vbEoi4YuZ0/maxresdefault.jpg",
          guestName: "Bhavesh J. Chudasama",
          guestRole: "Founder & CEO — Sunrise Software Development",
          category: "Personal Branding",
          isFeatured: true,
          status: "PUBLISHED",
          displayOrder: 1,
          publishedAt: new Date("2026-03-01T10:00:00Z"),
        },
        {
          title: "Hindi Motivational Podcast | Secrets to a Happy Life by Nilesh S Modi | Life Coach",
          description: "Visionary life coach and mentor Nilesh S Modi shares life-changing guidance on true happiness, managing burnout, and maintaining spiritual balance during high-stakes growth.",
          youtubeVideoId: "2v6NrmW4gXc",
          thumbnailUrl: "https://img.youtube.com/vi/2v6NrmW4gXc/maxresdefault.jpg",
          guestName: "Nilesh S Modi",
          guestRole: "Life Coach & Mentor",
          category: "Mindset & Growth",
          isFeatured: true,
          status: "PUBLISHED",
          displayOrder: 2,
          publishedAt: new Date("2026-03-10T10:00:00Z"),
        },
        {
          title: "Podcast with Guinness World Record Hair Stylist Denish Bhatti | Hair & Salon Industry",
          description: "Guinness World Record hair artist Denish Bhatti discusses scaling creative craft into enterprise, mindset for world-record discipline, and the booming salon industry.",
          youtubeVideoId: "5WNPBjZbC2M",
          thumbnailUrl: "https://img.youtube.com/vi/5WNPBjZbC2M/maxresdefault.jpg",
          guestName: "Denish Bhatti",
          guestRole: "Guinness World Record Hair Artist",
          category: "Business & Craft",
          isFeatured: false,
          status: "PUBLISHED",
          displayOrder: 3,
          publishedAt: new Date("2026-03-18T10:00:00Z"),
        },
        {
          title: "Expert Ayurved Podcast Gujarati | સ્વસ્થ રહેવાનું સાચું રહસ્ય | આયુર્વેદ ની વાતો",
          description: "A deep dive into classical Ayurvedic healing, gut immunity, preventative wellness, and daily health rituals tailored for modern entrepreneurs and families in Gujarat.",
          youtubeVideoId: "ha38TqpTkoo",
          thumbnailUrl: "https://img.youtube.com/vi/ha38TqpTkoo/maxresdefault.jpg",
          guestName: "Dr. Anandita Patel",
          guestRole: "Ayurvedic Specialist",
          category: "Health & Ayurveda",
          isFeatured: false,
          status: "PUBLISHED",
          displayOrder: 4,
          publishedAt: new Date("2026-03-25T10:00:00Z"),
        },
        {
          title: "वास्तु शास्त्र क्या है? बिना तोड़फोड़ के वास्तु उपाय | Vastu Podcast in Hindi | Human Vastu Expert",
          description: "Scientific and non-destructive Vastu Shastra principles for modern residential and commercial architectures to maximize prosperity, peace of mind, and business vitality.",
          youtubeVideoId: "28O_v97tRSE",
          thumbnailUrl: "https://img.youtube.com/vi/28O_v97tRSE/maxresdefault.jpg",
          guestName: "Human Vastu Expert",
          guestRole: "Vastu & Architecture Consultant",
          category: "Vastu & Architecture",
          isFeatured: false,
          status: "PUBLISHED",
          displayOrder: 5,
          publishedAt: new Date("2026-04-01T10:00:00Z"),
        },
      ],
    });
    console.log("✅ Inserted 5 verified GDP channel episodes (status: PUBLISHED).");
  } else {
    console.log(`ℹ️  Video table already contains ${existingVideoCount} records.`);
  }

  console.log("✨ Seed process completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
