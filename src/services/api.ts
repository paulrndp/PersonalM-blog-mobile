// API Client for PersonalM-blog-api

export const DEFAULT_API_URL = "http://10.0.2.2:5000/api/v1"; // 10.0.2.2 for Android emulator, localhost for iOS

let currentApiUrl = DEFAULT_API_URL;

export function setApiUrl(url: string) {
  currentApiUrl = url;
}

export function getApiUrl(): string {
  return currentApiUrl;
}

export interface Story {
  id: number;
  title: string;
  desc: string;
  tags?: string | null;
  genre?: string | null;
  views?: number | null;
  totalChapters?: number | null;
  createdAt: string;
  chapters?: ChapterSummary[];
}

export interface ChapterSummary {
  id: number;
  title: string;
  views?: number | null;
  createdAt: string;
}

export interface ChapterDetail {
  id: number;
  storyId: number;
  title: string;
  content: string;
  views?: number | null;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category: "Blog" | "Random" | "Both";
  status: string;
  views?: number | null;
  createdAt: string;
}

// Fallback sample data for offline reading
const FALLBACK_STORIES: Story[] = [
  {
    id: 1,
    title: "The Whispering Pines",
    desc: "A heartfelt story of discovering one's roots and the unexpected journeys that define who we become.",
    genre: "Romance & Drama",
    tags: "#novel #romance #journey",
    views: 142,
    totalChapters: 2,
    createdAt: new Date().toISOString(),
    chapters: [
      { id: 1, title: "Chapter 1: A Cold Beginning", views: 89, createdAt: new Date().toISOString() },
      { id: 2, title: "Chapter 2: Footsteps in the Snow", views: 53, createdAt: new Date().toISOString() },
    ],
  },
  {
    id: 2,
    title: "Echoes of Eternity",
    desc: "An epic tale across mystical realms, unraveling long-forgotten secrets of a hidden realm and ancient guardian stones.",
    genre: "Fantasy & Mystery",
    tags: "#fantasy #magic #chronicles",
    views: 215,
    totalChapters: 2,
    createdAt: new Date().toISOString(),
    chapters: [
      { id: 3, title: "Prologue: The Awakening Stone", views: 120, createdAt: new Date().toISOString() },
      { id: 4, title: "Chapter 1: The Keeper's Vow", views: 95, createdAt: new Date().toISOString() },
    ],
  },
];

const FALLBACK_POSTS: Post[] = [
  {
    id: 1,
    title: "Finding Joy in the Little Things",
    content: "Life moves fast, and often we get caught up in big deadlines and future plans. But today, I took an hour just sitting with a warm cup of jasmine tea, listening to the gentle drizzle against the windowpane. True peace isn't found in reaching the destination; it is found in the quiet moments between the milestones.",
    category: "Blog",
    status: "published",
    views: 64,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Late Night Musings on Stargazing",
    content: "Have you ever looked at the stars and wondered where all the stray thoughts go at 2 AM? Just a quick reflection before calling it a night. The cosmos always has a way of putting our worries into perspective.",
    category: "Random",
    status: "published",
    views: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Behind the Scenes: Outlining My Next Story",
    content: "Many readers have asked about my writing routine and how I keep character arcs consistent across dozens of chapters. Here is my 3-step process: character maps, conflict escalation grids, and ruthless revision sprints!",
    category: "Both",
    status: "published",
    views: 98,
    createdAt: new Date().toISOString(),
  },
];

export async function fetchStoriesApi(): Promise<Story[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${currentApiUrl}/stories`, { signal: controller.signal });
    clearTimeout(timeout);
    const json = await res.json();
    if (json.success && json.data?.length > 0) return json.data;
    return FALLBACK_STORIES;
  } catch {
    return FALLBACK_STORIES;
  }
}

export async function fetchStoryDetailApi(id: number): Promise<Story | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${currentApiUrl}/stories/${id}`, { signal: controller.signal });
    clearTimeout(timeout);
    const json = await res.json();
    if (json.success) return json.data;
    return FALLBACK_STORIES.find((s) => s.id === id) || null;
  } catch {
    return FALLBACK_STORIES.find((s) => s.id === id) || null;
  }
}

export async function fetchChapterApi(id: number): Promise<{
  chapter: ChapterDetail;
  prev: { id: number; title: string } | null;
  next: { id: number; title: string } | null;
} | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${currentApiUrl}/stories/chapters/${id}`, { signal: controller.signal });
    clearTimeout(timeout);
    const json = await res.json();
    if (json.success) return json.data;
  } catch {
    // fallback
  }

  // Fallback chapter content
  return {
    chapter: {
      id,
      storyId: 1,
      title: id === 1 ? "Chapter 1: A Cold Beginning" : "Chapter 2: Footsteps in the Snow",
      content:
        id === 1
          ? "The winter air held a crisp promise. Hannah tightened her woolen scarf around her neck and looked up at the quiet canopy of tall pine trees. Each step crunching beneath her boots reminded her of winters long past in the quiet countryside.\n\nShe had left the city behind, carrying nothing but a worn leather bag and a box of old letters that had arrived unaddressed to her doorstep."
          : "By mid-afternoon, the sun barely broke through the thick gray clouds. Ahead lay an old cabin with light spilling from a frosted window. Smoke curled lazily from the stone chimney.\n\n'Someone is still here,' she whispered to herself, feeling a mix of trepidation and curiosity wash over her.",
      views: 89,
      createdAt: new Date().toISOString(),
    },
    prev: id === 2 ? { id: 1, title: "Chapter 1: A Cold Beginning" } : null,
    next: id === 1 ? { id: 2, title: "Chapter 2: Footsteps in the Snow" } : null,
  };
}

export async function fetchPostsApi(category?: string): Promise<Post[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const url = category && category !== "All" ? `${currentApiUrl}/posts?category=${category}` : `${currentApiUrl}/posts`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const json = await res.json();
    if (json.success && json.data?.length > 0) return json.data;
    return FALLBACK_POSTS;
  } catch {
    return FALLBACK_POSTS;
  }
}
