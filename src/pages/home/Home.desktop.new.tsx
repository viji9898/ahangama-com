import { useEffect } from "react";
import styles from "./Home.desktop.new.module.css";
import { NewHomeExampleSavingsSection } from "../../components/home-new/NewHomeExampleSavingsSection";
import { NewHomeFinalCtaSection } from "../../components/home-new/NewHomeFinalCtaSection";
import { NewHomeFooterSection } from "../../components/home-new/NewHomeFooterSection";
import { NewHomeHeroSection } from "../../components/home-new/NewHomeHeroSection";
import { NewHomeHowItWorksSection } from "../../components/home-new/NewHomeHowItWorksSection";
import { NewHomeLockedMapPreviewSection } from "../../components/home-new/NewHomeLockedMapPreviewSection";
import { NewHomePassFeaturesSection } from "../../components/home-new/NewHomePassFeaturesSection";
import { NewHomeSocialProofStripSection } from "../../components/home-new/NewHomeSocialProofStripSection";
import { NewHomeTestimonialsSection } from "../../components/home-new/NewHomeTestimonialsSection";
import { NewHomeVenueTrustSection } from "../../components/home-new/NewHomeVenueTrustSection";

export default function HomeDesktopNew() {
  useEffect(() => {
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <NewHomeHeroSection />
        <NewHomeSocialProofStripSection />
        <NewHomeHowItWorksSection />
        <NewHomeExampleSavingsSection />
        <NewHomeVenueTrustSection />
        <NewHomeLockedMapPreviewSection />
        <NewHomePassFeaturesSection />
        <NewHomeTestimonialsSection />
        <NewHomeFinalCtaSection />
        <NewHomeFooterSection />
      </div>
    </div>
  );
}