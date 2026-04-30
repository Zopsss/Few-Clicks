import { type ComponentType } from "react";

import { AboutEditor } from "./sections/about-editor";
import { ComingSoonEditor } from "./sections/coming-soon-editor";
import { EducationEditor } from "./sections/education-editor";
import { HeroEditor } from "./sections/hero-editor";
import { SkillsEditor } from "./sections/skills-editor";
import { WorkEditor } from "./sections/work-editor";

export type SectionId =
  | "navbar"
  | "hero"
  | "about"
  | "work"
  | "education"
  | "skills"
  | "projects"
  | "hackathons"
  | "contact";

export interface Section {
  id: SectionId;
  label: string;
  Editor: ComponentType;
}

export const SECTIONS: Section[] = [
  { id: "navbar", label: "Navbar", Editor: ComingSoonEditor },
  { id: "hero", label: "Hero", Editor: HeroEditor },
  { id: "about", label: "About", Editor: AboutEditor },
  { id: "work", label: "Work Experience", Editor: WorkEditor },
  { id: "education", label: "Education", Editor: EducationEditor },
  { id: "skills", label: "Skills", Editor: SkillsEditor },
  { id: "projects", label: "Projects", Editor: ComingSoonEditor },
  { id: "hackathons", label: "Hackathons", Editor: ComingSoonEditor },
  { id: "contact", label: "Contact", Editor: ComingSoonEditor },
];
