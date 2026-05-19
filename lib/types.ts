export interface CVExperience {
  company: string;
  role: string;
  date: string;
  bullets: string[];
}

export interface CVEducation {
  institution: string;
  degree: string;
  date: string;
}

export interface CVData {
  name: string;
  title: string;
  summary: string[];
  experience: CVExperience[];
  skills: string[];
  technicalSkills: string[];
  education: CVEducation[];
  certifications: string[];
  languages: string[];
  portfolio?: string;
}
