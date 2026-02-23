import React, { useState } from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { FileText, Factory, Wifi, Server, ClipboardCheck, Save, Share, Plus, Edit2, Trash2, ArrowLeft, Search, Filter, Upload, MessageSquare, Calendar, XCircle } from 'lucide-react';
import EditActivityModal from '../components/EditActivityModal';

const INITIAL_FORM_STATE = {
    // Lead Info
    companyName: '', pocName: '', pocEmail: '', annualRevenue: '', userCount: '', currentErp: '',
    painPoints: '',
    status: 'New',

    // Operations
    sites: '', operators: '', shifts: '', woPerDay: '', fgItems: '', inventoryItems: '',

    // Demo
    demoNotes: '',
    opportunityBroughtBy: '',
    discoveryNotes: '',
    attachments: []
};

const Presales = () => {
    const { leads, presalesActivities, addLead, updateLead, removeLead, hasPermission, deleteActivity, updateActivityContent, toggleActivityStatus } = useData();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [activeTab, setActiveTab] = useState('lead');
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProbability, setFilterProbability] = useState('All');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSignalChange = (signal) => {
        setFormData(prev => ({
            ...prev,
            signals: { ...prev.signals, [signal]: !prev.signals[signal] }
        }));
    };

    const handleNewLead = () => {
        setFormData(INITIAL_FORM_STATE);
        setView('form');
    };

    const handleEditLead = (lead) => {
        setFormData(lead);
        setView('form');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        try {
            let result;
            if (formData.id) {
                result = await updateLead(formData);
            } else {
                result = await addLead(formData);
            }

            if (result && result.success) {
                setView('list');
            } else {
                setSaveError(result?.error || 'Failed to save lead. Please try again.');
            }
        } catch (err) {
            console.error('Save error:', err);
            setSaveError('An unexpected error occurred while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteActivity = async (id) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            const { error } = await deleteActivity(id, 'presales');
            if (error) alert('Error: ' + error.message);
        }
    };

    const handleEditActivity = (activity) => {
        setSelectedActivity({ ...activity, type: 'presales' });
        setIsEditModalOpen(true);
    };

    const handleSaveActivityEdit = async (id, type, content) => {
        const { error } = await updateActivityContent(id, type, content);
        if (error) alert('Error: ' + error.message);
    };

    const handleToggleDone = async (id, type, currentStatus) => {
        const { error } = await toggleActivityStatus(id, type, currentStatus);
        if (error) alert('Error updating status: ' + error.message);
    };

    const filteredLeads = leads.filter(lead =>
        (lead.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.pocName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredActivities = (presalesActivities || []).filter(a => String(a.leadId) === String(formData.id));

    const handleShare = () => {
        const subject = `Presales Discovery: ${formData.companyName || 'New Lead'}`;
        const body = `
Presales Discovery Data
-----------------------
Company: ${formData.companyName}
POC: ${formData.pocName} (${formData.pocEmail})
Opportunity Brought By: ${formData.opportunityBroughtBy}
Revenue: ${formData.annualRevenue}
Users: ${formData.userCount}
ERP: ${formData.currentErp}

Lead Info
---------
Discovery Notes: ${formData.discoveryNotes}
Pain Points: ${formData.painPoints}

Operations
----------
Sites: ${formData.sites} | Shifts: ${formData.shifts} | Operators: ${formData.operators}
WO/Day: ${formData.woPerDay}

Demo Notes
----------
${formData.demoNotes}
        `.trim();

        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const tabs = [
        { id: 'lead', label: 'Lead Info', icon: FileText },
        { id: 'ops', label: 'Operations', icon: Factory },
        { id: 'mfg', label: 'Demo', icon: ClipboardCheck },
        { id: 'activities', label: 'Activities', icon: MessageSquare }
    ];

    if (view === 'list') {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ClipboardCheck size={32} style={{ color: 'var(--color-primary)' }} />
                            Lead Management
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Manage your presales pipeline and discovery data.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {hasPermission('CREATE_LEAD') && (
                            <button className="glass-panel" onClick={handleNewLead} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>
                                <Plus size={18} /> New Discovery
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                className="search-input"
                                style={{ paddingLeft: '2.5rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="w-full">
                        <thead>
                            <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '1rem' }}>Company</th>
                                <th style={{ padding: '1rem' }}>POC</th>
                                <th style={{ padding: '1rem' }}>Revenue</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map(lead => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{lead.companyName}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{lead.pocName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{lead.pocEmail}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{lead.annualRevenue}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleEditLead(lead)}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', cursor: 'pointer' }}
                                            >
                                                View
                                            </button>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {hasPermission('EDIT_LEAD') && (
                                                    <button
                                                        className="glass-panel"
                                                        onClick={() => handleEditLead(lead)}
                                                        style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                        title="Edit Lead"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                                {hasPermission('DELETE_LEAD') && (
                                                    <button
                                                        className="glass-panel"
                                                        onClick={() => removeLead(lead.id)}
                                                        style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--color-danger)' }}
                                                        title="Delete Lead"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No leads found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            </div >
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <button
                onClick={() => setView('list')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', background: 'none', border: 'none', marginBottom: '1rem', cursor: 'pointer' }}
            >
                <ArrowLeft size={18} />
                Back to Leads
            </button>

            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ClipboardCheck size={32} style={{ color: 'var(--color-primary)' }} />
                    {formData.id ? 'Edit Lead' : 'New Lead Discovery'}
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Lead capture and technical discovery form.</p>

                {saveError && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <AlertCircle size={20} />
                        <span>{saveError}</span>
                    </div>
                )}
            </header>

            <div className="tabs" style={{ marginBottom: '2rem' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSave}>
                {activeTab === 'lead' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        <Card>
                            <h3 className="card-title">Company Profile</h3>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input className="search-input w-full" value={formData.companyName} onChange={e => handleChange('companyName', e.target.value)} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>POC Name</label>
                                    <input className="search-input w-full" value={formData.pocName} onChange={e => handleChange('pocName', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>POC Email</label>
                                    <input className="search-input w-full" value={formData.pocEmail} onChange={e => handleChange('pocEmail', e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Opportunity brought to PCG by:</label>
                                <input className="search-input w-full" value={formData.opportunityBroughtBy} onChange={e => handleChange('opportunityBroughtBy', e.target.value)} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Annual Revenue</label>
                                    <input className="search-input w-full" value={formData.annualRevenue} onChange={e => handleChange('annualRevenue', e.target.value)} placeholder="$" />
                                </div>
                                <div className="form-group">
                                    <label>User Count</label>
                                    <input className="search-input w-full" value={formData.userCount} onChange={e => handleChange('userCount', e.target.value)} type="number" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Current ERP</label>
                                <input className="search-input w-full" value={formData.currentErp} onChange={e => handleChange('currentErp', e.target.value)} />
                            </div>
                        </Card>

                        <Card>
                            <h3 className="card-title">Discovery Notes</h3>
                            <div className="form-group">
                                <textarea className="glass-panel w-full" rows="10" value={formData.discoveryNotes} onChange={e => handleChange('discoveryNotes', e.target.value)} placeholder="General discovery notes and observations..." />
                            </div>
                            <div className="form-group">
                                <label><strong>Top 3 Pain Points</strong></label>
                                <textarea className="glass-panel w-full" rows="10" value={formData.painPoints} onChange={e => handleChange('painPoints', e.target.value)} />
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'ops' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        <Card>
                            <h3 className="card-title">Plant Overview</h3>
                            <div className="form-row">
                                <div className="form-group"><label># Sites</label><input type="number" className="search-input w-full" value={formData.sites} onChange={e => handleChange('sites', e.target.value)} /></div>
                                <div className="form-group"><label># Operators</label><input type="number" className="search-input w-full" value={formData.operators} onChange={e => handleChange('operators', e.target.value)} /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label># Shifts</label><input type="number" className="search-input w-full" value={formData.shifts} onChange={e => handleChange('shifts', e.target.value)} /></div>
                                <div className="form-group"><label>Avg WO / Day</label><input type="number" className="search-input w-full" value={formData.woPerDay} onChange={e => handleChange('woPerDay', e.target.value)} /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label>Active FG Items</label><input type="number" className="search-input w-full" value={formData.fgItems} onChange={e => handleChange('fgItems', e.target.value)} /></div>
                                <div className="form-group"><label>Active Inv Items</label><input type="number" className="search-input w-full" value={formData.inventoryItems} onChange={e => handleChange('inventoryItems', e.target.value)} /></div>
                            </div>
                        </Card>
                        <Card>
                            <h3 className="card-title">Documentation & Layout</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { label: 'Plant Layout', type: 'Layout' },
                                    { label: 'BOM / Routing', type: 'BOM' },
                                    { label: 'Other Documentation', type: 'Other' }
                                ].map((docType) => (
                                    <div key={docType.type} className="form-group" style={{ marginBottom: 0 }}>
                                        <label>{docType.label}</label>
                                        <label
                                            className="glass-panel w-full"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                padding: '1rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                color: 'var(--color-text-muted)',
                                                cursor: 'pointer',
                                                border: '1px dashed var(--glass-border)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Upload size={18} />
                                                <span>Upload {docType.label}</span>
                                            </div>
                                            <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                onClick={(e) => { e.target.value = null; }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const newDoc = {
                                                            name: file.name,
                                                            size: (file.size / 1024).toFixed(0) + ' KB',
                                                            date: new Date().toLocaleDateString(),
                                                            type: docType.type
                                                        };
                                                        setFormData({ ...formData, attachments: [...(formData.attachments || []), newDoc] });
                                                    }
                                                }}
                                            />
                                        </label>

                                        {/* List uploaded files for this specific type */}
                                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            {(formData.attachments || []).filter(a => a.type === docType.type).map((file, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                                        <FileText size={14} style={{ color: 'var(--color-primary)' }} />
                                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newAttachments = formData.attachments.filter(a => a !== file);
                                                            setFormData({ ...formData, attachments: newAttachments });
                                                        }}
                                                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                                                    >
                                                        <XCircle size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'mfg' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        <Card>
                            <h3 className="card-title">Demo Agenda and Notes</h3>
                            <div className="form-group">
                                <textarea
                                    className="glass-panel w-full"
                                    rows="15"
                                    placeholder="Enter demo agenda, key points to cover, and notes during the session..."
                                    value={formData.demoNotes}
                                    onChange={e => handleChange('demoNotes', e.target.value)}
                                />
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'activities' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        <Card>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 className="card-title" style={{ marginBottom: 0 }}>Lead Activity Feed</h3>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    {filteredActivities.length} logs for {formData.companyName}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {filteredActivities.length > 0 ? (
                                    filteredActivities.map(activity => {
                                        const isDone = activity.isDone;
                                        return (
                                            <div key={activity.id} className="glass-panel" style={{
                                                padding: '1rem',
                                                background: isDone ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255,255,255,0.02)',
                                                display: 'flex',
                                                gap: '1rem',
                                                border: isDone ? '1px solid #bbf7d0' : '1px solid var(--glass-border)',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <div style={{ paddingTop: '0.25rem' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!isDone}
                                                        onChange={() => handleToggleDone(`pre-${activity.id}`, 'presales', isDone)}
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#22c55e' }}
                                                        title="Mark as Done"
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDone ? '#16653499' : 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                                            <Calendar size={14} /> {new Date(activity.timestamp).toLocaleString()}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEditActivity(activity)}
                                                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteActivity(`pre-${activity.id}`)}
                                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p style={{
                                                        lineHeight: '1.5',
                                                        fontSize: '0.9rem',
                                                        color: isDone ? '#166534' : '#000000',
                                                        background: isDone ? '#dcfce7' : '#f8fafc',
                                                        padding: '0.75rem',
                                                        border: isDone ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                                                        borderRadius: '4px',
                                                        textDecoration: isDone ? 'line-through' : 'none',
                                                        opacity: isDone ? 0.7 : 1
                                                    }}>
                                                        {activity.content}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                        No activities logged for this lead.
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <button type="button" className="glass-panel" onClick={() => setView('list')} style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>Cancel</button>
                    <button type="button" className="glass-panel" onClick={handleShare} style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', cursor: 'pointer' }}>
                        <Share size={18} /> Share Lead
                    </button>
                    {((!formData.id && hasPermission('CREATE_LEAD')) || (formData.id && hasPermission('EDIT_LEAD'))) && (
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSaving}
                            style={{
                                padding: '0.75rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: isSaving ? 0.7 : 1,
                                cursor: isSaving ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <Save size={18} className={isSaving ? 'animate-spin' : ''} />
                            {isSaving ? 'Saving...' : (formData.id ? 'Update Lead' : 'Save Lead')}
                        </button>
                    )}
                </div>
            </form>

            {isEditModalOpen && (
                <EditActivityModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    activity={selectedActivity}
                    onSave={handleSaveActivityEdit}
                />
            )}


            <style>{`
                .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
                .form-group { flex: 1; margin-bottom: 1rem; min-width: 200px; }
                .form-group label { display: block; margin-bottom: 0.5rem; color: var(--color-text-main); font-size: 0.875rem; }
                .w-full { width: 100%; box-sizing: border-box; }
                .search-input, .glass-panel { max-width: 100%; box-sizing: border-box; }
                .card-title { margin-bottom: 1.5rem; font-weight: bold; font-size: 1.125rem; }
                .checkbox-label { display: flex; align-items: center; gap: 0.5rem; color: var(--color-text-main); font-size: 0.9rem; margin-bottom: 0.25rem; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default Presales;
