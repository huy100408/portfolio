import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { GitHub } from "@/components/sections/GitHub";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Origin } from "@/components/sections/Origin";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Soundtrack } from "@/components/sections/Soundtrack";

export default function Home() {
  return (
    <>
      <Hero />
      <Origin />
      <About />
      <Soundtrack />
      <Skills />
      <Projects />
      <GitHub />
      <Journey />
      <Education />
      <Achievements />
      <Contact />
    </>
  );
}
