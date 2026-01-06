// Package models provides domain models for the application
package models

// JSONResume represents the complete JSON Resume schema
// See: https://jsonresume.org/schema/
type JSONResume struct {
	Basics       *Basics       `json:"basics,omitempty"`
	Work         []Work        `json:"work,omitempty"`
	Volunteer    []Volunteer   `json:"volunteer,omitempty"`
	Education    []Education   `json:"education,omitempty"`
	Awards       []Award       `json:"awards,omitempty"`
	Certificates []Certificate `json:"certificates,omitempty"`
	Publications []Publication `json:"publications,omitempty"`
	Skills       []Skill       `json:"skills,omitempty"`
	Languages    []Language    `json:"languages,omitempty"`
	Interests    []Interest    `json:"interests,omitempty"`
	References   []Reference   `json:"references,omitempty"`
	Projects     []Project     `json:"projects,omitempty"`
}

// Basics represents the basic information section
type Basics struct {
	Name     string    `json:"name"`
	Label    string    `json:"label,omitempty"`
	Image    string    `json:"image,omitempty"`
	Email    string    `json:"email"`
	Phone    string    `json:"phone,omitempty"`
	URL      string    `json:"url,omitempty"`
	Summary  string    `json:"summary,omitempty"`
	Location *Location `json:"location,omitempty"`
	Profiles []Profile `json:"profiles,omitempty"`
}

// Location represents a physical location
type Location struct {
	Address     string `json:"address,omitempty"`
	PostalCode  string `json:"postalCode,omitempty"`
	City        string `json:"city,omitempty"`
	CountryCode string `json:"countryCode,omitempty"`
	Region      string `json:"region,omitempty"`
}

// Profile represents a social media or professional profile
type Profile struct {
	Network  string `json:"network,omitempty"`
	Username string `json:"username,omitempty"`
	URL      string `json:"url,omitempty"`
}

// Work represents a work experience entry
type Work struct {
	Name       string   `json:"name,omitempty"`
	Position   string   `json:"position,omitempty"`
	URL        string   `json:"url,omitempty"`
	StartDate  string   `json:"startDate,omitempty"`
	EndDate    string   `json:"endDate,omitempty"`
	Summary    string   `json:"summary,omitempty"`
	Highlights []string `json:"highlights,omitempty"`
	Location   string   `json:"location,omitempty"`
}

// Volunteer represents a volunteer experience entry
type Volunteer struct {
	Organization string   `json:"organization,omitempty"`
	Position     string   `json:"position,omitempty"`
	URL          string   `json:"url,omitempty"`
	StartDate    string   `json:"startDate,omitempty"`
	EndDate      string   `json:"endDate,omitempty"`
	Summary      string   `json:"summary,omitempty"`
	Highlights   []string `json:"highlights,omitempty"`
}

// Education represents an education entry
type Education struct {
	Institution string   `json:"institution,omitempty"`
	URL         string   `json:"url,omitempty"`
	Area        string   `json:"area,omitempty"`
	StudyType   string   `json:"studyType,omitempty"`
	StartDate   string   `json:"startDate,omitempty"`
	EndDate     string   `json:"endDate,omitempty"`
	Score       string   `json:"score,omitempty"`
	Courses     []string `json:"courses,omitempty"`
}

// Award represents an award or recognition
type Award struct {
	Title   string `json:"title,omitempty"`
	Date    string `json:"date,omitempty"`
	Awarder string `json:"awarder,omitempty"`
	Summary string `json:"summary,omitempty"`
}

// Certificate represents a professional certification
type Certificate struct {
	Name   string `json:"name,omitempty"`
	Date   string `json:"date,omitempty"`
	Issuer string `json:"issuer,omitempty"`
	URL    string `json:"url,omitempty"`
}

// Publication represents a publication
type Publication struct {
	Name        string `json:"name,omitempty"`
	Publisher   string `json:"publisher,omitempty"`
	ReleaseDate string `json:"releaseDate,omitempty"`
	URL         string `json:"url,omitempty"`
	Summary     string `json:"summary,omitempty"`
}

// Skill represents a skill with optional keywords and proficiency level
type Skill struct {
	Name     string   `json:"name,omitempty"`
	Level    string   `json:"level,omitempty"`
	Keywords []string `json:"keywords,omitempty"`
}

// Language represents a language proficiency
type Language struct {
	Language string `json:"language,omitempty"`
	Fluency  string `json:"fluency,omitempty"`
}

// Interest represents a personal interest
type Interest struct {
	Name     string   `json:"name,omitempty"`
	Keywords []string `json:"keywords,omitempty"`
}

// Reference represents a professional reference
type Reference struct {
	Name      string `json:"name,omitempty"`
	Reference string `json:"reference,omitempty"`
}

// Project represents a personal or professional project
type Project struct {
	Name        string   `json:"name,omitempty"`
	Description string   `json:"description,omitempty"`
	Highlights  []string `json:"highlights,omitempty"`
	Keywords    []string `json:"keywords,omitempty"`
	StartDate   string   `json:"startDate,omitempty"`
	EndDate     string   `json:"endDate,omitempty"`
	URL         string   `json:"url,omitempty"`
	Roles       []string `json:"roles,omitempty"`
	Entity      string   `json:"entity,omitempty"`
	Type        string   `json:"type,omitempty"`
}

// ValidSections returns a list of valid JSON Resume section names
func ValidSections() []string {
	return []string{
		"basics",
		"work",
		"volunteer",
		"education",
		"awards",
		"certificates",
		"publications",
		"skills",
		"languages",
		"interests",
		"references",
		"projects",
	}
}

// IsValidSection checks if a section name is valid
func IsValidSection(section string) bool {
	for _, s := range ValidSections() {
		if s == section {
			return true
		}
	}
	return false
}

// EmptyJSONResume returns an empty JSON Resume structure
func EmptyJSONResume() *JSONResume {
	return &JSONResume{
		Basics:       &Basics{},
		Work:         []Work{},
		Volunteer:    []Volunteer{},
		Education:    []Education{},
		Awards:       []Award{},
		Certificates: []Certificate{},
		Publications: []Publication{},
		Skills:       []Skill{},
		Languages:    []Language{},
		Interests:    []Interest{},
		References:   []Reference{},
		Projects:     []Project{},
	}
}
