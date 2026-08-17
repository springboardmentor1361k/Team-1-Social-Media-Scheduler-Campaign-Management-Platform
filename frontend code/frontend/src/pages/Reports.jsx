import React, { useState, useEffect } from 'react';
import { 
  IoDocumentTextOutline, 
  IoDownloadOutline, 
  IoFilterOutline, 
  IoLogoFacebook, 
  IoLogoInstagram, 
  IoLogoLinkedin, 
  IoLogoTwitter,
  IoCalendarOutline,
  IoMegaphoneOutline
} from 'react-icons/io5';

import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useNotification } from '../hooks/useNotification';
import campaignService from '../services/campaignService';
import schedulerService from '../services/schedulerService';
import analyticsService from '../services/analyticsService';

const Reports = () => {
  const { success, error: notifyError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Filters
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [dateRange, setDateRange] = useState('30'); // '7' | '30' | '90'

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const campData = await campaignService.getCampaigns();
      const postData = await schedulerService.getScheduledPosts();
      const analData = await analyticsService.getAnalytics();

      setCampaigns(campData);
      setPosts(postData);
      setAnalytics(analData);
    } catch (err) {
      notifyError("Failed to aggregate reports dataset.");
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <IoLogoFacebook className="text-[#1877F2]" />;
      case 'instagram': return <IoLogoInstagram className="text-[#E4405F]" />;
      case 'linkedin': return <IoLogoLinkedin className="text-[#0A66C2]" />;
      case 'twitter':
      case 'twitter/x':
        return <IoLogoTwitter className="text-slate-800 dark:text-slate-200" />;
      default: return null;
    }
  };

  // Filtered metrics
  const filteredPosts = posts.filter(post => {
    const platformMatch = selectedPlatform === 'all' || post.platform.toLowerCase() === selectedPlatform.toLowerCase();
    const campaignMatch = selectedCampaign === 'all' || post.campaignId === selectedCampaign;
    return platformMatch && campaignMatch;
  });

  const filteredCampaigns = campaigns.filter(camp => {
    const platformMatch = selectedPlatform === 'all' || camp.platforms.some(p => p.toLowerCase() === selectedPlatform.toLowerCase());
    const campaignMatch = selectedCampaign === 'all' || camp.id === selectedCampaign;
    return platformMatch && campaignMatch;
  });

  // Calculate dynamic report stats
  const totalPostsCount = filteredPosts.length;
  const publishedCount = filteredPosts.filter(p => p.status === 'published').length;
  const scheduledCount = filteredPosts.filter(p => p.status === 'scheduled').length;
  const failedCount = filteredPosts.filter(p => p.status === 'failed').length;
  
  const totalBudget = filteredCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpent = filteredCampaigns.reduce((sum, c) => sum + (c.spent || 0), 0);

  // Generate CSV rows
  const handleExportCSV = (reportType) => {
    let dataToExport = [];
    let filename = "";

    if (reportType === 'campaigns') {
      if (filteredCampaigns.length === 0) {
        notifyError("No campaign records available to export.");
        return;
      }
      dataToExport = filteredCampaigns.map(c => ({
        "Campaign ID": c.id,
        "Campaign Name": c.name,
        "Objective": c.description,
        "Budget ($)": c.budget,
        "Spent ($)": c.spent,
        "Start Date": c.startDate,
        "End Date": c.endDate,
        "Status": c.status,
        "Platforms": c.platforms.join(' | ')
      }));
      filename = `Campaign_Report_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      if (filteredPosts.length === 0) {
        notifyError("No scheduled posts records available to export.");
        return;
      }
      dataToExport = filteredPosts.map(p => ({
        "Post ID": p.id,
        "Platform": p.platform,
        "Content": p.content,
        "Scheduled Date": p.scheduledDate,
        "Scheduled Time": p.scheduledTime,
        "Status": p.status,
        "Campaign ID": p.campaignId || "N/A"
      }));
      filename = `Post_Scheduler_Report_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const headers = Object.keys(dataToExport[0]);
    const csvRows = [headers.join(',')];

    for (const row of dataToExport) {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success(`${filename} exported successfully!`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-6 select-none animate-fade-in">
      <PageHeader 
        title="Reports & Exports"
        description="Compile visual summaries of campaign budgets, platform performance logs, and download CSV spreadsheets."
      />

      {/* Filter Bar Panel */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mr-2 flex-shrink-0">
          <IoFilterOutline className="text-base" />
          <span>Filters:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {/* Platform Select */}
          <div className="flex flex-col gap-1.5">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 text-slate-700 dark:text-slate-200 w-full"
            >
              <option value="all">All Platforms</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter/X</option>
            </select>
          </div>

          {/* Campaign Select */}
          <div className="flex flex-col gap-1.5">
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 text-slate-700 dark:text-slate-200 w-full"
            >
              <option value="all">All Campaigns</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Date Range Select */}
          <div className="flex flex-col gap-1.5">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/50 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 text-slate-700 dark:text-slate-200 w-full"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Aggregated Posts</span>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 font-sans">{totalPostsCount}</h2>
          </div>
          <div className="flex items-center gap-3.5 mt-4 text-[10px] text-slate-400 font-semibold border-t border-slate-50 dark:border-dark-700/20 pt-3">
            <span className="text-emerald-500">{publishedCount} Pub</span>
            <span>•</span>
            <span className="text-primary-500">{scheduledCount} Sched</span>
            <span>•</span>
            <span className="text-rose-500">{failedCount} Fail</span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Campaign Budget</span>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 font-sans">${totalBudget.toLocaleString()}</h2>
          </div>
          <div className="flex items-center justify-between mt-4 text-[10px] text-slate-400 font-semibold border-t border-slate-50 dark:border-dark-700/20 pt-3">
            <span>Spent: ${totalSpent.toLocaleString()}</span>
            <span className="text-primary-500 font-bold">{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% Burndown</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div className="w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Exports</span>
            <div className="grid grid-cols-2 gap-2.5 mt-3.5">
              <Button 
                variant="outline" 
                size="sm" 
                icon={IoDownloadOutline} 
                onClick={() => handleExportCSV('campaigns')}
                className="w-full text-center"
              >
                Campaigns
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                icon={IoDownloadOutline} 
                onClick={() => handleExportCSV('posts')}
                className="w-full text-center"
              >
                Post Logs
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Tables showing the detailed entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Campaign budget summaries */}
        <Card title="Campaign Summaries" subtitle="Budget, spent analysis, and status checks">
          {filteredCampaigns.length > 0 ? (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-dark-700/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">
                    <th className="pb-3 font-extrabold">Campaign</th>
                    <th className="pb-3 font-extrabold text-right">Budget</th>
                    <th className="pb-3 font-extrabold text-right">Spent</th>
                    <th className="pb-3 font-extrabold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((c) => (
                    <tr key={c.id} className="border-b last:border-0 border-slate-50 dark:border-dark-700/20">
                      <td className="py-3 flex items-center gap-2">
                        {c.platforms.map(p => (
                          <span key={p} className="text-sm">{getPlatformIcon(p)}</span>
                        ))}
                        <span className="font-bold truncate max-w-[150px]">{c.name}</span>
                      </td>
                      <td className="py-3 text-right font-mono">${c.budget.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono text-slate-400">${c.spent.toLocaleString()}</td>
                      <td className="py-3 text-center">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                          c.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                          c.status === 'paused' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-slate-500/10 text-slate-400'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-bold">
              No matching campaigns found.
            </div>
          )}
        </Card>

        {/* Post schedules list */}
        <Card title="Scheduler Posts Summary" subtitle="Content, schedule times, and upload states">
          {filteredPosts.length > 0 ? (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-dark-700/50 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">
                    <th className="pb-3 font-extrabold">Channel</th>
                    <th className="pb-3 font-extrabold">Caption Content</th>
                    <th className="pb-3 font-extrabold">Schedule Time</th>
                    <th className="pb-3 font-extrabold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 border-slate-50 dark:border-dark-700/20">
                      <td className="py-3">
                        <span className="text-base flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 dark:bg-dark-900">{getPlatformIcon(p.platform)}</span>
                      </td>
                      <td className="py-3 font-bold truncate max-w-[160px]" title={p.content}>{p.content}</td>
                      <td className="py-3 font-mono text-[10px] text-slate-400">{p.scheduledDate} {p.scheduledTime}</td>
                      <td className="py-3 text-center">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                          p.status === 'scheduled' ? 'bg-primary-500/10 text-primary-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-bold">
              No matching scheduled posts found.
            </div>
          )}
        </Card>

      </div>

    </div>
  );
};

export default Reports;
