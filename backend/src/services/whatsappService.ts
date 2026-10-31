import { env } from "../config/env.js";

/**
 * Normalizes phone numbers to standard format for WhatsApp API (e.g. 91XXXXXXXXXX).
 * Handles Indian numbers with formats: 9876543210, +919876543210, 919876543210, 09876543210.
 */
export function normalizeWhatsAppNumber(phone: string, defaultCountryCode = "91"): string {
  if (!phone) return "";

  // Remove all non-digit characters
  let cleaned = String(phone).replace(/\D/g, "");

  // If starting with leading 0 (e.g., 09876543210), strip the leading 0
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  // If 10 digits (standard Indian mobile number without country code)
  if (cleaned.length === 10) {
    return `${defaultCountryCode}${cleaned}`;
  }

  // If 12 digits and starts with 91 (standard Indian mobile with country code)
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned;
  }

  // If 10 to 15 digits (international standard length)
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return cleaned;
  }

  return cleaned;
}

export interface SendWhatsAppTemplateOptions {
  to: string;
  receiverName?: string;
  templateName: string;
  parameters: Array<{ type: "text"; text: string }>;
}

export interface WhatsAppResult {
  success: boolean;
  data?: any;
  error?: string;
  details?: any;
}

/**
 * Sends a templated WhatsApp message using the Getgabs WhatsApp Business API.
 */
export async function sendWhatsAppTemplate(
  options: SendWhatsAppTemplateOptions
): Promise<WhatsAppResult> {
  const { to, receiverName, templateName, parameters } = options;

  const apiUrl = env.GETGABS_API_URL || "https://app.getgabs.com/whatsappbusiness/send-templated-message";
  const apiKey = env.GETGABS_API_KEY;
  const sender = env.GETGABS_SENDER || "918799441838";
  const campaignId = env.GETGABS_CAMPAIGN_ID || "26103";

  if (!apiKey) {
    console.error("[WhatsApp Error] GETGABS_API_KEY is not configured in environment variables.");
    return { success: false, error: "Getgabs API key missing" };
  }

  const normalizedTo = normalizeWhatsAppNumber(to);
  if (!normalizedTo) {
    console.error("[WhatsApp Error] Invalid or missing recipient phone number:", to);
    return { success: false, error: "Invalid recipient phone number" };
  }

  // Ensure parameter text values are non-empty strings (WhatsApp API requirement)
  const sanitizedParams = (parameters || []).map((param) => {
    const textVal = param && param.text !== undefined && param.text !== null ? String(param.text).trim() : "";
    return {
      type: "text" as const,
      text: textVal || "N/A",
    };
  });

  const payload = {
    api_key: apiKey,
    sender: sender,
    campaign_id: campaignId,
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: normalizedTo,
    receiver_name: receiverName || "Customer",
    type: "template",
    template: {
      name: templateName,
      language: {
        code: "en_US",
      },
      components: [
        {
          type: "body",
          parameters: sanitizedParams,
        },
      ],
    },
  };

  try {
    console.log(`[WhatsApp] Sending template '${templateName}' to recipient: ${normalizedTo}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: any = await response.json().catch(() => ({}));

    if (
      response.ok &&
      (data.status === true || data.status === "success" || data.messages || response.status === 200) &&
      data.status !== false
    ) {
      console.log(`[WhatsApp] Template '${templateName}' sent successfully to ${normalizedTo}`);
      return { success: true, data };
    } else {
      console.error(
        `[WhatsApp Error] Failed to send template '${templateName}' to ${normalizedTo}:`,
        JSON.stringify(data)
      );
      return { success: false, error: data.message || data.msg || "API request failed", details: data };
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.error(`[WhatsApp Error] Timeout requesting Getgabs API for template '${templateName}' to ${normalizedTo}`);
      return { success: false, error: "Getgabs API timeout" };
    }
    console.error(`[WhatsApp Error] Exception sending template '${templateName}' to ${normalizedTo}:`, err.message || err);
    return { success: false, error: err.message || "Network error" };
  }
}

export interface ClientInquiryConfirmationData {
  name: string;
  phone?: string | null;
  inquiryReference?: string;
  enquiryType?: string;
}

/**
 * Sends a WhatsApp confirmation message to the client after inquiry submission.
 * Template: portfolio_enquiry_receive (2 variables)
 * {{1}} = CustomerName
 * {{2}} = EnquiryType (e.g., 'Podcast & Studio Booking')
 */
export async function sendClientInquiryConfirmation(
  data: ClientInquiryConfirmationData
): Promise<WhatsAppResult> {
  const clientPhone = data.phone;
  const customerName = data.name || "Valued Client";
  const reference = data.inquiryReference || "N/A";
  const enquiryType = data.enquiryType || "Podcast & Personal Branding";

  if (!clientPhone || !clientPhone.trim()) {
    console.log(`[WhatsApp] Client confirmation skipped for inquiry ${reference}: No mobile number provided`);
    return { success: false, error: "No mobile number provided" };
  }

  console.log(`[WhatsApp] Sending client confirmation for inquiry ${reference} to ${clientPhone}...`);

  const result = await sendWhatsAppTemplate({
    to: clientPhone,
    receiverName: customerName,
    templateName: "portfolio_enquiry_receive",
    parameters: [
      { type: "text", text: customerName },
      { type: "text", text: enquiryType },
    ],
  });

  if (result.success) {
    console.log(`[WhatsApp] Client confirmation sent successfully for inquiry ${reference}`);
  } else {
    console.warn(`[WhatsApp] Client confirmation not delivered for inquiry ${reference}:`, result.error);
  }

  return result;
}

export interface TeamInquiryNotificationData {
  name: string;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  enquiryType?: string;
  message?: string | null;
  inquiryReference?: string;
}

/**
 * Sends a WhatsApp notification to the internal GDP team regarding a new inquiry or guest proposal.
 * Template: portfolio_new_lead (6 variables)
 * {{1}} = Client name
 * {{2}} = Client phone
 * {{3}} = Business/Organization
 * {{4}} = Form type
 * {{5}} = Requirement
 * {{6}} = Message/Comments
 */
export async function sendTeamInquiryNotification(
  data: TeamInquiryNotificationData
): Promise<WhatsAppResult> {
  const teamPhone = env.GETGABS_TEAM_PHONE || "919727001838";
  const reference = data.inquiryReference || "N/A";
  const customerName = data.name || "N/A";
  const mobileNumber = data.phone || "Not provided";
  const companyName = data.company || "Individual";
  const enquiryType = data.enquiryType || "GDP Podcast Inquiry";

  const requirement =
    data.message && data.message.trim().length > 0
      ? data.message.trim().substring(0, 100)
      : `${enquiryType} Consultation`;

  const comments =
    data.message && data.message.trim().length > 0
      ? `Ref: ${reference} | Msg: ${data.message.trim().substring(0, 200)}`
      : `Ref: ${reference} (via GDP Website)`;

  console.log(`[WhatsApp] Sending team alert for inquiry ${reference} to ${teamPhone}...`);

  const result = await sendWhatsAppTemplate({
    to: teamPhone,
    receiverName: "GDP Podcast Team",
    templateName: "portfolio_new_lead",
    parameters: [
      { type: "text", text: customerName },
      { type: "text", text: mobileNumber },
      { type: "text", text: companyName },
      { type: "text", text: enquiryType },
      { type: "text", text: requirement },
      { type: "text", text: comments },
    ],
  });

  if (result.success) {
    console.log(`[WhatsApp] Team notification sent successfully for inquiry ${reference}`);
  } else {
    console.warn(`[WhatsApp] Team notification not delivered for inquiry ${reference}:`, result.error);
  }

  return result;
}
