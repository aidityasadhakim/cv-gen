import { cn } from '../../../lib/utils'

import type { ThemeProps } from '../../../lib/themes'

/**
 * Minimal Theme
 * Simple, content-focused layout with maximum readability
 */
export function MinimalTheme({ resume, className }: ThemeProps) {
  const { basics, work, education, skills, projects, certificates, awards, publications, languages, volunteer, references } = resume

  return (
    <div className={cn('bg-white text-charcoal font-sans print:text-sm', className)}>
      {/* Header */}
      {basics && (
        <header className="text-center mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-2xl font-light tracking-wide text-charcoal uppercase print:text-xl">
            {basics.name || 'Your Name'}
          </h1>
          {basics.label && (
            <p className="text-sm text-mid-gray mt-1 tracking-wide">{basics.label}</p>
          )}
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs text-mid-gray">
            {basics.email && <span>{basics.email}</span>}
            {basics.email && basics.phone && <span>|</span>}
            {basics.phone && <span>{basics.phone}</span>}
            {(basics.email || basics.phone) && basics.location?.city && <span>|</span>}
            {basics.location && (
              <span>
                {[basics.location.city, basics.location.region]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            )}
          </div>
          {basics.url && (
            <a href={basics.url} className="text-xs text-mid-gray hover:text-charcoal block mt-1">
              {basics.url}
            </a>
          )}
          {basics.profiles && basics.profiles.length > 0 && (
            <div className="flex justify-center gap-4 mt-2">
              {basics.profiles.map((profile, i) => (
                <a
                  key={i}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-mid-gray hover:text-charcoal"
                >
                  {profile.network}
                </a>
              ))}
            </div>
          )}
        </header>
      )}

      {/* Summary */}
      {basics?.summary && (
        <section className="mb-6 text-center max-w-2xl mx-auto">
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
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-charcoal">
                    {job.position}{job.name && <span className="font-normal text-mid-gray"> — {job.name}</span>}
                  </h3>
                  <span className="text-xs text-mid-gray">
                    {formatDateRange(job.startDate, job.endDate)}
                  </span>
                </div>
                {job.summary && (
                  <p className="text-sm text-mid-gray mt-1">{job.summary}</p>
                )}
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="mt-1 text-sm text-mid-gray space-y-0.5">
                    {job.highlights.map((highlight, j) => (
                      <li key={j}>— {highlight}</li>
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
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="font-medium text-charcoal">
                    {edu.studyType} {edu.area && `in ${edu.area}`}
                  </span>
                  <span className="text-mid-gray"> — {edu.institution}</span>
                  {edu.score && <span className="text-sm text-mid-gray ml-2">({edu.score})</span>}
                </div>
                <span className="text-xs text-mid-gray">
                  {formatDateRange(edu.startDate, edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Skills</SectionHeader>
          <div className="text-sm text-mid-gray">
            {skills.map((skill, i) => (
              <span key={i}>
                <span className="font-medium text-charcoal">{skill.name}</span>
                {skill.keywords && skill.keywords.length > 0 && (
                  <span> ({skill.keywords.join(', ')})</span>
                )}
                {i < skills.length - 1 && <span className="mx-2">•</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Projects</SectionHeader>
          <div className="space-y-3">
            {projects.map((project, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-charcoal">{project.name}</h3>
                  {(project.startDate || project.endDate) && (
                    <span className="text-xs text-mid-gray">
                      {formatDateRange(project.startDate, project.endDate)}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-mid-gray">{project.description}</p>
                )}
                {project.keywords && project.keywords.length > 0 && (
                  <p className="text-xs text-mid-gray mt-0.5">
                    {project.keywords.join(' · ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Certificates side by side */}
      <div className="grid grid-cols-2 gap-6 mb-6 print:grid-cols-2">
        {/* Languages */}
        {languages && languages.length > 0 && (
          <section>
            <SectionHeader>Languages</SectionHeader>
            <div className="text-sm">
              {languages.map((lang, i) => (
                <span key={i} className="text-mid-gray">
                  <span className="text-charcoal">{lang.language}</span>
                  {lang.fluency && ` (${lang.fluency})`}
                  {i < languages.length - 1 && ', '}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {certificates && certificates.length > 0 && (
          <section>
            <SectionHeader>Certificates</SectionHeader>
            <div className="space-y-1 text-sm">
              {certificates.map((cert, i) => (
                <div key={i} className="text-mid-gray">
                  <span className="text-charcoal">{cert.name}</span>
                  {cert.issuer && ` — ${cert.issuer}`}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Awards */}
      {awards && awards.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Awards</SectionHeader>
          <div className="space-y-1 text-sm">
            {awards.map((award, i) => (
              <div key={i} className="text-mid-gray">
                <span className="text-charcoal">{award.title}</span>
                {award.awarder && ` — ${award.awarder}`}
                {award.date && ` (${formatDate(award.date)})`}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {publications && publications.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Publications</SectionHeader>
          <div className="space-y-1 text-sm">
            {publications.map((pub, i) => (
              <div key={i} className="text-mid-gray">
                <span className="text-charcoal">{pub.name}</span>
                {pub.publisher && ` — ${pub.publisher}`}
                {pub.releaseDate && ` (${formatDate(pub.releaseDate)})`}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer */}
      {volunteer && volunteer.length > 0 && (
        <section className="mb-6">
          <SectionHeader>Volunteer</SectionHeader>
          <div className="space-y-2">
            {volunteer.map((vol, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div className="text-sm">
                  <span className="font-medium text-charcoal">{vol.position}</span>
                  <span className="text-mid-gray"> — {vol.organization}</span>
                </div>
                <span className="text-xs text-mid-gray">
                  {formatDateRange(vol.startDate, vol.endDate)}
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
          <div className="space-y-2 text-sm">
            {references.map((ref, i) => (
              <div key={i}>
                <span className="font-medium text-charcoal">{ref.name}</span>
                {ref.reference && (
                  <p className="text-mid-gray italic text-xs mt-0.5">"{ref.reference}"</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Section header component
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium text-mid-gray uppercase tracking-widest mb-2 print:text-xs">
      {children}
    </h2>
  )
}

// Helper functions
function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

function formatDateRange(startDate?: string, endDate?: string): string {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'Present'
  if (!start && !endDate) return ''
  return `${start} – ${end}`
}
