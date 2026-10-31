import type { Request, Response } from "express";
import { prisma } from "../config/database.js";

/**
 * Returns all published podcast episodes.
 * Supports category filtering and featured ordering.
 */
export async function getEpisodes(req: Request, res: Response): Promise<void> {
  try {
    const query = ((req as any).validatedQuery || req.query) as {
      category?: string;
      featured?: boolean;
      limit?: number;
    };
    const { category, featured, limit } = query;

    const where: any = {
      status: "PUBLISHED", // Strictly public only
    };

    if (category && category !== "All" && category.trim().length > 0) {
      where.category = category.trim();
    }

    if (typeof featured === "boolean") {
      where.isFeatured = featured;
    }

    const episodes = await prisma.video.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        youtubeVideoId: true,
        thumbnailUrl: true,
        guestName: true,
        guestRole: true,
        category: true,
        spotifyUrl: true,
        applePodcastsUrl: true,
        isFeatured: true,
        displayOrder: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { displayOrder: "asc" },
        { publishedAt: "desc" },
      ],
      take: limit || 50,
    });

    res.json({
      success: true,
      count: episodes.length,
      data: episodes,
    });
  } catch (error) {
    console.error("Error fetching published episodes:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "An unexpected error occurred while loading episodes.",
    });
  }
}

/**
 * Returns a single published episode by ID.
 * Returns 404 if the episode does not exist or is not published.
 */
export async function getEpisodeById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;

    const episode = await prisma.video.findFirst({
      where: {
        id,
        status: "PUBLISHED", // Never expose drafts publicly
      },
      select: {
        id: true,
        title: true,
        description: true,
        youtubeVideoId: true,
        thumbnailUrl: true,
        guestName: true,
        guestRole: true,
        category: true,
        spotifyUrl: true,
        applePodcastsUrl: true,
        isFeatured: true,
        displayOrder: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    if (!episode) {
      res.status(404).json({
        success: false,
        error: "Not Found",
        message: "The requested podcast episode was not found or is currently unavailable.",
      });
      return;
    }

    res.json({
      success: true,
      data: episode,
    });
  } catch (error) {
    console.error("Error fetching episode by ID:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "An unexpected error occurred while loading the episode.",
    });
  }
}
