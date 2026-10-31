import type { Request, Response } from "express";
import { prisma } from "../config/database.js";
import type { GuestApplicationInput } from "../validators/guestValidator.js";
import {
  sendClientInquiryConfirmation,
  sendTeamInquiryNotification,
} from "../services/whatsappService.js";

/**
 * Handles public guest application submissions.
 * Sets initial status strictly to 'NEW' on the server.
 */
export async function applyAsGuest(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body as GuestApplicationInput;

    const application = await prisma.guestApplication.create({
      data: {
        fullName: input.fullName,
        companyRole: input.companyRole,
        email: input.email.toLowerCase(),
        phone: input.phone && input.phone.trim().length > 0 ? input.phone.trim() : null,
        expertiseArea: input.expertiseArea,
        topicSummary: input.topicSummary,
        linkedinOrWebsite:
          input.linkedinOrWebsite && input.linkedinOrWebsite.trim().length > 0
            ? input.linkedinOrWebsite.trim()
            : null,
        status: "NEW", // Strictly enforced server-side
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message:
        "Thank you for submitting your guest proposal. Our team at Growth Ka Digital Partner reviews every submission carefully and will get in touch soon.",
      applicationId: application.id,
    });

    // Send WhatsApp confirmation to guest applicant and alert team in background
    const applicantPhone = input.phone && input.phone.trim().length > 0 ? input.phone.trim() : null;
    if (applicantPhone) {
      sendClientInquiryConfirmation({
        name: input.fullName,
        phone: applicantPhone,
        inquiryReference: application.id,
        enquiryType: "Podcast Guest Application",
      }).catch((err) => {
        console.error("[WhatsApp] Error sending guest confirmation:", err.message || err);
      });
    }

    sendTeamInquiryNotification({
      name: input.fullName,
      phone: applicantPhone,
      email: input.email,
      company: input.companyRole,
      enquiryType: "Podcast Guest Application",
      message: `Expertise: ${input.expertiseArea} | Topic: ${input.topicSummary}`,
      inquiryReference: application.id,
    }).catch((err) => {
      console.error("[WhatsApp] Error sending team guest alert:", err.message || err);
    });
  } catch (error) {
    console.error("Error saving guest application:", error);
    res.status(500).json({
      success: false,
      error: "Submission Error",
      message: "An unexpected error occurred while saving your application. Please try again or reach out via WhatsApp.",
    });
  }
}
