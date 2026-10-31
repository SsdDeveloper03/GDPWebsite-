import type { Request, Response } from "express";
import { prisma } from "../config/database.js";
import type { ContactInquiryInput } from "../validators/contactValidator.js";
import {
  sendClientInquiryConfirmation,
  sendTeamInquiryNotification,
} from "../services/whatsappService.js";

/**
 * Handles public contact inquiries.
 * Sets initial status strictly to 'NEW' on the server.
 */
export async function submitContact(req: Request, res: Response): Promise<void> {
  try {
    const input = req.body as ContactInquiryInput;

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone && input.phone.trim().length > 0 ? input.phone.trim() : null,
        subject: input.subject && input.subject.trim().length > 0 ? input.subject.trim() : "General Inquiry",
        message: input.message,
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
        "Thank you for contacting GDP Studio. Your inquiry has been received, and our team will get back to you shortly.",
      inquiryId: inquiry.id,
    });

    // Send WhatsApp confirmation to the client and alert the GDP team in the background
    const clientPhone = input.phone && input.phone.trim().length > 0 ? input.phone.trim() : null;
    if (clientPhone) {
      sendClientInquiryConfirmation({
        name: input.name,
        phone: clientPhone,
        inquiryReference: inquiry.id,
        enquiryType:
          input.subject && input.subject.trim().length > 0 && input.subject !== "General Inquiry"
            ? input.subject.trim()
            : "Podcast & Personal Branding",
      }).catch((err) => {
        console.error("[WhatsApp] Error sending client confirmation:", err.message || err);
      });
    }

    sendTeamInquiryNotification({
      name: input.name,
      phone: clientPhone,
      email: input.email,
      company: null,
      enquiryType: input.subject || "GDP Podcast Inquiry",
      message: input.message,
      inquiryReference: inquiry.id,
    }).catch((err) => {
      console.error("[WhatsApp] Error sending team alert:", err.message || err);
    });
  } catch (error) {
    console.error("Error saving contact inquiry:", error);
    res.status(500).json({
      success: false,
      error: "Submission Error",
      message: "An unexpected error occurred while saving your inquiry. Please try again or connect via WhatsApp.",
    });
  }
}
