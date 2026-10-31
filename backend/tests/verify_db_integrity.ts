import { prisma, disconnectDatabase } from "../src/config/database.js";

async function verifyDb() {
  console.log("🔍 Running SQL Server Database Integrity Audit...");
  try {
    // 1. Check migrations table
    const migrations: any = await prisma.$queryRaw`
      SELECT migration_name, finished_at, rolled_back_at, applied_steps_count
      FROM dbo._prisma_migrations
      ORDER BY finished_at ASC
    `;
    console.log("\nApplied Migrations in GDPWebsiteDB:");
    for (const m of migrations) {
      console.log(`  - ${m.migration_name} (Applied Steps: ${m.applied_steps_count}, Finished: ${m.finished_at})`);
    }

    // 2. Foreign Keys
    const fks: any = await prisma.$queryRaw`
      SELECT 
        fk.name AS ForeignKey,
        OBJECT_NAME(fk.parent_object_id) AS TableName,
        COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
        OBJECT_NAME (fk.referenced_object_id) AS ReferenceTableName,
        COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS ReferenceColumnName,
        fk.delete_referential_action_desc AS OnDelete
      FROM sys.foreign_keys AS fk
      INNER JOIN sys.foreign_key_columns AS fc 
        ON fk.object_id = fc.constraint_object_id
      ORDER BY TableName
    `;
    console.log("\nForeign Key Constraints:");
    for (const fk of fks) {
      console.log(`  - ${fk.TableName}.${fk.ColumnName} -> ${fk.ReferenceTableName}.${fk.ReferenceColumnName} [On Delete: ${fk.OnDelete}]`);
    }

    // 3. Unique & Primary Key Constraints
    const uqs: any = await prisma.$queryRaw`
      SELECT 
        i.name AS IndexName,
        OBJECT_NAME(i.object_id) AS TableName,
        i.is_unique,
        i.is_primary_key,
        c.name AS ColumnName
      FROM sys.indexes i
      INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
      INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
      WHERE OBJECT_NAME(i.object_id) IN ('User', 'Video', 'GuestApplication', 'ContactInquiry', 'Review', 'Session', 'AuditLog', 'SiteConfiguration')
        AND i.is_unique = 1
      ORDER BY TableName, IndexName
    `;
    console.log("\nUnique Constraints & Primary Keys:");
    for (const uq of uqs) {
      console.log(`  - ${uq.TableName}.${uq.ColumnName} [${uq.is_primary_key ? 'PRIMARY KEY' : 'UNIQUE'}] (${uq.IndexName})`);
    }

    // 4. Live Table Row Counts (Real Production/Development State)
    const [users, videos, guests, contacts, reviews, sessions, auditLogs] = await Promise.all([
      prisma.user.count(),
      prisma.video.count(),
      prisma.guestApplication.count(),
      prisma.contactInquiry.count(),
      prisma.review.count(),
      prisma.session.count(),
      prisma.auditLog.count(),
    ]);

    console.log("\nDatabase Record Summary:");
    console.log(`  - dbo.User: ${users} rows`);
    console.log(`  - dbo.Video: ${videos} rows`);
    console.log(`  - dbo.GuestApplication: ${guests} rows`);
    console.log(`  - dbo.ContactInquiry: ${contacts} rows`);
    console.log(`  - dbo.Review: ${reviews} rows`);
    console.log(`  - dbo.Session: ${sessions} rows`);
    console.log(`  - dbo.AuditLog: ${auditLogs} rows`);

  } catch (err: any) {
    console.error("Database check failed:", err.message);
  } finally {
    await disconnectDatabase();
  }
}

verifyDb();
