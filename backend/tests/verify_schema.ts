import { prisma, disconnectDatabase } from "../src/config/database.js";

async function verify() {
  try {
    const cols: any = await prisma.$queryRaw`
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME IN ('GuestApplication', 'ContactInquiry', 'Video', 'Review', 'User')
      ORDER BY TABLE_NAME, ORDINAL_POSITION
    `;
    console.log("Verified database columns:");
    const grouped: Record<string, string[]> = {};
    for (const c of cols) {
      if (!grouped[c.TABLE_NAME]) grouped[c.TABLE_NAME] = [];
      grouped[c.TABLE_NAME].push(`${c.COLUMN_NAME} (${c.DATA_TYPE}${c.CHARACTER_MAXIMUM_LENGTH ? `(${c.CHARACTER_MAXIMUM_LENGTH})` : ''}, ${c.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
    }
    console.log(JSON.stringify(grouped, null, 2));
  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    await disconnectDatabase();
  }
}

verify();
