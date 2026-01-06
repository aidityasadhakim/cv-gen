import { cn } from '../../../lib/utils'

import type { ThemeProps } from '../../../lib/themes'

/**
 * Professional Theme
 * Clean, traditional layout suitable for corporate roles
 */
export function ProfessionalTheme({ resume, className }: ThemeProps) {
  const { basics, work, education, skills, projects, certificates, awards, publications, languages, volunteer, references } = resume

  return (
    <div className={cn('bg-white text-charcoal font-sans print:text-sm', className)}>
      {/* Header */}
      {basics && (
        <header className="border-b-2 border-charcoal pb-4 mb-6">
          <h1 className="text-3xl font-bold text-charcoal print:text-2xl">
            {basics.name || 'Your Name'}
          </h1>
          {basics.label && (
            <p className="text-lg text-mid-gray mt-1 print:text-base">{basics.label}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-mid-gray">
            {basics.email && (
              <a href={`mailto:${basics.email}`} className="hover:text-amber">
                {basics.email}
              </a>
            )}
            {basics.phone && <span>{basics.phone}</span>}
            {basics.url && (
              <a href={basics.url} target="_blank" rel="noopener noreferrer" className="hover:text-amber">
                {basics.url}
              </a>
            )}
            {basics.location && (
              <span>
                {[basics.location.city, basics.location.region, basics.location.countryCode]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            )}
          </div>
          {basics.profiles && basics.profiles.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              {basics.profiles.map((profile, i) => (
                <a
                  key={i}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber hover:underline"
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
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Summary
          </h2>
          <p className="text-sm text-mid-gray leading-relaxed">{basics.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {work && work.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Experience
          </h2>
          <div className="space-y-4">
            {work.map((job, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-charcoal">{job.position}</h3>
                    <p className="text-sm text-mid-gray">
                      {job.name}
                      {job.location && <span className="ml-2">| {job.location}</span>}
                    </p>
                  </div>
                  <span className="text-sm text-mid-gray whitespace-nowrap">
                    {formatDateRange(job.startDate, job.endDate)}
                  </span>
                </div>
                {job.summary && (
                  <p className="text-sm text-mid-gray mt-1">{job.summary}</p>
                )}
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-2 text-sm text-mid-gray space-y-1">
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

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-charcoal">
                    {edu.studyType} {edu.area && `in ${edu.area}`}
                  </h3>
                  <p className="text-sm text-mid-gray">{edu.institution}</p>
                  {edu.score && (
                    <p className="text-sm text-mid-gray">GPA: {edu.score}</p>
                  )}
                </div>
                <span className="text-sm text-mid-gray whitespace-nowrap">
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
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Skills
          </h2>
          <div className="space-y-2">
            {skills.map((skill, i) => (
              <div key={i}>
                <span className="font-semibold text-charcoal">{skill.name}</span>
                {skill.level && (
                  <span className="text-sm text-mid-gray ml-2">({skill.level})</span>
                )}
                {skill.keywords && skill.keywords.length > 0 && (
                  <span className="text-sm text-mid-gray ml-2">
                    - {skill.keywords.join(', ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-charcoal">{project.name}</h3>
                  {(project.startDate || project.endDate) && (
                    <span className="text-sm text-mid-gray whitespace-nowrap">
                      {formatDateRange(project.startDate, project.endDate)}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-mid-gray mt-1">{project.description}</p>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-1 text-sm text-mid-gray space-y-1">
                    {project.highlights.map((highlight, j) => (
                      <li key={j}>{highlight}</li>
                    ))}
                  </ul>
                )}
                {project.keywords && project.keywords.length > 0 && (
                  <p className="text-xs text-mid-gray mt-1">
                    Technologies: {project.keywords.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates && certificates.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Certificates
          </h2>
          <div className="space-y-2">
            {certificates.map((cert, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-charcoal">{cert.name}</h3>
                  <p className="text-sm text-mid-gray">{cert.issuer}</p>
                </div>
                {cert.date && (
                  <span className="text-sm text-mid-gray">{formatDate(cert.date)}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {awards && awards.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Awards
          </h2>
          <div className="space-y-2">
            {awards.map((award, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-charcoal">{award.title}</h3>
                  <p className="text-sm text-mid-gray">{award.awarder}</p>
                  {award.summary && (
                    <p className="text-sm text-mid-gray mt-1">{award.summary}</p>
                  )}
                </div>
                {award.date && (
                  <span className="text-sm text-mid-gray">{formatDate(award.date)}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {publications && publications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Publications
          </h2>
          <div className="space-y-2">
            {publications.map((pub, i) => (
              <div key={i}>
                <h3 className="font-semibold text-charcoal">{pub.name}</h3>
                <p className="text-sm text-mid-gray">
                  {pub.publisher}
                  {pub.releaseDate && ` - ${formatDate(pub.releaseDate)}`}
                </p>
                {pub.summary && (
                  <p className="text-sm text-mid-gray mt-1">{pub.summary}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Languages
          </h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang, i) => (
              <span key={i} className="text-sm">
                <span className="font-semibold text-charcoal">{lang.language}</span>
                {lang.fluency && (
                  <span className="text-mid-gray"> - {lang.fluency}</span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer */}
      {volunteer && volunteer.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            Volunteer Experience
          </h2>
          <div className="space-y-3">
            {volunteer.map((vol, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-charcoal">{vol.position}</h3>
                    <p className="text-sm text-mid-gray">{vol.organization}</p>
                  </div>
                  <span className="text-sm text-mid-gray whitespace-nowrap">
                    {formatDateRange(vol.startDate, vol.endDate)}
                  </span>
                </div>
                {vol.summary && (
                  <p className="text-sm text-mid-gray mt-1">{vol.summary}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {references && references.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-gray-300 pb-1 mb-3 print:text-base">
            References
          </h2>
          <div className="space-y-2">
            {references.map((ref, i) => (
              <div key={i}>
                <h3 className="font-semibold text-charcoal">{ref.name}</h3>
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
