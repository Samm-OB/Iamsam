// Personal info shown in Start menu, About_Me.txt, Mail and the lock screen.
export const profile = {
  name: 'Samuel Ofoegbu',
  shortName: 'Sam',
  title: 'Software Developer & Data Scientist',
  tagline: 'I build things that matter.',
  status: 'Available for opportunities',
  email: 'smlofoegbu@gmail.com',
  links: [
    { label: 'GitHub', icon: 'github', url: 'https://github.com/Samm-OB' },
    { label: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/samuel-ofoegbu-873116182/' },
    { label: 'TryHackMe', icon: 'shield', url: 'https://tryhackme.com/p/smlofoegbu' },
  ],
  resume: '/files/Samuel_Ofoegbu_Resume.pdf',
}

// Contents of About_Me.txt (opens in Notepad). Plain text — edit freely.
export const aboutText = `Hi, I'm ${profile.name}.

${profile.title} — ${profile.tagline}

I'm an AI & Automation Analyst at Sankore Investments, where I build
pipelines that turn daily financial reports into clean data, dashboards
and Slack alerts.

I have a B.Sc. in Mathematics (Second Class Upper) from the University
of Lagos and I'm doing an M.Sc. in Financial Engineering at WorldQuant
University (expected Dec 2027).

I work across data, ML and security: ETL and analytics, deep learning
(point-supervised segmentation, RAG pipelines, financial forecasting),
phishing/URL threat analysis, and full-stack web apps.

Outside work: cybersecurity & CTF practice, basketball, video games,
technical research, and music (check the playlist).

How to use this desktop
-----------------------
- Double-click a folder or file to open it (single tap on phones).
- Drag windows by the title bar, resize from the edges,
  drag to the top of the screen to maximize, or to a side to snap.
- Right-click the desktop for more options.
- The music widget plays my playlist — press play.

Contact
-------
Email:    ${profile.email}
GitHub:   github.com/Samm-OB
LinkedIn: linkedin.com/in/samuel-ofoegbu-873116182
TryHackMe: tryhackme.com/p/smlofoegbu

${profile.status}.
`
