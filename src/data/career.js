// School folder
export const education = [
  {
    id: 'wqu',
    file: 'WorldQuant University - MSc Financial Engineering',
    heading: 'M.Sc. Financial Engineering',
    org: 'WorldQuant University',
    period: 'Expected Dec 2027',
    body: ['Relevant coursework: Financial Markets, Financial Data, Deep Learning.'],
  },
  {
    id: 'unilag',
    file: 'UNILAG - BSc Mathematics',
    heading: 'B.Sc. Mathematics (STEM)',
    org: 'University of Lagos (UNILAG)',
    period: 'Dec 2025',
    body: [
      'Degree class: Second Class Upper.',
      'Relevant coursework: Statistics, Probability Theory, Mathematical Methods (Calculus), Real Analysis, Numerical Analysis, Mechanics, Abstract Algebra, Linear Algebra, Mathematical Modelling.',
    ],
  },
]

// Experience folder
export const experience = [
  {
    id: 'sankore',
    file: 'AI & Automation Analyst - Sankore Investments',
    heading: 'AI & Automation Analyst',
    org: 'Sankore Investments',
    period: 'Apr 2025 – Present',
    body: [],
    bullets: [
      'Built automation pipelines ingesting PDF and CSV financial reports daily, parsing data and upserting into Supabase PostgreSQL with validation and integrity checks that eliminated manual data entry.',
      'Engineered a Next.js + Supabase reporting dashboard with KPI cards, trend analytics, and an automated Slack notification/monitoring system posting formatted daily results on pipeline completion.',
      'Governed KPI definitions, SQL views, and upsert logic across interconnected data models while handling sensitive financial data and resolving complex data-quality issues.',
    ],
  },
  {
    id: 'nithub',
    file: 'Research Assistant - NITHUB',
    heading: 'Research Assistant',
    org: 'NITHUB',
    period: 'May 2025 – Sep 2025',
    body: [],
    bullets: [
      'Engineered scalable Python ETL pipelines normalizing and validating 4,000+ records, improving dataset integrity and analytical structure to support data-driven decisions.',
      'Applied statistical methods (regression, variance, trend analysis) and delivered executive dashboards, improving insight visibility by 30% and accelerating decision cycles.',
    ],
  },
  {
    id: 'wayalinks',
    file: 'Data Science Intern - Wayalinks',
    heading: 'Data Science Intern',
    org: 'Wayalinks',
    period: 'Apr 2025 – May 2025',
    body: [],
    bullets: [
      'Designed end-to-end pipelines transforming raw interaction logs into analytics-ready datasets, ensuring data quality and reliability across 12 KPI dashboards.',
      'Applied cohort analysis and behavioral segmentation on 15,432 user records with Python and SQL, surfacing insights that informed product strategy; automated reporting, cutting turnaround by 22%.',
    ],
  },
  {
    id: 'gptw',
    file: 'Data Analyst - Great Place to Work',
    heading: 'Data Analyst',
    org: 'Great Place to Work',
    period: 'Sep 2024 – Dec 2024',
    body: [],
    bullets: [
      'Defined and tracked 12 cross-functional KPIs across 5 departments via interconnected SQL views and dashboards, improving reporting efficiency by 30%.',
      'Transformed 5,000+ records into analytics products; funnel and correlation analysis identified 4 key retention drivers adopted across 5 teams.',
    ],
  },
  {
    id: 'freelance',
    file: 'Freelance Developer',
    heading: 'Freelance Developer',
    org: 'Self-Employed',
    period: '2025 – Present',
    body: ['Building web applications and ML-powered features for clients.'],
    bullets: [
      'Built Anniekuku – E-commerce jewelry platform',
      'Built Punpoets – Poetry sharing platform',
      'Built ADCOMAT – Marketing automation tool',
      'Built NaijaList – Nigerian marketplace',
    ],
  },
]

// Tech Stack app (styled like Task Manager)
export const stack = [
  { title: 'Security & IT', items: ['Phishing / URL threat analysis', 'Threat intelligence (VirusTotal)', 'Anomaly detection', 'Data integrity & validation', 'OS & networking fundamentals', 'Security operations', 'Wireshark', 'Nmap'] },
  { title: 'Languages & Frameworks', items: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'R', 'React', 'Next.js', 'FastAPI', 'Flask'] },
  { title: 'ML & Analytics', items: ['Scikit-learn', 'PyTorch', 'TensorFlow', 'HuggingFace', 'LangChain', 'Regression', 'Classification', 'A/B & Hypothesis Testing'] },
  { title: 'Databases & Cloud', items: ['PostgreSQL', 'MySQL', 'Supabase', 'BigQuery', 'Snowflake', 'AWS', 'GCP'] },
  { title: 'Tools', items: ['Git', 'Docker', 'n8n', 'Pytest', 'Power BI', 'Excel', 'Salesforce', 'Google Workspace'] },
]
