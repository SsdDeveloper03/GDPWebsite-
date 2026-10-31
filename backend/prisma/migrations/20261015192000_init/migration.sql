BEGIN TRY

BEGIN TRAN;

-- CreateSchema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'dbo') EXEC sp_executesql N'CREATE SCHEMA [dbo];';

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(64) NOT NULL,
    [displayName] NVARCHAR(100) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [passwordHash] NVARCHAR(255),
    [profileImageUrl] NVARCHAR(1000),
    [role] NVARCHAR(20) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'USER',
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [User_status_df] DEFAULT 'ACTIVE',
    [emailVerified] BIT NOT NULL CONSTRAINT [User_emailVerified_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Review] (
    [id] NVARCHAR(64) NOT NULL,
    [userId] NVARCHAR(64) NOT NULL,
    [rating] INT NOT NULL,
    [title] NVARCHAR(200),
    [content] NVARCHAR(max) NOT NULL,
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [Review_status_df] DEFAULT 'PENDING',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Review_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [approvedAt] DATETIME2,
    CONSTRAINT [Review_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Review_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[Video] (
    [id] NVARCHAR(64) NOT NULL,
    [title] NVARCHAR(300) NOT NULL,
    [description] NVARCHAR(max),
    [youtubeVideoId] NVARCHAR(50) NOT NULL,
    [thumbnailUrl] NVARCHAR(1000),
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [Video_status_df] DEFAULT 'DRAFT',
    [displayOrder] INT NOT NULL CONSTRAINT [Video_displayOrder_df] DEFAULT 0,
    [publishedAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Video_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Video_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ContactInquiry] (
    [id] NVARCHAR(64) NOT NULL,
    [name] NVARCHAR(150) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [phone] NVARCHAR(50),
    [subject] NVARCHAR(250),
    [message] NVARCHAR(max) NOT NULL,
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [ContactInquiry_status_df] DEFAULT 'NEW',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ContactInquiry_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [ContactInquiry_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SiteConfiguration] (
    [id] NVARCHAR(64) NOT NULL,
    [key] NVARCHAR(100) NOT NULL,
    [value] NVARCHAR(max) NOT NULL,
    [description] NVARCHAR(500),
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [SiteConfiguration_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SiteConfiguration_key_key] UNIQUE NONCLUSTERED ([key])
);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] NVARCHAR(64) NOT NULL,
    [sid] NVARCHAR(128) NOT NULL,
    [userId] NVARCHAR(64),
    [data] NVARCHAR(max) NOT NULL,
    [expiresAt] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Session_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Session_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Session_sid_key] UNIQUE NONCLUSTERED ([sid])
);

-- CreateTable
CREATE TABLE [dbo].[AuditLog] (
    [id] NVARCHAR(64) NOT NULL,
    [userId] NVARCHAR(64),
    [action] NVARCHAR(100) NOT NULL,
    [entity] NVARCHAR(100) NOT NULL,
    [entityId] NVARCHAR(64),
    [details] NVARCHAR(max),
    [ipAddress] NVARCHAR(50),
    [userAgent] NVARCHAR(500),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AuditLog_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AuditLog_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_role_idx] ON [dbo].[User]([role]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_status_idx] ON [dbo].[User]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Review_status_createdAt_idx] ON [dbo].[Review]([status], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Review_rating_idx] ON [dbo].[Review]([rating]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Video_status_displayOrder_idx] ON [dbo].[Video]([status], [displayOrder]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Video_publishedAt_idx] ON [dbo].[Video]([publishedAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ContactInquiry_status_createdAt_idx] ON [dbo].[ContactInquiry]([status], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Session_expiresAt_idx] ON [dbo].[Session]([expiresAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Session_userId_idx] ON [dbo].[Session]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AuditLog_action_createdAt_idx] ON [dbo].[AuditLog]([action], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AuditLog_entity_entityId_idx] ON [dbo].[AuditLog]([entity], [entityId]);

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AuditLog] ADD CONSTRAINT [AuditLog_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
