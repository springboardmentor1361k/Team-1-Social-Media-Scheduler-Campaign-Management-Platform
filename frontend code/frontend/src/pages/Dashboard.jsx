import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  IoCalendarClearOutline,
  IoMegaphoneOutline,
  IoDocumentTextOutline,
  IoCheckmarkDoneOutline,
  IoAlertCircleOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoAddOutline,
  IoBarChartOutline
} from 'react-icons/io5';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';
import campaignService from '../services/campaignService';
import schedulerService from '../services/schedulerService';
import analyticsService from '../services/analyticsService';
import socialAccountService from '../services/socialAccountService';
import activityService from '../services/activityService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduled: 0,
    published: 0,
    failed: 0,
    campaignCount: 0,
    connectedAccounts: 0
  });
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const campaigns = await campaignService.getCampaigns();
        const posts = await schedulerService.getScheduledPosts();
        const analytics = await analyticsService.getAnalytics();
        const accounts = await socialAccountService.getAccounts();
        const logs = await activityService.getActivities();

        // Calculate Stats
        const total = posts.length;
        const scheduled = posts.filter(p => p.status === 'scheduled').length;
        const published = posts.filter(p => p.status === 'published').length;
        const failed = posts.filter(p => p.status === 'failed').length;

        setStats({
          totalPosts: total,
          scheduled,
          published,
          failed,
          campaignCount: campaigns.length,
          connectedAccounts: accounts.length
        });

        // Set upcoming scheduled posts
        const upcoming = posts
          .filter(p => p.status === 'scheduled')
          .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
          .slice(0, 3);
        setUpcomingPosts(upcoming);
        setSocialAccounts(accounts);
        setActivities(logs);

        // Chart data
        setChartData(analytics.engagementTimeline || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const PLATFORM_BADGES = {
    facebook: { icon: IoLogoFacebook, color: 'bg-blue-500 text-white' },
    instagram: { icon: IoLogoInstagram, color: 'bg-pink-500 text-white' },
    linkedin: { icon: IoLogoLinkedin, color: 'bg-blue-700 text-white' },
    twitter: { icon: IoLogoTwitter, color: 'bg-slate-900 dark:bg-slate-200 dark:text-dark-900 text-white' }
  };

  const getPlatformIcon = (platformName) => {
    const cfg = PLATFORM_BADGES[platformName.toLowerCase()];
    if (!cfg) return null;
    const Icon = cfg.icon;
    return (
      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs ${cfg.color}`}>
        <Icon />
      </span>
    );
  };

  const getPlatformConfig = (platform) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('facebook')) {
      return { name: 'Facebook Page', icon: IoLogoFacebook, color: 'text-[#1877F2] bg-[#1877F2]/5' };
    } else if (p.includes('instagram')) {
      return { name: 'Instagram Business', icon: IoLogoInstagram, color: 'text-[#E4405F] bg-[#E4405F]/5' };
    } else if (p.includes('linkedin')) {
      return { name: 'LinkedIn Company', icon: IoLogoLinkedin, color: 'text-[#0A66C2] bg-[#0A66C2]/5' };
    } else {
      return { name: 'Twitter Profile', icon: IoLogoTwitter, color: 'text-slate-800 dark:text-slate-100 bg-slate-500/5' };
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header section */}
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Jane'}!`}
        description="Here is what's happening with your social channels today."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={IoBarChartOutline}
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={IoAddOutline}
              onClick={() => navigate('/scheduler')}
            >
              Schedule Post
            </Button>
          </div>
        }
      />

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Scheduled"
          value={stats.scheduled}
          change="+10.5%"
          trend="up"
          icon={IoCalendarClearOutline}
        />
        <StatsCard
          title="Published Posts"
          value={stats.published}
          change="+8.3%"
          trend="up"
          icon={IoCheckmarkDoneOutline}
        />
        <StatsCard
          title="Failed Posts"
          value={stats.failed}
          change="-12.0%"
          trend="down"
          icon={IoAlertCircleOutline}
        />
        <StatsCard
          title="Active Campaigns"
          value={stats.campaignCount}
          change="+4.0%"
          trend="up"
          icon={IoMegaphoneOutline}
        />
      </div>

      {/* Main Charts & Schedule queues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Engagement Analytics Chart */}
        <Card
          title="Engagement Trends"
          subtitle="Social engagement traffic across connected platforms this week"
          className="lg:col-span-2"
        >
          <div className="h-80 w-full mt-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1877F2" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E4405F" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#E4405F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0A66C2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.2)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFb)" name="Facebook" />
                <Area type="monotone" dataKey="instagram" stroke="#E4405F" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInsta)" name="Instagram" />
                <Area type="monotone" dataKey="linkedin" stroke="#0A66C2" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLn)" name="LinkedIn" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Upcoming Posts Queue */}
        <Card
          title="Upcoming Queue"
          subtitle="Next scheduled posts waiting to be published"
          headerActions={
            <Link to="/scheduler" className="text-xs font-bold text-primary-500 hover:underline">
              View Queue
            </Link>
          }
        >
          <div className="flex flex-col gap-4 mt-2">
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-dark-700/50 hover:bg-slate-50 dark:hover:bg-dark-900/10 transition-colors flex items-start gap-3.5"
                >
                  {getPlatformIcon(post.platform)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between mt-2.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      <span>{post.scheduledDate}</span>
                      <span>{post.scheduledTime}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No upcoming scheduled posts.
              </div>
            )}
          </div>
        </Card>

      </div>

      {/* Connected Accounts & Activities Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Connected social channels */}
        <Card
          title="Connected Accounts"
          subtitle="Status of synced social media channels"
        >
          <div className="flex flex-col gap-3.5 mt-2">
            {socialAccounts.length > 0 ? (
              socialAccounts.map((account, idx) => {
                const config = getPlatformConfig(account.platform);
                const Icon = config.icon;
                return (
                  <div
                    key={account.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-dark-700/30 bg-white dark:bg-dark-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${config.color}`}>
                        <Icon />
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">{config.name}</h5>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{account.account_name || account.detail || '@Anonymous'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10">
                      {account.status || 'Connected'}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No connected accounts.
              </div>
            )}
          </div>
        </Card>

        {/* Recent logs */}
        <Card
          title="Recent Activity"
          subtitle="System logs and scheduler events history"
          className="lg:col-span-2"
        >
          <div className="flex flex-col gap-4 mt-2">
            {activities.length > 0 ? (
              activities.map((activity, idx) => {
                let icon = IoCalendarClearOutline;
                let color = 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';

                if (activity.type === 'success') {
                  icon = IoCheckmarkDoneOutline;
                  color = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
                } else if (activity.type === 'warning') {
                  icon = IoAlertCircleOutline;
                  color = 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
                } else if (activity.type === 'error') {
                  icon = IoAlertCircleOutline;
                  color = 'text-rose-500 bg-rose-50 dark:bg-rose-950/20';
                }

                const Icon = icon;

                return (
                  <div
                    key={activity.id || idx}
                    className="flex items-start gap-3.5 p-3 rounded-xl border border-slate-50 dark:border-dark-700/20"
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${color}`}>
                      <Icon />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                        {activity.log}
                      </p>
                      <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-1 block">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent activity.
              </div>
            )}
          </div>
        </Card>

      </div>

    </div>
  );
};

export default Dashboard;
