import styles from "../../pages/home/Home.desktop.new.module.css";
import { FooterDesktop } from "../desktop/Footer.Desktop";

export function NewHomeFooterSection() {
  return (
    <section className={styles.footerWrap} aria-label="Footer">
      <FooterDesktop />
    </section>
  );
}