import { Hero } from './hero';
import { Features } from './features';
import { Rankings } from './rankings';
import { Community } from './community';
import { About } from './about';
import { BentoGrid } from './bento-grid';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <BentoGrid />
      <Rankings />
      <Community />
      <About />
    </>
  );
}