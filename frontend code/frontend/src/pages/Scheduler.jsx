import React, { useState, useEffect } from 'react';
import { 
  IoAddOutline, 
  IoLogoFacebook, 
  IoLogoInstagram, 
  IoLogoLinkedin, 
  IoLogoTwitter,
  IoImageOutline,
  IoVideocamOutline,
  IoEyeOutline,
  IoRefreshOutline,
  IoTrashOutline,
  IoCreateOutline
} from 'react-icons/io5';

import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import { useNotification } from '../hooks/useNotification';
import schedulerService from '../services/schedulerService';
import campaignService from '../services/campaignService';
import { useAuth } from '../hooks/useAuth';

const PLATFORMS = [
  { name: 'Facebook', value: 'facebook', icon: IoLogoFacebook, color: 'text-[#1877F2] border-[#1877F2]' },
  { name: 'Instagram', value: 'instagram', icon: IoLogoInstagram, color: 'text-[#E4405F] border-[#E4405F]' },
  { name: 'LinkedIn', value: 'linkedin', icon: IoLogoLinkedin, color: 'text-[#0A66C2] border-[#0A66C2]' },
  { name: 'Twitter', value: 'twitter', icon: IoLogoTwitter, color: 'text-slate-800 dark:text-slate-200 border-slate-700' }
];

const Scheduler = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  const [posts, setPosts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePlatformFilter, setActivePlatformFilter] = useState('all');
  const [editingPostId, setEditingPostId] = useState(null);

  // New Post Form
  const [formData, setFormData] = useState({
    platform: 'facebook',
    content: '',
    mediaUrl: '',
    mediaType: '',
    scheduledDate: '',
    scheduledTime: '',
    recurring: 'none',
    status: 'scheduled'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await schedulerService.getScheduledPosts();
      const campaignsData = await campaignService.getCampaigns();
      setPosts(postsData);
      setCampaigns(campaignsData);
    } catch (err) {
      notifyError("Failed to fetch scheduler data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPlatform = (platform) => {
    setFormData(prev => ({ ...prev, platform }));
  };

  // Mock Upload Handler (assigns random high quality Unsplash photos as upload results)
  const handleMockUpload = (type) => {
    const images = [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
      "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800"
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    
    setFormData(prev => ({
      ...prev,
      mediaUrl: type === 'image' ? images[randomIndex] : 'https://www.w3schools.com/html/mov_bbb.mp4',
      mediaType: type
    }));
    success(`Mock ${type} file uploaded successfully!`);
  };

  const clearUploadedMedia = () => {
    setFormData(prev => ({ ...prev, mediaUrl: '', mediaType: '' }));
  };

  const openScheduleModal = (dateStr = '') => {
    // Determine default date format YYYY-MM-DD
    const defaultDate = dateStr || new Date().toISOString().split('T')[0];
    
    setEditingPostId(null);
    setFormData({
      platform: 'facebook',
      content: '',
      mediaUrl: '',
      mediaType: '',
      scheduledDate: defaultDate,
      scheduledTime: '12:00',
      recurring: 'none',
      status: 'scheduled'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPostId(post.id);
    setFormData({
      platform: post.platform,
      content: post.content,
      mediaUrl: post.mediaUrl || '',
      mediaType: post.mediaType || '',
      scheduledDate: post.scheduledDate,
      scheduledTime: post.scheduledTime,
      recurring: post.recurring || 'none',
      status: post.status || 'scheduled'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.content.trim()) errors.content = 'Post caption is required.';
    if (!formData.scheduledDate) errors.scheduledDate = 'Date is required.';
    if (!formData.scheduledTime) errors.scheduledTime = 'Time is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingPostId) {
        // Edit Mode: PUT to schedulerService
        const updatedPost = await schedulerService.updatePost(editingPostId, formData);
        setPosts(prev => prev.map(p => p.id === editingPostId ? updatedPost : p));
        success("Post updated successfully!");
      } else {
        // Create Mode
        const newPost = await schedulerService.schedulePost(formData);
        setPosts(prev => [newPost, ...prev]);
        success("Post scheduled successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      notifyError(editingPostId ? "Failed to update post." : "Failed to schedule post.");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await schedulerService.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      success("Post removed from scheduler.");
    } catch (err) {
      notifyError("Failed to delete post.");
    }
  };

  const filteredQueue = posts.filter(post => {
    const matchesPlatform = activePlatformFilter === 'all' || post.platform === activePlatformFilter;
    const isFuture = post.status === 'scheduled';
    return matchesPlatform && isFuture;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Scheduler"
        description="Build post queues, verify channel previews, and schedule recurring media updates."
        action={
          <Button variant="primary" icon={IoAddOutline} onClick={() => openScheduleModal()}>
            New Post
          </Button>
        }
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left: Calendar View */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Calendar 
              posts={posts} 
              campaigns={campaigns}
              onSelectDate={(dateStr) => openScheduleModal(dateStr)}
              onSelectPost={(post) => openEditModal(post)}
            />
          </div>

          {/* Right: Posts Queue List */}
          <div className="flex flex-col gap-6">
            
            {/* Filter Card */}
            <Card
              title="Post Queue"
              subtitle="Filter future updates waiting to publish"
            >
              {/* Platform Filters */}
              <div className="flex flex-wrap gap-2 mt-2 select-none">
                <button
                  onClick={() => setActivePlatformFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    activePlatformFilter === 'all'
                      ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-dark-900 dark:border-slate-200 shadow-sm'
                      : 'bg-white dark:bg-dark-800 border-slate-200 dark:border-dark-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                {PLATFORMS.map((plat) => (
                  <button
                    key={plat.value}
                    onClick={() => setActivePlatformFilter(plat.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      activePlatformFilter === plat.value
                        ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-500/10'
                        : 'bg-white dark:bg-dark-800 border-slate-200 dark:border-dark-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <plat.icon />
                    {plat.name}
                  </button>
                ))}
              </div>

              {/* Queue Items */}
              <div className="flex flex-col gap-3.5 mt-5 max-h-[480px] overflow-y-auto pr-1">
                {filteredQueue.length > 0 ? (
                  filteredQueue.map((post) => {
                    const platInfo = PLATFORMS.find(p => p.value === post.platform.toLowerCase()) || { icon: IoLogoFacebook, color: 'text-slate-500' };
                    const PlatIcon = platInfo.icon;
                    return (
                      <div 
                        key={post.id}
                        className="p-4 rounded-xl border border-slate-100 dark:border-dark-700/50 bg-slate-50/30 dark:bg-dark-900/10 flex items-start gap-3.5 hover:shadow-premium transition-all"
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700/40 shadow-sm ${platInfo.color}`}>
                          <PlatIcon />
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                            {post.content}
                          </p>
                          {post.mediaUrl && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-slate-200/50 max-h-[80px]">
                              <img 
                                src={post.mediaUrl} 
                                alt="Post media attachment" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                            <span className="bg-slate-100 dark:bg-dark-800 px-2 py-0.5 rounded">
                              {post.scheduledDate} @ {post.scheduledTime}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openEditModal(post)}
                                className="text-slate-400 hover:text-primary-500 p-1 rounded transition-colors text-xs"
                                title="Edit scheduled post"
                              >
                                <IoCreateOutline />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors text-xs"
                                title="Delete scheduled post"
                              >
                                <IoTrashOutline />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No scheduled posts in the queue.
                  </div>
                )}
              </div>
            </Card>

          </div>

        </div>
      )}

      {/* Post Creator Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Social Media Post"
        maxWidth="max-w-4xl"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              Schedule Update
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
          
          {/* Left panel: Creator editor */}
          <div className="flex flex-col gap-4">
            
            {/* Platform selection label */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
                Target Platform
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PLATFORMS.map((plat) => {
                  const Icon = plat.icon;
                  const isSelected = formData.platform === plat.value;
                  return (
                    <button
                      key={plat.value}
                      type="button"
                      onClick={() => handleSelectPlatform(plat.value)}
                      className={`py-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50/10 dark:bg-primary-950/10 text-primary-500 shadow-sm'
                          : 'border-slate-200 dark:border-dark-700/60 text-slate-500 hover:bg-slate-50 dark:hover:bg-dark-900/10'
                      }`}
                    >
                      <Icon className="text-base" />
                      <span>{plat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text caption textarea */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="content" className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
                Post Caption
              </label>
              <textarea
                id="content"
                name="content"
                placeholder="What would you like to share? Write post copy, hashes, or tags..."
                value={formData.content}
                onChange={handleInputChange}
                rows={5}
                className={`w-full rounded-xl text-sm font-medium border bg-white dark:bg-dark-900/40 text-slate-800 dark:text-slate-100 pl-4 pr-4 py-3 focus:outline-none transition-all duration-200 custom-input ${
                  formErrors.content ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 dark:border-dark-700/60 focus:border-primary-500'
                }`}
              />
              {formErrors.content && (
                <span className="text-xs text-rose-500 font-medium select-none">{formErrors.content}</span>
              )}
            </div>

            {/* Media Upload Buttons */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
                Attachment (Media)
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={IoImageOutline}
                  onClick={() => handleMockUpload('image')}
                >
                  Add Photo
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={IoVideocamOutline}
                  onClick={() => handleMockUpload('video')}
                >
                  Add Video
                </Button>
                {formData.mediaUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={IoTrashOutline} 
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                    onClick={clearUploadedMedia}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Date & Time grids */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                label="Post Date"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                error={formErrors.scheduledDate}
                required
              />

              <Input
                id="scheduledTime"
                name="scheduledTime"
                type="time"
                label="Post Time"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                error={formErrors.scheduledTime}
                required
              />
            </div>

            {/* Recurring & Draft switches */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="recurring" className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
                  Recurring Schedule
                </label>
                <select
                  id="recurring"
                  name="recurring"
                  value={formData.recurring}
                  onChange={handleInputChange}
                  className="w-full rounded-xl text-sm font-medium border border-slate-200 dark:border-dark-700/60 bg-white dark:bg-dark-900/40 text-slate-800 dark:text-slate-100 px-4 py-3 focus:outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
                >
                  <option value="none">One-time Post</option>
                  <option value="daily">Daily Recurring</option>
                  <option value="weekly">Weekly Recurring</option>
                  <option value="monthly">Monthly Recurring</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
                  Publish State
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-xl text-sm font-medium border border-slate-200 dark:border-dark-700/60 bg-white dark:bg-dark-900/40 text-slate-800 dark:text-slate-100 px-4 py-3 focus:outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
                >
                  <option value="scheduled">Schedule Post</option>
                  <option value="draft">Save as Draft</option>
                </select>
              </div>
            </div>

          </div>

          {/* Right panel: Post mockup feed preview */}
          <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-dark-700/50 pt-5 md:pt-0 md:pl-6 bg-slate-50/20 dark:bg-dark-900/5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <IoEyeOutline /> Live Mockup Feed Preview
            </span>
            
            {/* Live Card Previews mapping corresponding templates */}
            <div className="flex-1 flex items-center justify-center py-6 min-h-[300px]">
              
              <div className="w-full max-w-sm bg-white dark:bg-dark-800 rounded-xl border border-slate-200/60 dark:border-dark-700 shadow-premium overflow-hidden font-sans">
                {/* Platform Header identifier */}
                <div className="px-4 py-3.5 border-b border-slate-100 dark:border-dark-700/40 bg-slate-50/50 dark:bg-dark-900/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      PLATFORMS.find(p => p.value === formData.platform)?.color || 'bg-slate-500 text-white'
                    }`}>
                      {React.createElement(PLATFORMS.find(p => p.value === formData.platform)?.icon || IoLogoFacebook)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {formData.platform} Feed Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10 uppercase">
                    Mock
                  </span>
                </div>

                {/* Feed user metadata */}
                <div className="p-4 flex items-center gap-3">
                  <img 
                    src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80"} 
                    alt="User profile" 
                    className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-slate-100 dark:ring-dark-700/20"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
                      {user?.name || "Jane Doe"}
                    </h5>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                      {formData.scheduledDate || "Today"} @ {formData.scheduledTime || "Now"} • Sponsored
                    </p>
                  </div>
                </div>

                {/* Text body */}
                <div className="px-4 pb-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words whitespace-pre-line">
                    {formData.content || "Your post description will render here. Start typing in the caption input..."}
                  </p>
                </div>

                {/* Media Preview Box */}
                {formData.mediaUrl && (
                  <div className="w-full bg-slate-50 dark:bg-dark-900 border-t border-b border-slate-100 dark:border-dark-700/50 overflow-hidden flex items-center justify-center max-h-[220px]">
                    {formData.mediaType === 'image' ? (
                      <img 
                        src={formData.mediaUrl} 
                        alt="Preview upload" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video 
                        src={formData.mediaUrl} 
                        controls 
                        className="w-full max-h-[220px] object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Feed actions footer */}
                <div className="px-4 py-3 border-t border-slate-100 dark:border-dark-700/40 flex justify-between text-slate-400 text-sm select-none">
                  <span>Like</span>
                  <span>Comment</span>
                  <span>Share</span>
                  <span>Send</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </Modal>

    </div>
  );
};

export default Scheduler;
