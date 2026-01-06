import { cn } from '../../../lib/utils'

import type { ThemeProps } from '../../../lib/themes'

/**
 * Modern Theme
 * Contemporary design with visual flair and color accents
 */
export function ModernTheme({ resume, className }: ThemeProps) {
  const { basics, work, education, skills, projects, certificates, awards, publications, languages, volunteer, references } = resume

  return (
    <div className={cn('bg-white text-charcoal font-sans print:text-sm', className)}>
      {/* Header with accent background */}
      {basics && (
        <header className="bg-gradient-to-r from-charcoal to-mid-gray text-white p-6 -mx-6 -mt-6 mb-6 print:bg-charcoal">
          <h1 className="text-3xl font-bold print:text-2xl">
            {basics.name || 'Your Name'}
          </h1>
          {basics.label && (
            <p className="text-lg text-amber mt-1 font-medium print:text-base">{basics.label}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-300">
            {basics.email && (
              <a href={`mailto:${basics.email}`} className="hover:text-amber flex items-center gap-1">
                <EmailIcon />
                {basics.email}
              </a>
            )}
            {basics.phone && (
              <span className="flex items-center gap-1">
                <PhoneIcon />
                {basics.phone}
              </span>
            )}
            {basics.url && (
              <a href={basics.url} target="_blank" rel="noopener noreferrer" className="hover:text-amber flex items-center gap-1">
                <LinkIcon />
                {basics.url}
              </a>
            )}
            {basics.location && (
              <span className="flex items-center gap-1">
                <LocationIcon />
                {[basics.location.city, basics.location.region, basics.location.countryCode]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            )}
          </div>
          {basics.profiles && basics.profiles.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {basics.profiles.map((profile, i) => (
                <a
                  key={i}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white/10 rounded-full text-xs hover:bg-amber hover:text-charcoal transition-colors"
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
        <section className="mb-6">
          <p className="text-mid-gray leading-relaxed border-l-4 border-amber pl-4">
            {basics.summary}
          </p>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6 print:col-span-2">
          {/* Work Experience */}
          {work && work.length > 0 && (
            <section>
              <SectionHeader>Experience</SectionHeader>
              <div className="space-y-5">
                {work.map((job, i) => (
                  <div key={i} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber" />
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-charcoal">{job.position}</h3>
                        <p className="text-sm text-amber font-medium">
                          {job.name}
                          {job.location && <span className="text-mid-gray"> | {job.location}</span>}
                        </p>
                      </div>
                      <span className="text-xs text-mid-gray bg-gray-100 px-2 py-1 rounded">
                        {formatDateRange(job.startDate, job.endDate)}
                      </span>
                    </div>
                    {job.summary && (
                      <p className="text-sm text-mid-gray mt-2">{job.summary}</p>
                    )}
                    {job.highlights && job.highlights.length > 0 && (
                      <ul className="mt-2 text-sm text-mid-gray space-y-1">
                        {job.highlights.map((highlight, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-amber mt-1">•</span>
                            {highlight}
                          </li>
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
            <section>
              <SectionHeader>Projects</SectionHeader>
              <div className="grid gap-4">
                {projects.map((project, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-charcoal">{project.name}</h3>
                      {(project.startDate || project.endDate) && (
                        <span className="text-xs text-mid-gray">
                          {formatDateRange(project.startDate, project.endDate)}
                        </span>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-sm text-mid-gray mt-1">{project.description}</p>
                    )}
                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="mt-2 text-sm text-mid-gray space-y-1">
                        {project.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-amber">→</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    {project.keywords && project.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.keywords.map((kw, j) => (
                          <span key={j} className="px-2 py-0.5 bg-amber/10 text-amber text-xs rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <SectionHeader>Education</SectionHeader>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-charcoal">
                        {edu.studyType} {edu.area && `in ${edu.area}`}
                      </h3>
                      <p className="text-sm text-amber">{edu.institution}</p>
                      {edu.score && (
                        <p className="text-xs text-mid-gray">GPA: {edu.score}</p>
                      )}
                    </div>
                    <span className="text-xs text-mid-gray bg-gray-100 px-2 py-1 rounded">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <SectionHeader>Skills</SectionHeader>
              <div className="space-y-3">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-charcoal text-sm">{skill.name}</span>
                      {skill.level && (
                        <span className="text-xs text-mid-gray">{skill.level}</span>
                      )}
                    </div>
                    {skill.keywords && skill.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {skill.keywords.map((kw, j) => (
                          <span key={j} className="text-xs text-mid-gray">
                            {kw}{j < skill.keywords!.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section>
              <SectionHeader>Languages</SectionHeader>
              <div className="space-y-2">
                {languages.map((lang, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="font-medium text-charcoal">{lang.language}</span>
                    <span className="text-mid-gray">{lang.fluency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {certificates && certificates.length > 0 && (
            <section>
              <SectionHeader>Certificates</SectionHeader>
              <div className="space-y-2">
                {certificates.map((cert, i) => (
                  <div key={i}>
                    <h4 className="font-medium text-charcoal text-sm">{cert.name}</h4>
                    <p className="text-xs text-mid-gray">
                      {cert.issuer}
                      {cert.date && ` • ${formatDate(cert.date)}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <section>
              <SectionHeader>Awards</SectionHeader>
              <div className="space-y-2">
                {awards.map((award, i) => (
                  <div key={i}>
                    <h4 className="font-medium text-charcoal text-sm">{award.title}</h4>
                    <p className="text-xs text-mid-gray">
                      {award.awarder}
                      {award.date && ` • ${formatDate(award.date)}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Publications */}
      {publications && publications.length > 0 && (
        <section className="mt-6">
          <SectionHeader>Publications</SectionHeader>
          <div className="space-y-2">
            {publications.map((pub, i) => (
              <div key={i}>
                <h4 className="font-medium text-charcoal">{pub.name}</h4>
                <p className="text-sm text-mid-gray">
                  {pub.publisher}
                  {pub.releaseDate && ` • ${formatDate(pub.releaseDate)}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer */}
      {volunteer && volunteer.length > 0 && (
        <section className="mt-6">
          <SectionHeader>Volunteer</SectionHeader>
          <div className="space-y-3">
            {volunteer.map((vol, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-charcoal">{vol.position}</h4>
                    <p className="text-sm text-amber">{vol.organization}</p>
                  </div>
                  <span className="text-xs text-mid-gray">
                    {formatDateRange(vol.startDate, vol.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {references && references.length > 0 && (
        <section className="mt-6">
          <SectionHeader>References</SectionHeader>
          <div className="grid gap-3">
            {references.map((ref, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-charcoal">{ref.name}</h4>
                {ref.reference && (
                  <p className="text-sm text-mid-gray italic mt-1">"{ref.reference}"</p>
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
    <h2 className="text-lg font-bold text-charcoal mb-3 flex items-center gap-2 print:text-base">
      <span className="w-8 h-0.5 bg-amber" />
      {children}
    </h2>
  )
}

// Icons
function EmailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
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
  return `${start} - ${end}`
}
