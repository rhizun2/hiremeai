// ─────────────────────────────────────────────────────────────
// THE ONLY FILE YOU EDIT WHEN YOUR RESUME CHANGES.
// Desktop folders, the Projects window, menu bar, terminal and
// chat starter questions are all built from this object.
// (The chatbot itself answers from my_resume.pdf on the backend.)
// ─────────────────────────────────────────────────────────────

export const profile = {
  owner: {
    name: 'Nikhil',
    fullName: 'Nikhil Gupta',
    location: 'Gandhinagar, India',
    heroGreeting: "Hey, I'm Nikhil! welcome to my",
    heroWord: 'Portfolio',
  },

  // Put your resume at public/resume.pdf — the desktop icon and menu link open it.
  resumeUrl: '/resume.pdf',

  links: {
    github: 'https://github.com/rhizun2',
    linkedin: 'https://www.linkedin.com/in/nikhil-g-20a22a244/',
    email: '25nikhilgupta@gmail.com',
  },

  // Sidebar categories in the Projects window (id must match project.category).
  categories: [
    { id: 'all', label: 'All projects' },
    { id: 'ai', label: 'AI' },
    { id: 'tools', label: 'Tools' },
  ],

  // Each project becomes a desktop folder + a card in the Projects window.
  // status: 'live' | 'wip' | 'archived'. repo/demo: URL or null.
  projects: [
    {
      id: 'resume-parser',
      name: 'Resume Parser',
      summary: 'Reads a PDF resume and uses an LLM to extract skills, experience, projects and certifications as structured JSON.',
      tags: ['Python', 'FastAPI', 'Groq', 'pypdf'],
      category: 'ai',
      status: 'live',
      repo: null, // TODO: GitHub link
      demo: null,
      pinned: true,
    },
    {
      id: 'radix-converter',
      name: 'Radix Converter',
      summary: 'Converts numbers between bases — binary, octal, decimal and hexadecimal.',
      tags: ['TODO: stack'],
      category: 'tools',
      status: 'live',
      repo: null, // TODO: GitHub link
      demo: null,
      pinned: true,
    },
    {
      id: 'SIH-26059',
      name: 'SIH-26059: AI-Enabled Antarctic Sea-Ice, Iceberg Trajectory, and Navigation Decision Support System',
      tags: ['Smart India Hackathon'],
      category: 'ai',
      status: 'wip',
      repo: null, // TODO: GitHub link
      demo: null,
      pinned: true,}
  ],

  // Shown in the terminal window (`skills`).
  skills: ['Git', 'GitHub Actions', 'Python', 'FastAPI', 'VS Code', 'Linux Shell'],

  // Starter chips in the Ask Me window.
  starterQuestions: [
    'Tell me about yourself',
    'What projects have you built?',
    'Why should I hire you?',
    "What's your tech stack?",
    'What certifications do you have?',
  ],
};
