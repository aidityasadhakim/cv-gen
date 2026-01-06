import { cn } from '../../../lib/utils'

import type { ThemeProps } from '../../../lib/themes'

/**
 * Academic Theme
 * LaTeX-inspired layout suitable for academic, research, and technical roles
 * Uses serif typography with traditional academic CV structure
 */
export function AcademicTheme({ resume, className }: ThemeProps) {
  const {
    basics,
    work,
    education,
    skills,
    projects,
    certificates,
    awards,
    publications,
    languages,
    volunteer,
    references,
    interests,
  } = resume

  return (
    <div
      className={cn(
        'bg-white text-charcoal print:text-sm',
        className
      )}
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      {/* Header - Centered name with contact info */}
      {basics && (
        <header className="text-center mb-6 pb-4">
          <h1 className="text-3xl font-normal text-charcoal mb-4 print:text-2xl">
            {basics.name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-mid-gray">
            {basics.location && (
              <span className="flex items-center gap-1">
                <LocationIcon />
                {[basics.location.city, basics.location.countryCode]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            )}
            {basics.email && (
              <span className="flex items-center gap-1">
                <EmailIcon />
                <a href={`mailto:${basics.email}`} className="hover:text-charcoal">
                  {basics.email}
                </a>
              </span>
            )}
            {basics.phone && (
              <span className="flex items-center gap-1">
                <PhoneIcon />
                {basics.phone}
              </span>
            )}
            {basics.url && (
              <span className="flex items-center gap-1">
                <LinkIcon />
                <a href={basics.url} target="_blank" rel="noopener noreferrer" className="hover:text-charcoal">
                  {basics.url}
                </a>
              </span>
            )}
            {basics.profiles?.map((profile, i) => (
              <span key={i} className="flex items-center gap-1">
                {profile.network === 'GitHub' ? <GitHubIcon /> : <LinkIcon />}
                <a href={profile.url} target="_blank" rel="noopener noreferrer" className="hover:text-charcoal">
                  {profile.username || profile.network}
                </a>
              </span>
            ))}
          </div>
        </header>
      )}

      {/* Summary */}
      {basics?.summary && (
        <section className="mb-6">
          <p className="text-sm text-mid-gray leading-relaxed">{basics.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {work && work.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Experience</SectionHeader>
          <div className="space-y-4">
            {work.map((job, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-charcoal">{job.position}</span>
                  <span className="text-sm text-mid-gray italic whitespace-nowrap">
                    {formatDateRange(job.startDate, job.endDate)}
                  </span>
                </div>
                <div className="text-sm text-mid-gray italic mb-1">{job.name}</div>
                {job.summary && (
                  <p className="text-sm text-mid-gray mb-1">{job.summary}</p>
                )}
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-5 text-sm text-mid-gray space-y-0.5">
                    {job.highlights.map((highlight, j) => (
                      <li key={j}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Projects</SectionHeader>
          <div className="space-y-4">
            {projects.map((project, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-charcoal">{project.name}</span>
                  {(project.startDate || project.endDate) && (
                    <span className="text-sm text-mid-gray italic whitespace-nowrap">
                      {formatDateRange(project.startDate, project.endDate)}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-mid-gray mb-1">{project.description}</p>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-5 text-sm text-mid-gray space-y-0.5">
                    {project.highlights.map((highlight, j) => (
                      <li key={j}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Education</SectionHeader>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-charcoal">{edu.institution}</span>
                  <span className="text-sm text-mid-gray italic whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </span>
                </div>
                <div className="text-sm text-mid-gray italic">
                  {edu.studyType}
                  {edu.area && ` in ${edu.area}`}
                  {edu.score && ` (GPA: ${edu.score})`}
                </div>
                {edu.courses && edu.courses.length > 0 && (
                  <p className="text-sm text-mid-gray mt-1">
                    Courses: {edu.courses.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {awards && awards.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Awards</SectionHeader>
          <div className="space-y-3">
            {awards.map((award, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-charcoal">{award.title}</span>
                  {award.date && (
                    <span className="text-sm text-mid-gray italic">{formatDate(award.date)}</span>
                  )}
                </div>
                <div className="text-sm text-mid-gray italic">{award.awarder}</div>
                {award.summary && (
                  <p className="text-sm text-mid-gray mt-1">{award.summary}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {publications && publications.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Publications</SectionHeader>
          <div className="space-y-3">
            {publications.map((pub, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-charcoal">{pub.name}</span>
                  {pub.releaseDate && (
                    <span className="text-sm text-mid-gray italic">
                      {formatDate(pub.releaseDate)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-mid-gray italic">{pub.publisher}</div>
                {pub.summary && (
                  <p className="text-sm text-mid-gray mt-1">{pub.summary}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates && certificates.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Certificates</SectionHeader>
          <div className="space-y-2">
            {certificates.map((cert, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-charcoal">{cert.name}</span>
                  {cert.date && (
                    <span className="text-sm text-mid-gray italic">{formatDate(cert.date)}</span>
                  )}
                </div>
                <div className="text-sm text-mid-gray italic">{cert.issuer}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer */}
      {volunteer && volunteer.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Volunteer</SectionHeader>
          <div className="space-y-3">
            {volunteer.map((vol, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-charcoal">{vol.position}</span>
                  <span className="text-sm text-mid-gray italic whitespace-nowrap">
                    {formatDateRange(vol.startDate, vol.endDate)}
                  </span>
                </div>
                <div className="text-sm text-mid-gray italic">{vol.organization}</div>
                {vol.summary && (
                  <p className="text-sm text-mid-gray mt-1">{vol.summary}</p>
                )}
                {vol.highlights && vol.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-5 text-sm text-mid-gray space-y-0.5">
                    {vol.highlights.map((highlight, j) => (
                      <li key={j}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Languages</SectionHeader>
          <div className="space-y-1">
            {languages.map((lang, i) => (
              <div key={i} className="flex items-baseline">
                <span className="font-semibold text-charcoal text-sm">{lang.language}:</span>
                <span className="text-sm text-mid-gray ml-2">{lang.fluency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Skills</SectionHeader>
          <div className="space-y-1">
            {skills.map((skill, i) => (
              <div key={i} className="flex items-baseline">
                <span className="font-semibold text-charcoal text-sm">{skill.name}:</span>
                <span className="text-sm text-mid-gray ml-2">
                  {skill.keywords?.join(', ') || skill.level}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      {interests && interests.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Interests</SectionHeader>
          <div className="space-y-1">
            {interests.map((interest, i) => (
              <div key={i} className="flex items-baseline">
                <span className="font-semibold text-charcoal text-sm">{interest.name}:</span>
                <span className="text-sm text-mid-gray ml-2">
                  {interest.keywords?.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {references && references.length > 0 && (
        <section className="mb-6">
          <SectionHeader>References</SectionHeader>
          <div className="space-y-4">
            {references.map((ref, i) => (
              <div key={i}>
                <div className="font-semibold text-charcoal text-sm mb-1">{ref.name}</div>
                {ref.reference && (
                  <p className="text-sm text-mid-gray italic">"{ref.reference}"</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Section header component with academic styling
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h2 className="text-lg font-semibold text-charcoal mb-1 print:text-base">
        {children}
      </h2>
      <hr className="border-t border-charcoal mb-3" />
    </>
  )
}

// Helper functions
function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

function formatDateRange(startDate?: string, endDate?: string): string {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'Present'
  if (!start && !endDate) return ''
  return `${start} \u2014 ${end}`
}

// Icon components (small, academic style)
function LocationIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 288 512">
      <path d="M112 316.94v156.69l22.02 33.02c4.75 7.12 15.22 7.12 19.97 0L176 473.63V316.94c-10.39 1.92-21.06 3.06-32 3.06s-21.61-1.14-32-3.06zM144 0C64.47 0 0 64.47 0 144s64.47 144 144 144 144-64.47 144-144S223.53 0 144 0zm0 76c-37.5 0-68 30.5-68 68 0 6.62-5.38 12-12 12s-12-5.38-12-12c0-50.73 41.28-92 92-92 6.62 0 12 5.38 12 12s-5.38 12-12 12z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 512 512">
      <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 512 512">
      <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 512 512">
      <path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 496 512">
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
    </svg>
  )
}
