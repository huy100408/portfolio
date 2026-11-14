import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { GitHub } from "@/components/sections/GitHub";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { achievements } from "@/config/achievements";
import { education } from "@/config/education";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  // Education and Achievements are hidden on the live site while empty, so number the sections after them dynamically.
  const dev = process.env.NODE_ENV === "development";
  let n = 5;
  const eduIndex = education.length || dev ? pad(++n) : "";
  const achIndex = achievements.length || dev ? pad(++n) : "";
  const contactIndex = pad(++n);

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <GitHub index="04" />
      <Journey index="05" />
      <Education index={eduIndex} />
      <Achievements index={achIndex} />
      <Contact index={contactIndex} />
    </>
  );
}
