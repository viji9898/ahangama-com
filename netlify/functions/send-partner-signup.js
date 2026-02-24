const sgMail = require("@sendgrid/mail");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const formData = JSON.parse(event.body || "{}");

    // Input validation
    if (!formData.venueName || !formData.email || !formData.contactName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: venueName, email, contactName",
        }),
      };
    }

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Create email content for admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2>🤝 New Partner Sign-Up - ${formData.venueName}</h2>
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #1890ff;">✅ VENUE NOW LIVE AS PARTNER</strong>
        </div>
        
        <h3>📍 Venue Details</h3>
        <p><strong>Venue Name:</strong> ${formData.venueName}</p>
        <p><strong>Venue Type:</strong> ${
          formData.venueType || "Not specified"
        }</p>
        <p><strong>Location:</strong> ${
          formData.location || "Not specified"
        }</p>
        ${
          formData.otherVenueType
            ? `<p><strong>Other Type:</strong> ${formData.otherVenueType}</p>`
            : ""
        }
        
        <h3>👤 Contact Information</h3>
        <p><strong>Contact Name:</strong> ${formData.contactName}</p>
        <p><strong>Role:</strong> ${formData.contactRole}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Primary Contact:</strong> ${formData.phone}</p>
        ${
          formData.instagram
            ? `<p><strong>Instagram:</strong> ${formData.instagram}</p>`
            : ""
        }
        ${
          formData.website
            ? `<p><strong>Website:</strong> ${formData.website}</p>`
            : ""
        }
        
        <h3>🎁 Customer Offer</h3>
        ${
          formData.offerType
            ? `<p><strong>Offer Type:</strong> ${JSON.stringify(
                formData.offerType,
              )}</p>`
            : ""
        }
        ${
          formData.offerDescription
            ? `<p><strong>Offer Description:</strong> ${formData.offerDescription}</p>`
            : ""
        }
        ${
          formData.offerAppliesTo
            ? `<p><strong>Applies To:</strong> ${JSON.stringify(
                formData.offerAppliesTo,
              )}</p>`
            : ""
        }
        
        <h3>🔄 Guest Redemption Process</h3>
        <p><strong>Redemption Info:</strong> Partner has been informed about how guests can redeem offers (show pass, mention at booking, QR verification, staff verification)</p>
        
        <h3>📢 Marketing</h3>
        ${
          formData.marketingNotes
            ? `<p><strong>Marketing Notes:</strong> ${formData.marketingNotes}</p>`
            : ""
        }
        
        <h3>✅ Agreements</h3>
        <p><strong>Agreed to Terms:</strong> ${
          formData.agreeToTerms ? "Yes" : "No"
        }</p>
        <p><strong>Marketing Consent:</strong> ${
          formData.agreeToMarketing ? "Yes" : "No"
        }</p>
        
        <hr>
        <p><small>Application submitted on: ${new Date().toLocaleString()}</small></p>
      </div>
    `;

    // Create email content for partner
    const partnerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1>🎉 Welcome to the Ahangama Pass Partner Network</h1>
        
        <p>Dear ${formData.venueName || formData.contactName},</p>
        
        <p>Thank you for signing up to the <strong>Ahangama Pass Partner Program</strong>.<br>
        Your venue is now <strong>live as an Ahangama Pass partner</strong>, and we're excited to have you on board.</p>
        
        <p>By submitting the partner form, you've confirmed your participation and agreement to the program terms outlined below.</p>
        
        <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
        
        <h2>What This Means</h2>
        
        <p>Your venue will be featured across <strong>Ahangama.com</strong> and our visitor touchpoints, giving you increased visibility among local and international travellers who actively seek trusted places to eat, stay, and experience Ahangama.</p>
        
        <p>You'll also be part of our growing community of Ahangama Pass holders, who are encouraged to support partner venues during their stay.</p>
        
        <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
        
        <h2>Partner Terms (Summary)</h2>
        
        <p>By joining the Ahangama Pass, you agree to the following:</p>
        
        <h3>1. Participation</h3>
        
        <p>Your venue may participate under one or more of the following:</p>
        
        <ul>
          <li>Food & Beverage</li>
          <li>Accommodation (direct bookings only)</li>
          <li>Experiences / Wellness / Retail</li>
        </ul>
        
        <h3>2. Customer Offers</h3>
        
        <p>You agree to honour the offer(s) submitted via your form, such as:</p>
        
        <ul>
          <li>Percentage discount (e.g. 10% off total bill or room rate)</li>
          <li>Fixed offers or complimentary items</li>
          <li>Optional stay enhancements (subject to availability)</li>
        </ul>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #d9d9d9;">
          <h4>Your Specific Offer Details:</h4>
          ${
            formData.offerType
              ? `<p><strong>Offer Type:</strong> ${
                  Array.isArray(formData.offerType)
                    ? formData.offerType.join(", ")
                    : formData.offerType
                }</p>`
              : ""
          }
          ${
            formData.offerDescription
              ? `<p><strong>Offer Description:</strong> ${formData.offerDescription}</p>`
              : ""
          }
          ${
            formData.offerAppliesTo
              ? `<p><strong>Applies To:</strong> ${
                  Array.isArray(formData.offerAppliesTo)
                    ? formData.offerAppliesTo.join(", ")
                    : formData.offerAppliesTo
                }</p>`
              : ""
          }
        </div>
        
        <p><strong>Conditions</strong></p>
        
        <ul>
          <li>Guests must present the Ahangama Pass <strong>before payment</strong></li>
          <li>Offers cannot be applied after payment</li>
          <li>Accommodation discounts apply to <strong>direct bookings only</strong></li>
          <li>OTA bookings are excluded</li>
          <li>Direct booking rates must not exceed OTA rates for the same dates</li>
        </ul>
        
        <h3>3. How Guests Claim</h3>
        
        <p>Guests may claim offers by:</p>
        
        <ul>
          <li>Showing their Ahangama Pass at the venue</li>
          <li>Mentioning the Ahangama Pass when booking directly</li>
          <li>QR or staff verification where applicable</li>
        </ul>
        
        <h3>4. Venue Branding</h3>
        
        <p>You agree to display minimal, tasteful Ahangama Pass branding, such as:</p>
        
        <ul>
          <li>A small sticker at the counter or entrance</li>
          <li>A QR card at the cashier or reception</li>
          <li>A digital mention where appropriate</li>
        </ul>
        
        <p>All branding is designed to remain subtle and aligned with your venue's aesthetic.</p>
        
        <h3>5. Commercial Terms</h3>
        
        <ul>
          <li><strong>No fees</strong></li>
          <li><strong>No commissions</strong></li>
          <li><strong>Non-exclusive partnership</strong></li>
        </ul>
        
        <h3>6. Termination</h3>
        
        <ul>
          <li>Either party may terminate with <strong>30 days written notice</strong></li>
          <li>No penalties or ongoing obligations upon termination</li>
        </ul>
        
        <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
        
        <h2>Partner Support</h2>
        
        <p>If you need anything at all — updates, offer changes, marketing materials, or staff guidance — our partner support team is available on WhatsApp:</p>
        
        <p>📱 <strong>Partner Support (WhatsApp): +94 77 790 8790</strong></p>
        
        <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p>We're looking forward to driving thoughtful, high-quality visitors your way and building something valuable for Ahangama together.</p>
        
        <p>Warm regards,<br>
        <strong>The Ahangama Pass Team</strong><br>
        Ahangama.com</p>
      </div>
    `;

    // Send email to admin
    await sgMail.send({
      to: "team@ahangama.com",
      from: "hello@ahangama.com",
      subject: `${formData.venueName} Partnership Sign Up`,
      html: adminEmailContent,
    });

    // Send confirmation email to partner
    await sgMail.send({
      to: formData.email,
      from: "hello@ahangama.com",
      subject: `Partnership Application Received - ${formData.venueName}`,
      html: partnerEmailContent,
    });

    console.log(
      `Partnership application emails sent successfully for ${formData.venueName}`,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Partnership application submitted successfully",
      }),
    };
  } catch (error) {
    console.error("Error sending partnership application emails:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to submit partnership application",
        details: error.message,
      }),
    };
  }
};
