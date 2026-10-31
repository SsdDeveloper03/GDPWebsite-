import type { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { recordAuditLog } from "../services/auditService.js";

// ============================================================================
// 1. EPISODES MANAGEMENT
// ============================================================================

export async function getAdminEpisodes(req: Request, res: Response): Promise<void> {
  try {
    const query = ((req as any).validatedQuery || req.query) as {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    };

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status && query.status !== "ALL") {
      where.status = query.status;
    }
    if (query.search && query.search.trim().length > 0) {
      where.OR = [
        { title: { contains: query.search.trim() } },
        { description: { contains: query.search.trim() } },
        { guestName: { contains: query.search.trim() } },
      ];
    }

    const [total, episodes] = await Promise.all([
      prisma.video.count({ where }),
      prisma.video.findMany({
        where,
        orderBy: [
          { isFeatured: "desc" },
          { displayOrder: "asc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
    ]);

    res.json({
      success: true,
      data: episodes,
      episodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin episodes:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "Failed to retrieve episodes.",
    });
  }
}

export async function createAdminEpisode(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;
    let publishedAt: Date | null = null;

    if (body.publishedAt) {
      publishedAt = new Date(body.publishedAt);
    } else if (body.status === "PUBLISHED") {
      publishedAt = new Date();
    }

    const episode = await prisma.video.create({
      data: {
        title: body.title,
        description: body.description || null,
        youtubeVideoId: body.youtubeVideoId,
        thumbnailUrl: body.thumbnailUrl || null,
        guestName: body.guestName || null,
        guestRole: body.guestRole || null,
        category: body.category || null,
        spotifyUrl: body.spotifyUrl || null,
        applePodcastsUrl: body.applePodcastsUrl || null,
        isFeatured: Boolean(body.isFeatured),
        status: body.status || "DRAFT",
        displayOrder: body.displayOrder || 0,
        publishedAt,
      },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: "EPISODE_CREATED",
      entity: "Video",
      entityId: episode.id,
      details: { title: episode.title, status: episode.status },
      req,
    });

    res.status(201).json({
      success: true,
      message: "Episode created successfully.",
      data: episode,
      episode,
    });
  } catch (error) {
    console.error("Error creating episode:", error);
    res.status(500).json({
      success: false,
      error: "Creation Error",
      message: "Failed to create episode.",
    });
  }
}

export async function getAdminEpisodeById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const episode = await prisma.video.findUnique({
      where: { id },
    });

    if (!episode) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Episode not found.",
      });
      return;
    }

    res.json({
      success: true,
      data: episode,
      episode,
    });
  } catch (error) {
    console.error("Error retrieving episode:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "Failed to retrieve episode details.",
    });
  }
}

export async function updateAdminEpisode(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const body = req.body;

    const existing = await prisma.video.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Episode not found.",
      });
      return;
    }

    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description || null;
    if (body.youtubeVideoId !== undefined) data.youtubeVideoId = body.youtubeVideoId;
    if (body.thumbnailUrl !== undefined) data.thumbnailUrl = body.thumbnailUrl || null;
    if (body.guestName !== undefined) data.guestName = body.guestName || null;
    if (body.guestRole !== undefined) data.guestRole = body.guestRole || null;
    if (body.category !== undefined) data.category = body.category || null;
    if (body.spotifyUrl !== undefined) data.spotifyUrl = body.spotifyUrl || null;
    if (body.applePodcastsUrl !== undefined) data.applePodcastsUrl = body.applePodcastsUrl || null;
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
    if (body.displayOrder !== undefined) data.displayOrder = body.displayOrder;

    if (body.status !== undefined) {
      data.status = body.status;
      if (body.status === "PUBLISHED" && !existing.publishedAt) {
        data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
      }
    }
    if (body.publishedAt !== undefined) {
      data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    }

    const updated = await prisma.video.update({
      where: { id },
      data,
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: "EPISODE_UPDATED",
      entity: "Video",
      entityId: id,
      details: { changes: Object.keys(data), newStatus: updated.status },
      req,
    });

    res.json({
      success: true,
      message: "Episode updated successfully.",
      data: updated,
      episode: updated,
    });
  } catch (error) {
    console.error("Error updating episode:", error);
    res.status(500).json({
      success: false,
      error: "Update Error",
      message: "Failed to update episode.",
    });
  }
}

export async function deleteOrArchiveAdminEpisode(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.video.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Episode not found.",
      });
      return;
    }

    // Preserve published episodes by soft-archiving rather than hard deleting
    const archived = await prisma.video.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: "EPISODE_ARCHIVED",
      entity: "Video",
      entityId: id,
      details: { previousStatus: existing.status },
      req,
    });

    res.json({
      success: true,
      message: "Episode archived successfully.",
      data: archived,
      episode: archived,
    });
  } catch (error) {
    console.error("Error archiving episode:", error);
    res.status(500).json({
      success: false,
      error: "Deletion Error",
      message: "Failed to archive episode.",
    });
  }
}

// ============================================================================
// 2. GUEST APPLICATIONS MANAGEMENT
// ============================================================================

export async function getAdminGuests(req: Request, res: Response): Promise<void> {
  try {
    const query = ((req as any).validatedQuery || req.query) as {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    };

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status && query.status !== "ALL") {
      where.status = query.status;
    }
    if (query.search && query.search.trim().length > 0) {
      where.OR = [
        { fullName: { contains: query.search.trim() } },
        { companyRole: { contains: query.search.trim() } },
        { email: { contains: query.search.trim() } },
        { expertiseArea: { contains: query.search.trim() } },
      ];
    }

    const [total, guests] = await Promise.all([
      prisma.guestApplication.count({ where }),
      prisma.guestApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    res.json({
      success: true,
      data: guests,
      guests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching guest applications:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "Failed to retrieve guest applications.",
    });
  }
}

export async function getAdminGuestById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const guest = await prisma.guestApplication.findUnique({
      where: { id },
    });

    if (!guest) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Guest application not found.",
      });
      return;
    }

    res.json({
      success: true,
      data: guest,
      guest,
    });
  } catch (error) {
    console.error("Error retrieving guest application:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "Failed to retrieve guest details.",
    });
  }
}

export async function updateAdminGuestStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body as { status: string };

    const existing = await prisma.guestApplication.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Guest application not found.",
      });
      return;
    }

    const updated = await prisma.guestApplication.update({
      where: { id },
      data: { status },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: "GUEST_STATUS_UPDATED",
      entity: "GuestApplication",
      entityId: id,
      details: { previousStatus: existing.status, newStatus: status },
      req,
    });

    res.json({
      success: true,
      message: `Guest application marked as ${status}.`,
      data: updated,
      guest: updated,
    });
  } catch (error) {
    console.error("Error updating guest application status:", error);
    res.status(500).json({
      success: false,
      error: "Update Error",
      message: "Failed to update application status.",
    });
  }
}

export async function updateAdminGuestNotes(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { adminNotes } = req.body as { adminNotes: string };

    const existing = await prisma.guestApplication.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Guest application not found.",
      });
      return;
    }

    const updated = await prisma.guestApplication.update({
      where: { id },
      data: { adminNotes },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: "GUEST_NOTES_UPDATED",
      entity: "GuestApplication",
      entityId: id,
      details: { noteLength: adminNotes.length },
      req,
    });

    res.json({
      success: true,
      message: "Internal notes saved.",
      data: updated,
      guest: updated,
    });
  } catch (error) {
    console.error("Error updating guest application notes:", error);
    res.status(500).json({
      success: false,
      error: "Update Error",
      message: "Failed to save application notes.",
    });
  }
}

// ============================================================================
// 3. CONTACT INQUIRIES MANAGEMENT
// ============================================================================

export async function getAdminMessages(req: Request, res: Response): Promise<void> {
  try {
    const query = ((req as any).validatedQuery || req.query) as {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    };

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status && query.status !== "ALL") {
      where.status = query.status;
    }
    if (query.search && query.search.trim().length > 0) {
      where.OR = [
        { name: { contains: query.search.trim() } },
        { email: { contains: query.search.trim() } },
        { subject: { contains: query.search.trim() } },
        { message: { contains: query.search.trim() } },
      ];
    }

    const [total, messages] = await Promise.all([
      prisma.contactInquiry.count({ where }),
      prisma.contactInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    res.json({
      success: true,
      data: messages,
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "Failed to retrieve messages.",
    });
  }
}

export async function getAdminMessageById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const message = await prisma.contactInquiry.findUnique({
      where: { id },
    });

    if (!message) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Message not found.",
      });
      return;
    }

    res.json({
      success: true,
      data: message,
      message,
      contact: message,
    });
  } catch (error) {
    console.error("Error retrieving message:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "Failed to retrieve message details.",
    });
  }
}

export async function updateAdminMessageStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body as { status: string };

    const existing = await prisma.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Message not found.",
      });
      return;
    }

    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    });

    await recordAuditLog({
      userId: req.user?.id,
      action: "CONTACT_STATUS_UPDATED",
      entity: "ContactInquiry",
      entityId: id,
      details: { previousStatus: existing.status, newStatus: status },
      req,
    });

    res.json({
      success: true,
      message: `Message marked as ${status}.`,
      data: updated,
      contact: updated,
    });
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({
      success: false,
      error: "Update Error",
      message: "Failed to update message status.",
    });
  }
}

// ============================================================================
// 4. DASHBOARD STATISTICS
// ============================================================================

export async function getAdminDashboardStats(_req: Request, res: Response): Promise<void> {
  try {
    const [
      totalEpisodes,
      publishedEpisodes,
      draftEpisodes,
      archivedEpisodes,
      newGuests,
      totalGuests,
      newMessages,
      totalMessages,
      recentAudit,
    ] = await Promise.all([
      prisma.video.count(),
      prisma.video.count({ where: { status: "PUBLISHED" } }),
      prisma.video.count({ where: { status: "DRAFT" } }),
      prisma.video.count({ where: { status: "ARCHIVED" } }),
      prisma.guestApplication.count({ where: { status: "NEW" } }),
      prisma.guestApplication.count(),
      prisma.contactInquiry.count({ where: { status: "NEW" } }),
      prisma.contactInquiry.count(),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          action: true,
          entity: true,
          entityId: true,
          details: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      success: true,
      stats: {
        episodes: {
          total: totalEpisodes,
          published: publishedEpisodes,
          draft: draftEpisodes,
          archived: archivedEpisodes,
        },
        guestApplications: {
          new: newGuests,
          total: totalGuests,
        },
        guests: {
          new: newGuests,
          total: totalGuests,
        },
        contactMessages: {
          new: newMessages,
          total: totalMessages,
        },
        messages: {
          new: newMessages,
          total: totalMessages,
        },
        recentActivity: recentAudit,
      },
    });
  } catch (error) {
    console.error("Error retrieving dashboard stats:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "Failed to calculate dashboard statistics.",
    });
  }
}
