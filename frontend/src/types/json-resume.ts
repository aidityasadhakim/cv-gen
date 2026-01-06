/**
 * JSON Resume TypeScript Types
 * Based on: https://jsonresume.org/schema/
 */

export interface JSONResume {
  basics?: Basics
  work?: Work[]
  volunteer?: Volunteer[]
  education?: Education[]
  awards?: Award[]
  certificates?: Certificate[]
  publications?: Publication[]
  skills?: Skill[]
  languages?: Language[]
  interests?: Interest[]
  references?: Reference[]
  projects?: Project[]
}

export interface Basics {
  name: string
  label?: string
  image?: string
  email: string
  phone?: string
  url?: string
  summary?: string
  location?: Location
  profiles?: Profile[]
}

export interface Location {
  address?: string
  postalCode?: string
  city?: string
  countryCode?: string
  region?: string
}

export interface Profile {
  network?: string
  username?: string
  url?: string
}

export interface Work {
  name?: string
  position?: string
  url?: string
  startDate?: string
  endDate?: string
  summary?: string
  highlights?: string[]
  location?: string
}

export interface Volunteer {
  organization?: string
  position?: string
  url?: string
  startDate?: string
  endDate?: string
  summary?: string
  highlights?: string[]
}

export interface Education {
  institution?: string
  url?: string
  area?: string
  studyType?: string
  startDate?: string
  endDate?: string
  score?: string
  courses?: string[]
}

export interface Award {
  title?: string
  date?: string
  awarder?: string
  summary?: string
}

export interface Certificate {
  name?: string
  date?: string
  issuer?: string
  url?: string
}

export interface Publication {
  name?: string
  publisher?: string
  releaseDate?: string
  url?: string
  summary?: string
}

export interface Skill {
  name?: string
  level?: string
  keywords?: string[]
}

export interface Language {
  language?: string
  fluency?: string
}

export interface Interest {
  name?: string
  keywords?: string[]
}

export interface Reference {
  name?: string
  reference?: string
}

export interface Project {
  name?: string
  description?: string
  highlights?: string[]
  keywords?: string[]
  startDate?: string
  endDate?: string
  url?: string
  roles?: string[]
  entity?: string
  type?: string
}

// API Response types
export interface ProfileResponse {
  id?: string
  user_id: string
  resume_data: JSONResume
  created_at?: string
  updated_at?: string
}

// Helper to create empty JSON Resume
export function createEmptyJSONResume(): JSONResume {
  return {
    basics: {
      name: '',
      email: '',
      label: '',
      phone: '',
      url: '',
      summary: '',
      location: {
        address: '',
        postalCode: '',
        city: '',
        countryCode: '',
        region: '',
      },
      profiles: [],
    },
    work: [],
    volunteer: [],
    education: [],
    awards: [],
    certificates: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    references: [],
    projects: [],
  }
}

// Section names for navigation
export const RESUME_SECTIONS = [
  { id: 'basics', label: 'Basic Info', icon: 'user' },
  { id: 'work', label: 'Work Experience', icon: 'briefcase' },
  { id: 'education', label: 'Education', icon: 'academic-cap' },
  { id: 'skills', label: 'Skills', icon: 'sparkles' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'certificates', label: 'Certificates', icon: 'badge-check' },
  { id: 'awards', label: 'Awards', icon: 'trophy' },
  { id: 'publications', label: 'Publications', icon: 'book-open' },
  { id: 'languages', label: 'Languages', icon: 'globe' },
  { id: 'volunteer', label: 'Volunteer', icon: 'heart' },
  { id: 'interests', label: 'Interests', icon: 'star' },
  { id: 'references', label: 'References', icon: 'users' },
] as const

export type ResumeSectionId = (typeof RESUME_SECTIONS)[number]['id']

// Helper to check if a section has content
export function sectionHasContent(
  resume: JSONResume,
  section: ResumeSectionId
): boolean {
  switch (section) {
    case 'basics':
      return !!(resume.basics?.name || resume.basics?.email)
    case 'work':
      return (resume.work?.length ?? 0) > 0
    case 'education':
      return (resume.education?.length ?? 0) > 0
    case 'skills':
      return (resume.skills?.length ?? 0) > 0
    case 'projects':
      return (resume.projects?.length ?? 0) > 0
    case 'certificates':
      return (resume.certificates?.length ?? 0) > 0
    case 'awards':
      return (resume.awards?.length ?? 0) > 0
    case 'publications':
      return (resume.publications?.length ?? 0) > 0
    case 'languages':
      return (resume.languages?.length ?? 0) > 0
    case 'volunteer':
      return (resume.volunteer?.length ?? 0) > 0
    case 'interests':
      return (resume.interests?.length ?? 0) > 0
    case 'references':
      return (resume.references?.length ?? 0) > 0
    default:
      return false
  }
}

// Calculate profile completion percentage
export function calculateProfileCompletion(resume: JSONResume): number {
  const sections = RESUME_SECTIONS.map((s) => s.id)
  const completedSections = sections.filter((section) =>
    sectionHasContent(resume, section)
  )
  return Math.round((completedSections.length / sections.length) * 100)
}
