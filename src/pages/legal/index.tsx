import { Card, Collapse, Space, Typography } from "antd";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function LegalPage() {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: isMobile ? 16 : 0,
      }}
    >
      <Space direction="vertical" size={14} style={{ width: "100%" }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Legal
        </Typography.Title>

        <Card size="small" title="FAQ">
          <Collapse
            accordion
            items={[
              {
                key: "what-is",
                label: "What is the Ahangama Pass?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    The Ahangama Pass is a digital savings pass that gives you
                    exclusive perks and discounts at curated cafés, stays,
                    experiences, wellness spots, and surf partners across
                    Ahangama.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "how-it-works",
                label: "How does it work?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Purchase your pass online, receive instant access
                    (Apple/Google Wallet compatible where available), and show
                    your pass at participating venues to redeem your perk.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "validity",
                label: "How long is the pass valid?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Each pass is valid for the duration stated at purchase (e.g.
                    15 days). The validity starts from the date of activation.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "where-use",
                label: "Where can I use it?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    You can use the pass at participating venues listed on
                    ahangama.com. Only venues marked as pass partners are
                    eligible.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "redeem",
                label: "How do I redeem an offer?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Simply present your active digital pass before payment. Each
                    venue’s specific perk is outlined on its listing page.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "multiple-times",
                label: "Can I use the same offer multiple times?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    This depends on the venue. Some offers are once per visit;
                    others may be limited to once per pass duration. Check the
                    venue listing for details.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "transferable",
                label: "Is the pass transferable?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    No. The pass is personal and linked to the purchaser.
                    Sharing or duplicating the pass may result in cancellation.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "venue-refuses",
                label: "What if a venue refuses the discount?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Politely show your active pass and ensure the offer is still
                    valid. If issues persist, contact our support team with the
                    venue name and time of visit.
                  </Typography.Paragraph>
                ),
              },
            ]}
          />
        </Card>

        <Card size="small" title="Refund Policy">
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <div>
              <Typography.Text strong>Digital Product Policy</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                The Ahangama Pass is a digital product. Once purchased and
                activated, it is considered used.
              </Typography.Paragraph>
            </div>

            <div>
              <Typography.Text strong>Refund Eligibility</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 8 }}>
                Refunds may be considered only if:
              </Typography.Paragraph>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>A technical error prevented access to the pass.</li>
                <li>A duplicate charge occurred.</li>
                <li>The pass was purchased but never activated.</li>
              </ul>
            </div>

            <div>
              <Typography.Text strong>Non-Refundable Cases</Typography.Text>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Change of travel plans.</li>
                <li>Not using the pass during your stay.</li>
                <li>Dissatisfaction with specific venue experiences.</li>
                <li>Misunderstanding of individual venue terms.</li>
              </ul>
            </div>

            <div>
              <Typography.Text strong>How to Request a Refund</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 8 }}>
                Email support within 7 days of purchase with:
              </Typography.Paragraph>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Your order confirmation</li>
                <li>Date of purchase</li>
                <li>Reason for refund request</li>
              </ul>
            </div>

            <Typography.Paragraph style={{ marginBottom: 0 }}>
              All approved refunds will be processed back to the original
              payment method.
            </Typography.Paragraph>
          </Space>
        </Card>

        <Card size="small" title="Terms">
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <div>
              <Typography.Text strong>1. Use of the Pass</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                The Ahangama Pass grants access to listed perks at participating
                venues only during the validity period.
              </Typography.Paragraph>
            </div>

            <div>
              <Typography.Text strong>2. Venue Participation</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                Venues may change, suspend, or modify offers at any time. We aim
                to keep listings accurate but cannot guarantee uninterrupted
                participation.
              </Typography.Paragraph>
            </div>

            <div>
              <Typography.Text strong>3. Conduct</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                Pass holders must behave respectfully at all partner venues.
                Misuse, fraud, or disruptive behavior may result in cancellation
                without refund.
              </Typography.Paragraph>
            </div>

            <div>
              <Typography.Text strong>4. Liability</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 8 }}>
                Ahangama Pass is not responsible for:
              </Typography.Paragraph>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Quality of service provided by venues</li>
                <li>Personal injury or loss at partner locations</li>
                <li>Independent decisions made by venue operators</li>
              </ul>
            </div>

            <div>
              <Typography.Text strong>5. Modifications</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                We reserve the right to update pricing, offers, and terms at any
                time.
              </Typography.Paragraph>
            </div>
          </Space>
        </Card>

        <Card size="small" title="Privacy">
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <div>
              <Typography.Text strong>Information We Collect</Typography.Text>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Name and email address</li>
                <li>Payment confirmation details</li>
                <li>Device/browser data for analytics</li>
                <li>Optional WhatsApp contact interactions</li>
              </ul>
            </div>

            <div>
              <Typography.Text strong>How We Use Your Data</Typography.Text>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>To deliver and manage your pass</li>
                <li>To process payments securely</li>
                <li>To improve the website experience</li>
                <li>To communicate important updates</li>
              </ul>
            </div>

            <div>
              <Typography.Text strong>Payments</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                Payments are processed securely via Stripe. We do not store full
                credit card information.
              </Typography.Paragraph>
            </div>

            <div>
              <Typography.Text strong>Data Sharing</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                We do not sell personal data. Limited data may be shared with
                trusted service providers strictly for operational purposes.
              </Typography.Paragraph>
            </div>

            <div>
              <Typography.Text strong>Cookies & Analytics</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                We use analytics tools to understand website usage and improve
                performance. You may disable cookies in your browser settings.
              </Typography.Paragraph>
            </div>

            <div>
              <Typography.Text strong>Your Rights</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                You may request access, correction, or deletion of your personal
                data by contacting us.
              </Typography.Paragraph>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
