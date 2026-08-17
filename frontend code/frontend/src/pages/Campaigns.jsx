import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IoAddOutline, IoSearchOutline, IoFilterOutline } from 'react-icons/io5';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import CampaignCard from '../components/CampaignCard';
import Loader from '../components/Loader';
import { useNotification } from '../hooks/useNotification';
import campaignService from '../services/campaignService';

const Campaigns = () => {
  const { success, error: notifyError } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const searchParamVal = searchParams.get('search') || '';

  useEffect(() => {
    setSearchTerm(searchParamVal);
  }, [searchParamVal]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft',
    budget: '',
    startDate: '',
    endDate: '',
    platforms: []
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignService.getCampaigns();
      const formattedCampaigns = data.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        description: campaign.objective,
        status: campaign.status || "active",
        budget: campaign.budget,
        spent: 0,
        startDate: campaign.start_date,
        endDate: campaign.end_date,
        platforms: campaign.platform ? [campaign.platform] : [],
        postsCount: 0
      }));
      setCampaigns(formattedCampaigns);
    } catch (err) {
      notifyError("Failed to fetch campaigns.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (platform) => {
    setFormData(prev => {
      const activePlatforms = [...prev.platforms];
      if (activePlatforms.includes(platform)) {
        return { ...prev, platforms: activePlatforms.filter(p => p !== platform) };
      } else {
        return { ...prev, platforms: [...activePlatforms, platform] };
      }
    });
  };

  const openCreateModal = () => {
    setSelectedCampaign(null);
    setFormData({
      name: '',
      description: '',
      status: 'draft',
      budget: '',
      startDate: '',
      endDate: '',
      platforms: []
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      status: campaign.status,
      budget: campaign.budget,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      platforms: campaign.platforms || []
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Campaign name is required.';
    if (!formData.description.trim()) errors.description = 'Campaign description is required.';

    const budgetNum = Number(formData.budget);
    if (!formData.budget) {
      errors.budget = 'Budget is required.';
    } else if (isNaN(budgetNum) || budgetNum <= 0) {
      errors.budget = 'Budget must be a positive number.';
    }

    if (!formData.startDate) errors.startDate = 'Start date is required.';
    if (!formData.endDate) {
      errors.endDate = 'End date is required.';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date cannot be before start date.';
    }

    if (formData.platforms.length === 0) {
      errors.platforms = 'Select at least one social media platform.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (selectedCampaign) {
        // Edit Mode
        const updated = await campaignService.updateCampaign(selectedCampaign.id, {
          ...formData,
          budget: Number(formData.budget)
        });
        setCampaigns(prev => prev.map(c => c.id === selectedCampaign.id ? updated : c));
        success("Campaign updated successfully!");
      } else {
        // Create Mode
        const created = await campaignService.createCampaign({
          ...formData,
          budget: Number(formData.budget)
        });
        setCampaigns(prev => [created, ...prev]);
        success("Campaign created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      notifyError("Failed to save campaign.");
    }
  };

  const handleDelete = async () => {
    try {
      await campaignService.deleteCampaign(deleteId);
      setCampaigns(prev => prev.filter(c => c.id !== deleteId));
      success("Campaign deleted successfully.");
      setIsDeleteOpen(false);
    } catch (err) {
      notifyError("Failed to delete campaign.");
    }
  };

  // Filter and Search Logic
  const filteredCampaigns = campaigns.filter(campaign => {
    const term = (searchTerm || '').toLowerCase();
    const name = (campaign.name || '').toLowerCase();
    const title = (campaign.title || '').toLowerCase();
    const description = (campaign.description || '').toLowerCase();
    const objective = (campaign.objective || '').toLowerCase();

    const matchesSearch = name.includes(term) ||
      title.includes(term) ||
      description.includes(term) ||
      objective.includes(term);

    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Campaigns"
        description="Monitor, design, and organize your cross-channel marketing campaigns."
        action={
          <Button variant="primary" icon={IoAddOutline} onClick={openCreateModal}>
            New Campaign
          </Button>
        }
      />

      {/* Search and filter controls panel */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg" />
          <input
            type="text"
            placeholder="Search campaign name or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchParams(prev => {
                if (e.target.value) {
                  prev.set('search', e.target.value);
                } else {
                  prev.delete('search');
                }
                return prev;
              });
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-dark-900/30 border border-slate-200 dark:border-dark-700/60 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-dark-900/60 transition-all text-slate-700 dark:text-slate-200"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 select-none self-end md:self-auto">
          <IoFilterOutline className="text-slate-400 dark:text-slate-500 text-sm" />
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-dark-900/30 border border-slate-200 dark:border-dark-700/60 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Campaigns</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </Card>

      {/* Grid List area */}
      {loading ? (
        <Loader />
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center select-none bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-dark-700/50 shadow-premium flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-dark-900/50 flex items-center justify-center text-slate-400 text-2xl">
            <IoSearchOutline />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No campaigns found</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            We couldn't find any campaigns matching your query. Clear filters or create a new campaign to get started.
          </p>
        </div>
      )}

      {/* Create / Edit Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCampaign ? "Edit Campaign" : "Create New Campaign"}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              {selectedCampaign ? "Save Changes" : "Create Campaign"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            id="name"
            name="name"
            label="Campaign Name"
            placeholder="e.g. Summer Product Launch"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            required
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="description" className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide a brief summary of the campaign purpose and copy target..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full rounded-xl text-sm font-medium border bg-white dark:bg-dark-900/40 text-slate-800 dark:text-slate-100 pl-4 pr-4 py-3 focus:outline-none transition-all duration-200 custom-input ${formErrors.description ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 dark:border-dark-700/60 focus:border-primary-500'
                }`}
            />
            {formErrors.description && (
              <span className="text-xs text-rose-500 font-medium select-none">{formErrors.description}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="budget"
              name="budget"
              type="number"
              label="Campaign Budget ($)"
              placeholder="e.g. 5000"
              value={formData.budget}
              onChange={handleInputChange}
              error={formErrors.budget}
              required
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="status" className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
                Campaign Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-xl text-sm font-medium border border-slate-200 dark:border-dark-700/60 bg-white dark:bg-dark-900/40 text-slate-800 dark:text-slate-100 px-4 py-3 focus:outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="startDate"
              name="startDate"
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={handleInputChange}
              error={formErrors.startDate}
              required
            />

            <Input
              id="endDate"
              name="endDate"
              type="date"
              label="End Date"
              value={formData.endDate}
              onChange={handleInputChange}
              error={formErrors.endDate}
              required
            />
          </div>

          {/* Social Platforms Connection */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none tracking-wide">
              Target Networks
            </span>
            <div className="grid grid-cols-2 gap-3.5">
              {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map((platform) => {
                const platKey = platform.toLowerCase();
                const isChecked = formData.platforms.includes(platKey);
                return (
                  <label
                    key={platform}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer select-none transition-all duration-200 ${isChecked
                      ? 'border-primary-500/60 bg-primary-50/10 dark:bg-primary-950/5 text-primary-500'
                      : 'border-slate-200 dark:border-dark-700/60 bg-white dark:bg-dark-900/20 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-900/10'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handlePlatformChange(platKey)}
                      className="hidden"
                    />
                    <span className="text-xs font-bold">{platform}</span>
                  </label>
                );
              })}
            </div>
            {formErrors.platforms && (
              <span className="text-xs text-rose-500 font-medium select-none">{formErrors.platforms}</span>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Campaign Confirmation Dialog */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Campaign"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          Are you sure you want to delete this campaign? This action is permanent, and will remove all scheduled post correlations associated with it.
        </p>
      </Modal>

    </div>
  );
};

export default Campaigns;
