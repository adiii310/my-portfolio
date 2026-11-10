import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { HowBuilt } from "@/components/sections/how-built";
import { Contact } from "@/components/sections/contact";

/**
 * Server component. Each section is its own client island only where it needs
 * to be, so this page itself contributes no JavaScript to the bundle.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Marquee baseSpeed={34} />
      <HowBuilt />
      <Contact />
    </>
  );
}
