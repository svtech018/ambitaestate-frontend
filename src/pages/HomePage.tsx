import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturedProperties from '../components/FeaturedProperties';
import ReviewsSection from '../components/ReviewsSection';
import ContactForm from '../components/ContactForm';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <FeaturedProperties />
      <ReviewsSection />
      <ContactForm />
    </main>
  );
}
