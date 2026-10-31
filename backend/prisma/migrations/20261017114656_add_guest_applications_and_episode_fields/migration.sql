BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Video] ADD [applePodcastsUrl] NVARCHAR(1000),
[category] NVARCHAR(100),
[guestName] NVARCHAR(150),
[guestRole] NVARCHAR(150),
[isFeatured] BIT NOT NULL CONSTRAINT [Video_isFeatured_df] DEFAULT 0,
[spotifyUrl] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[GuestApplication] (
    [id] NVARCHAR(64) NOT NULL,
    [fullName] NVARCHAR(150) NOT NULL,
    [companyRole] NVARCHAR(150) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [phone] NVARCHAR(50),
    [expertiseArea] NVARCHAR(200) NOT NULL,
    [topicSummary] NVARCHAR(max) NOT NULL,
    [linkedinOrWebsite] NVARCHAR(1000),
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [GuestApplication_status_df] DEFAULT 'NEW',
    [adminNotes] NVARCHAR(max),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [GuestApplication_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [GuestApplication_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [GuestApplication_status_createdAt_idx] ON [dbo].[GuestApplication]([status], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [GuestApplication_email_idx] ON [dbo].[GuestApplication]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Video_isFeatured_idx] ON [dbo].[Video]([isFeatured]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Video_category_idx] ON [dbo].[Video]([category]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
