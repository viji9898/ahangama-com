import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const testimonials = [
  {
    name: "Maya",
    meta: "Australia",
    quote: "Saved $92 in 10 days — paid for itself quickly.",
  },
  {
    name: "Jonas",
    meta: "Germany",
    quote: "Super easy to use, almost every place accepted it.",
  },
  {
    name: "Ella",
    meta: "UK",
    quote:
      "We used it on coffee, stays, and scooters within the first few days.",
  },
];

export function NewHomeTestimonialsSection() {
  return (
    <section
      id="testimonials"
      className={styles.section}
      aria-label="Testimonials"
    >
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Testimonials</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          Travellers said it paid back fast
        </Typography.Title>
      </div>

      <div className={styles.sectionPanel}>
        <Row gutter={[20, 20]} className={styles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <Col key={testimonial.name} xs={24} md={8}>
              <div className={styles.testimonialCard}>
                <div className={styles.testimonialHeader}>
                  <div className={styles.avatarCircle} aria-hidden="true">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.testimonialAuthor}>
                      {testimonial.name}
                    </div>
                    <p className={styles.testimonialMeta}>{testimonial.meta}</p>
                  </div>
                </div>
                <Typography.Paragraph className={styles.testimonialText}>
                  “{testimonial.quote}”
                </Typography.Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
