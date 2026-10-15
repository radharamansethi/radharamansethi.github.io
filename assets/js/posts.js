// Single source of truth for blog posts.
// Add a new entry here (newest first) and create blog/<slug>/index.html.
window.POSTS = [
  {
    slug: "event-loop-explained",
    title: "The JavaScript Event Loop, Explained Like You're Waiting for Chai",
    excerpt: "Call stack, task queue, microtasks — why setTimeout(fn, 0) isn't really zero, and why your Promise logs first.",
    date: "2026-09-28",
    readTime: 7,
    tags: ["JavaScript", "Fundamentals"],
    emoji: "☕",
    cover: "cover-4",
  },
  {
    slug: "nextjs-docker-small-images",
    title: "Shipping a Next.js App in a Tiny Docker Image",
    excerpt: "How multi-stage builds and Next.js standalone output took my image from over a gigabyte to something I'm not embarrassed to push.",
    date: "2026-08-12",
    readTime: 8,
    tags: ["Docker", "Next.js", "DevOps"],
    emoji: "🐳",
    cover: "cover-1",
  },
  {
    slug: "git-habits",
    title: "7 Git Habits That Saved Me From Myself",
    excerpt: "Small, boring habits — atomic commits, --force-with-lease, reflog — that turned Git from a source of panic into a safety net.",
    date: "2026-06-03",
    readTime: 6,
    tags: ["Git", "Productivity"],
    emoji: "🌿",
    cover: "cover-3",
  },
  {
    slug: "learning-in-public",
    title: "Why I Started Learning in Public",
    excerpt: "Writing about what I'm learning — before I feel like an expert — has been the single biggest accelerator for my growth as an engineer.",
    date: "2026-04-18",
    readTime: 5,
    tags: ["Career", "Personal Growth"],
    emoji: "🚀",
    cover: "cover-2",
  },
];
