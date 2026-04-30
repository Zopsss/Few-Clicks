import { z } from "zod";

export const IconKeySchema = z.enum([
  "home",
  "globe",
  "email",
  "linkedin",
  "x",
  "youtube",
  "github",
]);

export type IconKey = z.infer<typeof IconKeySchema>;

const SkillSchema = z.object({
  name: z.string(),
});

const NavbarItemSchema = z.object({
  href: z.string(),
  icon: IconKeySchema,
  label: z.string(),
});

const SocialEntrySchema = z.object({
  name: z.string(),
  url: z.string(),
  icon: IconKeySchema,
  navbar: z.boolean(),
});

const ContactSchema = z.object({
  email: z.string(),
  tel: z.string(),
  social: z.record(z.string(), SocialEntrySchema),
});

const WorkSchema = z.object({
  company: z.string(),
  href: z.string(),
  location: z.string(),
  title: z.string(),
  logoUrl: z.string(),
  start: z.string(),
  end: z.string(),
  description: z.string(),
});

const EducationSchema = z.object({
  school: z.string(),
  href: z.string(),
  degree: z.string(),
  logoUrl: z.string(),
  start: z.string(),
  end: z.string(),
});

const ProjectLinkSchema = z.object({
  type: z.string(),
  href: z.string(),
  icon: IconKeySchema,
});

const ProjectSchema = z.object({
  title: z.string(),
  href: z.string(),
  dates: z.string(),
  active: z.boolean(),
  description: z.string(),
  technologies: z.array(z.string()),
  links: z.array(ProjectLinkSchema),
  image: z.string(),
  video: z.string(),
});

const HackathonLinkSchema = z.object({
  title: z.string(),
  icon: IconKeySchema,
  href: z.string(),
});

const HackathonSchema = z.object({
  title: z.string(),
  dates: z.string(),
  location: z.string(),
  description: z.string(),
  image: z.string(),
  mlh: z.string().optional(),
  win: z.string().optional(),
  icon: z.string().optional(),
  links: z.array(HackathonLinkSchema),
});

export const DataSchema = z.object({
  name: z.string(),
  initials: z.string(),
  url: z.string(),
  location: z.string(),
  locationLink: z.string(),
  description: z.string(),
  summary: z.string(),
  avatarUrl: z.string(),
  skills: z.array(SkillSchema),
  navbar: z.array(NavbarItemSchema),
  contact: ContactSchema,
  work: z.array(WorkSchema),
  education: z.array(EducationSchema),
  projects: z.array(ProjectSchema),
  hackathons: z.array(HackathonSchema),
});

export type Data = z.infer<typeof DataSchema>;
