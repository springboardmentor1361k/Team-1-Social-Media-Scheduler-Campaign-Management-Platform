import React, { useState, useEffect } from 'react';
import { IoBarChartOutline, IoTrendingUpOutline, IoPeopleOutline, IoGlobeOutline, IoArrowRedoOutline } from 'react-icons/io5';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useNotification } from '../hooks/useNotification';
import analyticsService from '../services/analyticsService';

const Analytics = () => {
  const { error: notifyError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getAnalytics();
        setData(res);
      } catch (err) {
        notifyError("Failed to fetch analytics datasets.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return <Loader />;
  }

  const { overallSummary, monthlyGrowth, engagementTimeline, platformComparison, engagementRates } = data;

  const COLORS = ['#1877F2', '#E4405F', '#0A66C2', '#1DA1F2'];

  return (
    <div className="flex flex-col gap-6 select-none">
      <PageHeader
        title="Analytics & Reporting"
        description="Review social media engagement, click conversions, followers growth, and ROI ratios."
        action={
          <Button variant="outline" size="sm" icon={IoArrowRedoOutline} onClick={() => window.print()}>
            Export PDF Report
          </Button>
        }
      />

      {/* KPI Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Reach Growth"
          value={overallSummary.totalReach.value}
          change={overallSummary.totalReach.change}
          trend={overallSummary.totalReach.trend}
          icon={IoGlobeOutline}
        />
        <StatsCard
          title="Followers Acquired"
          value={overallSummary.totalFollowers.value}
          change={overallSummary.totalFollowers.change}
          trend={overallSummary.totalFollowers.trend}
          icon={IoPeopleOutline}
        />
        <StatsCard
          title="Total Clicks"
          value={overallSummary.totalClicks.value}
          change={overallSummary.totalClicks.change}
          trend={overallSummary.totalClicks.trend}
          icon={IoBarChartOutline}
        />
        <StatsCard
          title="Return on Investment"
          value={overallSummary.roi.value}
          change={overallSummary.roi.change}
          trend={overallSummary.roi.trend}
          icon={IoTrendingUpOutline}
        />
      </div>

      {/* Row 1: Engagement growth & platform distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Engagement timeline AreaChart */}
        <Card
          title="Channel Engagement Rate"
          subtitle="Monthly breakdown of engagement metrics across networks"
          className="lg:col-span-2"
        >
          <div className="h-80 w-full mt-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1877F2" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1877F2" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E4405F" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#E4405F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.2)"/>
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
                <Legend iconType="circle" fontSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFb)" name="Facebook"/>
                <Area type="monotone" dataKey="instagram" stroke="#E4405F" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInsta)" name="Instagram"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform Share Pie/Donut Chart */}
        <Card
          title="Share of Voice"
          subtitle="Proportion of audience clicks per channel"
        >
          <div className="h-80 w-full mt-4 flex flex-col justify-between select-none">
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={platformComparison}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformComparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Labels and legends */}
            <div className="flex flex-col gap-1.5 mt-2 px-2 text-xs">
              {platformComparison.map((entry, idx) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>

      {/* Row 2: Monthly growth LineChart & Platform engagement BarChart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Platform conversion rates BarChart */}
        <Card
          title="Conversion Rates (%)"
          subtitle="Interaction rates across networks"
        >
          <div className="h-80 w-full mt-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementRates} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.2)"/>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
                <Bar dataKey="rate" radius={[6, 6, 0, 0]} name="Engagement Rate %">
                  {engagementRates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Growth reach vs impressions LineChart */}
        <Card
          title="Brand Impression vs Reach"
          subtitle="Monthly overview of audience impression and reach statistics"
          className="lg:col-span-2"
        >
          <div className="h-80 w-full mt-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.2)"/>
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
                <Legend iconType="circle" fontSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="reach" stroke="#38bdf8" strokeWidth={2.5} name="Total Reach" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="followers" stroke="#0ea5e9" strokeWidth={2.5} name="Followers Growth" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Row 3: Campaign Performance Analytics Details Table */}
      <Card
        title="Top Campaigns Performance"
        subtitle="Detailed conversions of running marketing campaigns"
      >
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-700/40 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-4.5 px-4">Campaign Name</th>
                <th className="py-4.5 px-4">Connected Network</th>
                <th className="py-4.5 px-4 text-right">Reach Gained</th>
                <th className="py-4.5 px-4 text-right">Total Click Conversions</th>
                <th className="py-4.5 px-4 text-right">Return on Investment (ROI)</th>
                <th className="py-4.5 px-4 text-right">Conversion Ratio (CR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-700/25 font-medium text-slate-700 dark:text-slate-300">
              {[
                { name: "Summer Product Launch 2026", platform: "LinkedIn, Facebook", reach: "482.4K", clicks: "12,492", roi: "348%", cr: "4.8%" },
                { name: "Developer Conference Drive", platform: "LinkedIn, Twitter", reach: "284.1K", clicks: "8,924", roi: "280%", cr: "3.2%" },
                { name: "Q3 Holiday Sale Promo", platform: "Facebook, Instagram", reach: "189.5K", clicks: "4,204", roi: "185%", cr: "2.1%" },
                { name: "Brand Re-engagement Ad Set", platform: "Twitter, LinkedIn", reach: "112.0K", clicks: "2,192", roi: "120%", cr: "1.8%" }
              ].map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-dark-900/10 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">{row.name}</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{row.platform}</td>
                  <td className="py-4 px-4 text-right font-bold">{row.reach}</td>
                  <td className="py-4 px-4 text-right">{row.clicks}</td>
                  <td className="py-4 px-4 text-right text-emerald-500 font-bold">{row.roi}</td>
                  <td className="py-4 px-4 text-right font-bold">{row.cr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default Analytics;
