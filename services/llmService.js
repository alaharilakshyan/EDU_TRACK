const axios = require('axios');

class LLMService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.CLAUDE_API_KEY;
    this.baseURL = process.env.OPENAI_API_BASE_URL || 'https://api.anthropic.com/v1';
    this.model = process.env.LLM_MODEL || 'claude-3-sonnet-20240229';
  }

  async scoreCV(cvText, jobDescription, verificationData = {}) {
    try {
      const prompt = this.buildScoringPrompt(cvText, jobDescription, verificationData);
      
      const response = await this.callLLM(prompt);
      
      // Validate and parse response
      const scoreResult = JSON.parse(response.content);
      
      // Validate required fields
      this.validateScoreResult(scoreResult);
      
      return scoreResult;
    } catch (error) {
      console.error('LLM scoring error:', error);
      
      // Fallback scoring if LLM fails
      return this.fallbackScoring(cvText, jobDescription, verificationData);
    }
  }

  buildScoringPrompt(cvText, jobDescription, verificationData) {
    return {
      role: 'user',
      content: `Resume text:
"""${cvText}"""

Job description (JSON):
${JSON.stringify(jobDescription)}

TASKS:
1) Parse the resume and extract fields: name, email, phone, education: [{degree, institution, startYear,endYear,gpa}], experience: [{title,company,years,desc}], projects[], skills[], certifications[].
2) Compute SkillMatch = fraction of requiredSkills present in skills[] (0-1).
3) Compute ExperienceScore = min(totalYears / minExperienceYears, 1.0)
4) Compute EducationScore: 1.0 if degree satisfies requirement, 0.5 if partial, 0 otherwise.
5) Compute ActivityScore by checking projects/internships relevant to jobTitle or requiredSkills (0-1).
6) Compute CertificationScore based on presence of relevant certifications (0-1).
7) Compute VerificationScore based on provided verification metadata: ${JSON.stringify(verificationData)} (0-1).
8) Compute final ATS in percentage using weights:
   ATS = 0.40*SkillMatch + 0.20*ExperienceScore + 0.15*EducationScore + 0.10*ActivityScore + 0.10*CertificationScore + 0.05*VerificationScore
9) Output JSON:
{
 "parsedResume": {...},
 "scores": { "skillMatch": 0.75, "experience":0.8, "education":1.0, "activity":0.6, "certification":0.5, "verification":0.3 },
 "finalATSPercent": 78.5,
 "topReasons": ["Has required skills X,Y","2 years experience in relevant role"],
 "missing": ["Does not mention skill Z","No leadership experience"],
 "recommendations": ["Add more experience details","Include relevant certifications"]
}`
    };
  }

  async callLLM(prompt) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'anthropic-version': '2023-06-01'
        }
      };

      const payload = {
        model: this.model,
        max_tokens: 2000,
        temperature: 0.1,
        messages: [
          { 
            role: 'system', 
            content: 'You are an assistant that extracts structured data from a resume/CV and scores it against a job description. Output must be strict JSON. Do not include commentary.' 
          },
          prompt
        ]
      };

      const response = await axios.post(
        `${this.baseURL}/messages`,
        payload,
        config
      );

      return response.data;
    } catch (error) {
      console.error('LLM API call error:', error);
      throw error;
    }
  }

  validateScoreResult(result) {
    const requiredFields = ['parsedResume', 'scores', 'finalATSPercent', 'topReasons', 'missing', 'recommendations'];
    
    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const scoreFields = ['skillMatch', 'experience', 'education', 'activity', 'certification', 'verification'];
    for (const field of scoreFields) {
      if (!(field in result.scores) || typeof result.scores[field] !== 'number') {
        throw new Error(`Invalid score field: ${field}`);
      }
    }

    if (typeof result.finalATSPercent !== 'number' || result.finalATSPercent < 0 || result.finalATSPercent > 100) {
      throw new Error('Invalid finalATSPercent value');
    }
  }

  fallbackScoring(cvText, jobDescription, verificationData) {
    // Simple keyword-based fallback scoring
    const cvLower = cvText.toLowerCase();
    const requiredSkills = jobDescription.requiredSkills || [];
    
    const skillMatch = requiredSkills.filter(skill => 
      cvLower.includes(skill.toLowerCase())
    ).length / Math.max(requiredSkills.length, 1);

    const experienceMatch = cvLower.includes('year') ? 0.7 : 0.3;
    const educationMatch = cvLower.includes('bachelor') || cvLower.includes('master') ? 1.0 : 0.5;
    const activityMatch = cvLower.includes('project') ? 0.6 : 0.3;
    const certificationMatch = cvLower.includes('certified') || cvLower.includes('certificate') ? 0.5 : 0.2;
    const verificationScore = verificationData.verificationRatio || 0.5;

    const finalATS = (
      0.40 * skillMatch +
      0.20 * experienceMatch +
      0.15 * educationMatch +
      0.10 * activityMatch +
      0.10 * certificationMatch +
      0.05 * verificationScore
    ) * 100;

    return {
      parsedResume: {
        name: 'Unknown',
        email: 'Unknown',
        phone: 'Unknown',
        education: [],
        experience: [],
        projects: [],
        skills: requiredSkills.filter(skill => cvLower.includes(skill.toLowerCase())),
        certifications: []
      },
      scores: {
        skillMatch,
        experience: experienceMatch,
        education: educationMatch,
        activity: activityMatch,
        certification: certificationMatch,
        verification: verificationScore
      },
      finalATSPercent: Math.round(finalATS * 10) / 10,
      topReasons: ['Basic keyword analysis performed'],
      missing: ['LLM service unavailable'],
      recommendations: ['Try again later for detailed analysis']
    };
  }
}

module.exports = new LLMService();
