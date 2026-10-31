import type { Request, Response } from "express";
import { prisma } from "../config/database.js";

/**
 * Returns all approved public reviews and testimonials.
 * Excludes pending/rejected reviews and private user fields.
 */
export async function getApprovedReviews(_req: Request, res: Response): Promise<void> {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        id: true,
        rating: true,
        title: true,
        content: true,
        createdAt: true,
        approvedAt: true,
        user: {
          select: {
            displayName: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: [
        { approvedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: 50,
    });

    // Compute distribution and average if reviews exist
    let average = 5.0;
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (reviews.length > 0) {
      let sum = 0;
      for (const r of reviews) {
        sum += r.rating;
        const star = Math.min(Math.max(r.rating, 1), 5);
        distribution[star] = (distribution[star] || 0) + 1;
      }
      average = parseFloat((sum / reviews.length).toFixed(1));
    }

    res.json({
      success: true,
      count: reviews.length,
      summary: {
        average,
        totalReviews: reviews.length,
        distribution,
      },
      data: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        content: r.content,
        author: r.user.displayName,
        avatarUrl: r.user.profileImageUrl,
        date: r.approvedAt || r.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    res.status(500).json({
      success: false,
      error: "Query Error",
      message: "An unexpected error occurred while loading reviews.",
    });
  }
}
