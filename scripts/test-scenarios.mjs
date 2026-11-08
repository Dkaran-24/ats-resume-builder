const sampleResume = {
  id: 'resume-1',
  title: 'Sample Resume',
  personalInfo: { fullName: 'Alex Morgan', jobTitle: 'Engineer', email: 'alex@demo.com', phone: '123' },
  summary: { text: 'Experienced engineer', tone: 'Professional' },
  experience: [],
  education: [],
  skills: { technical: [], programming: [], frameworks: [], tools: [], soft: [], domain: [] },
  projects: [],
  certifications: [],
  additionalSections: { internships: [], awards: [], publications: [], volunteer: [], languages: [], leadership: [], extracurricular: [] },
  formatting: { template: 'classic-ats' }
};

async function runTests() {
  console.log('--- STARTING RESUME AI AGENT SUITE TESTS ---');

  const tests = [
    {
      name: 'Test 13: Submit empty message',
      payload: {
        userMessage: '   ',
        currentResume: sampleResume
      },
      expectedStatus: 400,
      validate: (res, json) => json.code === 'INVALID_REQUEST' && json.error.includes('empty')
    },
    {
      name: 'Test 14: Submit very long message (>8000 chars)',
      payload: {
        userMessage: 'a'.repeat(9000),
        currentResume: sampleResume
      },
      expectedStatus: 400,
      validate: (res, json) => json.code === 'INVALID_REQUEST' && json.error.includes('exceeds')
    },
    {
      name: 'Test 15: Missing API key handling',
      payload: {
        userMessage: 'Make my resume more professional',
        currentResume: sampleResume
      },
      expectedStatus: 401,
      validate: (res, json) => json.code === 'API_KEY_MISSING' && json.configuredEnvVars.includes('GEMINI_API_KEY')
    },
    {
      name: 'Test 16: Malformed payload handling (missing resume)',
      payload: {
        userMessage: 'Rewrite my summary'
      },
      expectedStatus: 400,
      validate: (res, json) => json.code === 'INVALID_REQUEST'
    },
    {
      name: 'Test 17: Invalid API key test (rejection of bad key by external model)',
      payload: {
        userMessage: 'Rewrite my summary',
        currentResume: sampleResume
      },
      headers: { 'x-ai-api-key': 'AIza_invalid_test_key_12345' },
      expectedStatus: 400, // Gemini returns 400 API_KEY_INVALID
      validate: (res, json) => json.code === 'API_ERROR' || responseStatusMatch(res.status)
    }
  ];

  function responseStatusMatch(status) {
    return status === 400 || status === 403 || status === 401;
  }

  let passed = 0;
  for (const t of tests) {
    try {
      const response = await fetch('http://localhost:3000/api/ai/resume-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(t.headers || {})
        },
        body: JSON.stringify(t.payload)
      });
      const json = await response.json();
      const statusOk = response.status === t.expectedStatus || (t.name.includes('Test 17') && responseStatusMatch(response.status));
      const validOk = t.validate(response, json);

      if (statusOk && validOk) {
        console.log(`[PASS] ${t.name} (HTTP ${response.status}, Code: ${json.code})`);
        passed++;
      } else {
        console.error(`[FAIL] ${t.name} (HTTP ${response.status}, Code: ${json.code}):`, json);
      }
    } catch (err) {
      console.error(`[ERROR] ${t.name}:`, err.message);
    }
  }

  console.log(`\nResults: ${passed} / ${tests.length} automated API edge-case tests passed.`);
}

runTests();
