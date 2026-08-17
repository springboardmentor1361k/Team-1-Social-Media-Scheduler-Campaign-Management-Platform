import api from './api';

const DEFAULT_POSTS = [
  {
    id: "pst_1",
    platform: "linkedin",
    content: "🚀 Exciting news! Antigravity AI configurations are launching tomorrow. Streamline your agent workflow in minutes. #DevOps #AI #Cloud",
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    mediaType: "image",
    scheduledDate: "2026-07-10",
    scheduledTime: "09:00",
    status: "scheduled",
    recurring: "none"
  },
  {
    id: "pst_2",
    platform: "instagram",
    content: "Take a peek at our sleek design refresh! Aesthetics matter, and we are dialing it up to eleven. 🎨✨ #UIDesign #WebDev #SaaS",
    mediaUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
    mediaType: "image",
    scheduledDate: "2026-07-12",
    scheduledTime: "14:30",
    status: "scheduled",
    recurring: "none"
  },
  {
    id: "pst_3",
    platform: "twitter",
    content: "What's your favorite framework for React state management in 2026? Context? Zustand? Signals? 👇",
    mediaUrl: null,
    mediaType: null,
    scheduledDate: "2026-07-09",
    scheduledTime: "18:00",
    status: "published",
    recurring: "none"
  },
  {
    id: "pst_4",
    platform: "facebook",
    content: "Join our next developer community call on Friday! We'll talk React 19, web performance, and modern dashboards.",
    mediaUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    mediaType: "image",
    scheduledDate: "2026-07-11",
    scheduledTime: "11:00",
    status: "scheduled",
    recurring: "weekly"
  },
  {
    id: "pst_5",
    platform: "linkedin",
    content: "Weekly tip: Minimize side effects in React useEffect hook by using refs or custom dependency states. Clean code leads to fast web apps!",
    mediaUrl: null,
    mediaType: null,
    scheduledDate: "2026-07-07",
    scheduledTime: "10:00",
    status: "published",
    recurring: "weekly"
  },
  {
    id: "pst_6",
    platform: "instagram",
    content: "Visual storytelling drives 80% higher conversion rates in SaaS dashboards. Here is how we design for impact.",
    mediaUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
    mediaType: "image",
    scheduledDate: "2026-07-08",
    scheduledTime: "16:00",
    status: "failed",
    recurring: "none"
  }
];

const getLocalStoragePosts = () => {
  const data = localStorage.getItem('socialpilot_posts');
  if (!data) {
    localStorage.setItem('socialpilot_posts', JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
  return JSON.parse(data);
};

const saveLocalStoragePosts = (posts) => {
  localStorage.setItem('socialpilot_posts', JSON.stringify(posts));
};

const mapPostToFrontend = (apiPost) => {
  if (!apiPost) return null;
  const dateTime = apiPost.scheduled_time || "";
  const [date, time] = dateTime.includes("T") ? dateTime.split("T") : [dateTime, "12:00:00"];
  return {
    id: apiPost.id,
    campaignId: apiPost.campaign_id || "",
    platform: apiPost.platform ? apiPost.platform.toLowerCase() : "facebook",
    content: apiPost.content || "",
    mediaUrl: apiPost.media_url || apiPost.mediaUrl || null,
    mediaType: apiPost.media_type || apiPost.mediaType || null,
    scheduledDate: date,
    scheduledTime: time.substring(0, 5),
    status: apiPost.status || "scheduled",
    recurring: apiPost.recurring || "none"
  };
};

const mapPostToApi = (frontendPost) => {
  const scheduled_time = `${frontendPost.scheduledDate}T${frontendPost.scheduledTime}:00`;
  return {
    campaign_id: frontendPost.campaignId || null,
    platform: frontendPost.platform,
    content: frontendPost.content,
    media_url: frontendPost.mediaUrl || null,
    media_type: frontendPost.mediaType || null,
    scheduled_time: scheduled_time,
    status: frontendPost.status || "scheduled",
    recurring: frontendPost.recurring || "none"
  };
};

const schedulerService = {
  getScheduledPosts: async () => {
    try {
      const response = await api.get('/scheduler');
      if (Array.isArray(response.data)) {
        return response.data.map(mapPostToFrontend);
      }
      return response.data ? [mapPostToFrontend(response.data)] : [];
    } catch (error) {
      console.warn("[API MOCK] Using fallback localStorage scheduled posts");
      return getLocalStoragePosts();
    }
  },

  schedulePost: async (postData) => {
    try {
      const apiPost = mapPostToApi(postData);
      const response = await api.post('/scheduler/', apiPost);
      return mapPostToFrontend(response.data);
    } catch (error) {
      console.warn("[API MOCK] Scheduling post in localStorage");
      const posts = getLocalStoragePosts();
      const newPost = {
        ...postData,
        id: `pst_${Date.now()}`,
        status: postData.status || "scheduled"
      };
      posts.push(newPost);
      saveLocalStoragePosts(posts);
      return newPost;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const apiPost = mapPostToApi(postData);
      const response = await api.put(`/scheduler/${id}`, apiPost);
      return mapPostToFrontend(response.data);
    } catch (error) {
      console.warn("[API MOCK] Updating post in localStorage");
      const posts = getLocalStoragePosts();
      const index = posts.findIndex(p => p.id === id);
      if (index === -1) throw new Error("Post not found");
      const updatedPost = {
        ...posts[index],
        ...postData
      };
      posts[index] = updatedPost;
      saveLocalStoragePosts(posts);
      return updatedPost;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await api.delete(`/scheduler/${id}`);
      return response.data;
    } catch (error) {
      console.warn("[API MOCK] Deleting post from localStorage");
      let posts = getLocalStoragePosts();
      posts = posts.filter(p => p.id !== id);
      saveLocalStoragePosts(posts);
      return { success: true };
    }
  }
};

export default schedulerService;
