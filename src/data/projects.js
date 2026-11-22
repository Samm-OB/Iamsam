import adcomat from '../assets/projects/adcomat.png'
import naijalist from '../assets/projects/naijalist.png'
import anniekuku from '../assets/projects/anniekuku.png'
import punpoets from '../assets/projects/punpoets.png'
import finforecast from '../assets/projects/FinforecastImage.png'
import fintech1a from '../assets/projects/fintech1image1.png'
import fintech1b from '../assets/projects/fintech1image2.png'

// `folder` decides which subfolder of Projects the file lives in.
// Projects with screenshots open in the Photos viewer; ones without open as a document.
export const projects = [
  {
    id: 'phishscope',
    name: 'PhishScope — Phishing URL Threat Analyzer',
    folder: 'Security',
    description:
      'A full-stack security tool that analyzes URLs for phishing and malicious indicators, aggregating multi-vendor threat verdicts through the VirusTotal API and surfacing per-vendor risk breakdowns.\n\nAn interactive analyst dashboard presents reputation scores and detection details to support rapid triage of suspicious links, directly relevant to email security and threat investigation.',
    tech: ['Flask', 'Next.js', 'VirusTotal API'],
    link: null,
    features: ['Multi-vendor threat verdicts', 'Per-vendor risk breakdown', 'Analyst triage dashboard'],
    images: [],
  },
  {
    id: 'segmentation',
    name: 'Point-Supervised Remote Sensing Segmentation',
    folder: 'Data Science',
    description:
      'Implemented a custom Partial Cross-Entropy loss with focal weighting to train segmentation models from sparse point annotations, reducing labeling cost by up to 20x. SegFormer-B2 reached 72.59% mIoU at 5% label density.',
    tech: ['Python', 'PyTorch', 'HuggingFace'],
    link: null,
    features: ['Partial Cross-Entropy loss with focal weighting', 'Up to 20x lower labeling cost', '72.59% mIoU at 5% label density'],
    images: [],
  },
  {
    id: 'rag',
    name: 'RAG & AI Agentic Pipeline',
    folder: 'Data Science',
    description:
      'A production Retrieval-Augmented Generation pipeline with structured ingestion and multi-step reasoning, improving retrieval and matching efficiency by 60%.',
    tech: ['Python', 'LangChain', 'Vector DB'],
    link: null,
    features: ['Structured ingestion', 'Multi-step reasoning', '60% better retrieval & matching'],
    images: [],
  },
  {
    id: 'adcomat',
    name: 'ADCOMAT',
    folder: 'Websites',
    description:
      'ADCOMAT is a digital marketing automation platform built to help businesses streamline, manage, and optimize their advertising campaigns. It offers a centralized dashboard for campaign execution, performance tracking, and analytics, enabling data-driven decisions and scalable growth.',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    link: 'https://adcomat.vercel.app/',
    features: [],
    images: [adcomat],
  },
  {
    id: 'naijalist',
    name: 'NaijaList',
    folder: 'Websites',
    description:
      'NaijaList is a Nigeria-focused classifieds and marketplace platform that connects buyers and sellers nationwide. Users can post and discover listings including jobs, services, trade-by-barter deals, and product sales.\n\nThe platform integrates KYC verification and geo-location mapping to improve trust, allowing users to interact with verified individuals within specific regions.',
    tech: ['React', 'JavaScript', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
    link: 'https://naija-list.vercel.app/',
    features: ['KYC Verification', 'Geo-location Mapping', 'Live Listings'],
    images: [naijalist],
  },
  {
    id: 'anniekuku',
    name: 'Anniekuku',
    folder: 'Websites',
    description:
      'Anniekuku is a modern e-commerce platform for discovering and purchasing handcrafted fine jewelry. It delivers a visually rich shopping experience with curated collections, advanced filtering, and optimized media handling for seamless browsing.',
    tech: ['React', 'JavaScript', 'Tailwind CSS', 'PostgreSQL', 'Cloudinary'],
    link: 'https://anniekuku-frontend.vercel.app/',
    features: ['Product Catalog', 'Category Filtering', 'Image Optimization'],
    images: [anniekuku],
  },
  {
    id: 'punpoets',
    name: 'Punpoets',
    folder: 'Websites',
    description:
      'Punpoets is a creative platform that connects poets, writers, and clients through content sharing and booking. Poets can showcase portfolios, publish blog posts, and receive bookings, while users can discover and hire talent for events and projects.',
    tech: ['React', 'Firebase', 'Express', 'Socket.io'],
    link: 'https://punpoets.vercel.app/',
    features: ['Poet Profiles', 'Booking System', 'Real-time Interaction'],
    images: [punpoets],
  },
  {
    id: 'forecast',
    name: 'Multi-Model Financial Forecasting',
    folder: 'Data Science',
    description:
      'An end-to-end financial forecasting system integrating GARCH(1,1), ARIMA-GARCH, and a custom LSTM-GNN hybrid with Graph Attention and Transformer encoders.\n\nThe system fetches live and historical stock data (Yahoo Finance), orchestrates model training using Celery, and stores probabilistic forecasts (mean, volatility, standard deviation) in PostgreSQL.\n\nThe hybrid model, built with TensorFlow and TensorFlow Probability, outputs full predictive distributions using negative log-likelihood loss and mixed-precision training, achieving a 98% reduction in training loss.\n\nA FastAPI backend serves predictions and metrics, while a React + Tailwind frontend provides interactive visualizations for model comparison. Fully containerized with Docker, Redis and Celery.',
    tech: ['Python', 'TensorFlow', 'TensorFlow Probability', 'Scikit-learn', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'React', 'Tailwind CSS'],
    link: 'https://github.com/Samm-OB/Forecast',
    features: ['Multi-model Forecasting', 'Probabilistic Predictions', 'Real-time Data Pipeline', 'Interactive Visualization Dashboard'],
    images: [finforecast],
  },
  {
    id: 'fintech1',
    name: 'Fintech Template 1',
    folder: 'Templates',
    description:
      'A clean and modern fintech website template designed for startups and financial platforms. It features a responsive layout, intuitive navigation, and essential pages for showcasing financial products and services.',
    tech: ['React', 'Tailwind CSS', 'HTML'],
    link: 'https://fintech1.vercel.app/',
    features: ['Landing Page', 'About Page', 'Custom Error Page'],
    images: [fintech1a, fintech1b],
  },
]
