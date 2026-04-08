import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const testimonials = [
  {
    name: "Leah",
    meta: "Remote worker, 5 nights",
    quote: "The pass made the town feel immediately navigable. I did not have to figure everything out from scratch.",
  },
  {
    name: "Tom",
    meta: "Couple trip, 3 nights",
    quote: "What worked best was the clarity. It felt like a curated layer on top of the destination, not another tourist product.",
  },
  {
    name: "Mina",
    meta: "Solo traveller, 1 week",
    quote: "Good structure for the homepage. Trust first, useful examples second, then the call to act without pressure.",
  },
];

export function NewHomeTestimonialsSection() {
  return (
    <section id="testimonials" className={styles.section} aria-label="Testimonials">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Testimonials</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          Social proof should feel editorial, not noisy.
        </Typography.Title>
        <Typography.Paragraph className={styles.sectionDescription}>
          These are placeholders for tone and spacing. Real quotes can be added
          later once the final customer stories are approved.
        </Typography.Paragraph>
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
                    <div className={styles.testimonialAuthor}>{testimonial.name}</div>
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