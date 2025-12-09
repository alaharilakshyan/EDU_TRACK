# LLM CV/ATS Scoring Prompt Template

## System Prompt
You are an assistant that extracts structured data from a resume/CV and scores it against a job description. Output must be strict JSON. Do not include commentary.

## User Prompt Template
```
Resume text or uploaded PDF text:
"""<PASTE_CV_TEXT>"""

Job description (JSON):
{
  "title": "<JOB_TITLE>",
  "requiredSkills": ["skill1", "skill2", ...],
  "preferredSkills": [...],
  "minExperienceYears": 1,
  "degreeRequirement": "Bachelor/Any/Masters",
  "industry": "<INDUSTRY>",
  "company": "<COMPANY_NAME>"
}

TASKS:
1) Parse the resume and extract fields: name, email, phone, education: [{degree, institution, startYear,endYear,gpa}], experience: [{title,company,years,desc}], projects[], skills[], certifications[].
2) Compute SkillMatch = fraction of requiredSkills present in skills[] (0-1).
3) Compute ExperienceScore = min(totalYears / minExperienceYears, 1.0)
4) Compute EducationScore: 1.0 if degree satisfies requirement, 0.5 if partial, 0 otherwise.
5) Compute ActivityScore by checking projects/internships relevant to jobTitle or requiredSkills (0-1).
6) Compute CertificationScore based on presence of relevant certifications (0-1).
7) Compute VerificationScore based on provided verification metadata (if available) (0-1).
8) Compute final ATS in percentage using weights:
   ATS = 0.40*SkillMatch + 0.20*ExperienceScore + 0.15*EducationScore + 0.10*ActivityScore + 0.10*CertificationScore + 0.05*VerificationScore
9) Output JSON:
{
 "parsedResume": {
   "name": "string",
   "email": "string",
   "phone": "string",
   "education": [{"degree": "string", "institution": "string", "startYear": number, "endYear": number, "gpa": number}],
   "experience": [{"title": "string", "company": "string", "years": number, "desc": "string"}],
   "projects": [{"title": "string", "description": "string", "technologies": ["string"]}],
   "skills": ["string"],
   "certifications": [{"name": "string", "issuer": "string", "date": "string"}]
 },
 "scores": { 
   "skillMatch": 0.75, 
   "experience": 0.8, 
   "education": 1.0, 
   "activity": 0.6, 
   "certification": 0.5, 
   "verification": 0.3 
 },
 "finalATSPercent": 78.5,
 "topReasons": ["Has required skills X,Y","2 years experience in relevant role"],
 "missing": ["Does not mention skill Z","No leadership experience"],
 "recommendations": ["Add more experience details","Include relevant certifications"]
}
```

## Example Usage

### Input Example
```
Resume text:
"""
John Doe
john.doe@email.com | +1-555-0123

EDUCATION
Bachelor of Computer Science, MIT | 2019-2023
GPA: 3.8/4.0

EXPERIENCE
Software Engineer Intern, Google | Summer 2022
- Developed REST APIs using Node.js and Express
- Worked on machine learning models for data processing
- 3 months experience

Full Stack Developer, Tech Startup | 2021-2022
- Built React applications with TypeScript
- Implemented MongoDB database schemas
- 1 year experience

PROJECTS
E-commerce Platform | React, Node.js, MongoDB
- Built complete MERN stack application
- Implemented user authentication and payment processing

Machine Learning Classifier | Python, TensorFlow
- Developed image classification model
- Achieved 92% accuracy

SKILLS
JavaScript, React, Node.js, MongoDB, Python, TensorFlow, Git, AWS
CERTIFICATIONS
AWS Certified Developer - 2022
Google Cloud Fundamentals - 2021
"""

Job description (JSON):
{
  "title": "Full Stack Developer",
  "requiredSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "preferredSkills": ["AWS", "Python"],
  "minExperienceYears": 1,
  "degreeRequirement": "Bachelor",
  "industry": "Technology",
  "company": "TechCorp"
}
```

### Expected Output
```json
{
 "parsedResume": {
   "name": "John Doe",
   "email": "john.doe@email.com",
   "phone": "+1-555-0123",
   "education": [{
     "degree": "Bachelor of Computer Science",
     "institution": "MIT",
     "startYear": 2019,
     "endYear": 2023,
     "gpa": 3.8
   }],
   "experience": [
     {
       "title": "Software Engineer Intern",
       "company": "Google",
       "years": 0.25,
       "desc": "Developed REST APIs using Node.js and Express, Worked on machine learning models"
     },
     {
       "title": "Full Stack Developer",
       "company": "Tech Startup",
       "years": 1,
       "desc": "Built React applications with TypeScript, Implemented MongoDB database schemas"
     }
   ],
   "projects": [
     {
       "title": "E-commerce Platform",
       "description": "Built complete MERN stack application",
       "technologies": ["React", "Node.js", "MongoDB"]
     },
     {
       "title": "Machine Learning Classifier",
       "description": "Developed image classification model",
       "technologies": ["Python", "TensorFlow"]
     }
   ],
   "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Python", "TensorFlow", "Git", "AWS"],
   "certifications": [
     {"name": "AWS Certified Developer", "issuer": "AWS", "date": "2022"},
     {"name": "Google Cloud Fundamentals", "issuer": "Google", "date": "2021"}
   ]
 },
 "scores": { 
   "skillMatch": 1.0, 
   "experience": 1.25, 
   "education": 1.0, 
   "activity": 0.8, 
   "certification": 0.5, 
   "verification": 0.0 
 },
 "finalATSPercent": 85.0,
 "topReasons": ["Has all required skills", "Relevant full stack experience", "Strong educational background"],
 "missing": ["No verification data available"],
 "recommendations": ["Get work experience verified", "Add more project details"]
}
```

## Backend Integration Notes

### API Call Structure
```javascript
async function scoreCV(cvText, jobDescription, verificationData = {}) {
  const prompt = `
Resume text:
"""${cvText}"""

Job description (JSON):
${JSON.stringify(jobDescription)}

TASKS:
1) Parse the resume and extract fields...
2) Compute SkillMatch...
// ... rest of tasks
`;

  const response = await llmApi.call({
    model: 'claude-3-sonnet',
    messages: [
      { role: 'system', content: 'You are an assistant that extracts structured data from a resume/CV and scores it against a job description. Output must be strict JSON. Do not include commentary.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 2000,
    temperature: 0.1
  });

  return JSON.parse(response.content);
}
```

### Validation Schema
```javascript
const CVScoreSchema = Joi.object({
  parsedResume: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    education: Joi.array().items(Joi.object({
      degree: Joi.string().required(),
      institution: Joi.string().required(),
      startYear: Joi.number().required(),
      endYear: Joi.number().required(),
      gpa: Joi.number().min(0).max(4)
    })).required(),
    experience: Joi.array().items(Joi.object({
      title: Joi.string().required(),
      company: Joi.string().required(),
      years: Joi.number().required(),
      desc: Joi.string()
    })).required(),
    projects: Joi.array().items(Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      technologies: Joi.array().items(Joi.string())
    })).required(),
    skills: Joi.array().items(Joi.string()).required(),
    certifications: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      issuer: Joi.string().required(),
      date: Joi.string()
    }))
  }).required(),
  scores: Joi.object({
    skillMatch: Joi.number().min(0).max(1).required(),
    experience: Joi.number().min(0).max(1).required(),
    education: Joi.number().min(0).max(1).required(),
    activity: Joi.number().min(0).max(1).required(),
    certification: Joi.number().min(0).max(1).required(),
    verification: Joi.number().min(0).max(1).required()
  }).required(),
  finalATSPercent: Joi.number().min(0).max(100).required(),
  topReasons: Joi.array().items(Joi.string()).required(),
  missing: Joi.array().items(Joi.string()).required(),
  recommendations: Joi.array().items(Joi.string())
});
```

## Error Handling
- Always validate JSON response before processing
- Implement retry logic for LLM API failures
- Log failed scoring attempts for debugging
- Provide fallback scoring if LLM is unavailable
- Cache scoring results to avoid repeated API calls
