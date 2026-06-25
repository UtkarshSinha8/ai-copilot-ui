import { HeroSection } from '../components/overview/HeroSection';
import { CapabilitiesSection } from '../components/overview/CapabilitiesSection';
import { TechStackSection } from '../components/overview/TechStackSection';
import { ArchitecturePreview } from '../components/overview/ArchitecturePreview';

const OverviewPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      <HeroSection />
      <CapabilitiesSection />
      <TechStackSection />
      <ArchitecturePreview />
    </div>
  );
};

export default OverviewPage;