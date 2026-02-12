import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
    Plus,
    Calendar,
    User as UserIcon,
    FileText,
    Check,
    AlertCircle,
    Search,
    BookOpen,
    Edit2,
    Trash2
} from 'lucide-react';
import EditActivityModal from '../components/EditActivityModal';

const Documentation = () => {
    const {
        documentationActivities,
        addDocumentationActivity,
        employees,
        isLoading,
        deleteActivity,
        updateActivityContent,
        toggleActivityStatus
    } = useData();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const [activeTab, setActiveTab] = useState('SmartFactory for NetSuite');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newActivity, setNewActivity] = useState({
        description: '',
        team_member_id: '',
        activity_date: new Date().toISOString().split('T')[0]
    });

    const products = [
        'SmartFactory for NetSuite',
        'SmartFactory for Infor',
        'SmartFactory for CSI',
        'Scheduler'
    ];

    const filteredActivities = documentationActivities
        .filter(act => act.product_type === activeTab)
        .filter(act =>
            act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employees.find(e => e.id === act.team_member_id)?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employees.find(e => e.id === act.team_member_id)?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const activityData = {
            ...newActivity,
            product_type: activeTab
        };

        try {
            const { error } = await addDocumentationActivity(activityData);
            if (error) {
                console.error("Supabase error saving documentation activity:", error);
                alert(`Failed to save activity: ${error.message || 'Unknown error'}`);
            } else {
                setIsAdding(false);
                setNewActivity({
                    description: '',
                    team_member_id: '',
                    activity_date: new Date().toISOString().split('T')[0]
                });
            }
        } catch (err) {
            console.error("Unexpected error saving documentation activity:", err);
            alert(`An unexpected error occurred: ${err.message}`);
        }
    };

    const handleToggleDone = async (id, type, currentStatus) => {
        const { error } = await toggleActivityStatus(id, type, currentStatus);
        if (error) alert('Error updating status: ' + error.message);
    };

    if (isLoading) return <div className="loading">Loading...</div>;

    return (
        <div className="page-container">
            <header className="page-header" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="icon-container primary">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-gradient">Documentation</h1>
                        <p className="text-muted">Track and manage product documentation activities</p>
                    </div>
                </div>
            </header>

            {/* Product Tabs */}
            <div className="glass-panel" style={{ padding: '0.5rem', marginBottom: '2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                {products.map(product => (
                    <button
                        key={product}
                        onClick={() => setActiveTab(product)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === product ? 'var(--color-primary)' : 'transparent',
                            color: activeTab === product ? 'white' : 'var(--color-text-muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                            fontWeight: activeTab === product ? '600' : '400'
                        }}
                    >
                        {product}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Search and Add Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div className="search-box" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search activities or team members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.8rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--color-text)'
                            }}
                        />
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => setIsAdding(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={20} />
                        Log Activity
                    </button>
                </div>

                {/* Add Activity Form (Modal Overlay) */}
                {isAdding && (
                    <div className="modal-overlay">
                        <div className="glass-panel modal-content" style={{ maxWidth: '500px', width: '90%', padding: '2rem' }}>
                            <h2 style={{ marginBottom: '1.5rem' }}>Log New Activity - {activeTab}</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-group">
                                    <label>Team Member</label>
                                    <select
                                        required
                                        value={newActivity.team_member_id}
                                        onChange={(e) => setNewActivity({ ...newActivity, team_member_id: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#1a1a2e', border: '1px solid var(--glass-border)', color: 'white' }}
                                    >
                                        <option value="">Select a team member</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newActivity.activity_date}
                                        onChange={(e) => setNewActivity({ ...newActivity, activity_date: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#1a1a2e', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        required
                                        placeholder="Describe the work done..."
                                        value={newActivity.description}
                                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#1a1a2e', border: '1px solid var(--glass-border)', color: 'white', minHeight: '100px', resize: 'vertical' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)} style={{ flex: 1 }}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Activity</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Activity Feed */}
                <div className="glass-panel" style={{ padding: '0' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>Status</th>
                                <th>Date</th>
                                <th>Team Member</th>
                                <th>Description</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.length > 0 ? (
                                filteredActivities.map(activity => {
                                    const member = employees.find(e => e.id === activity.team_member_id);
                                    const isDone = activity.is_done;
                                    return (
                                        <tr key={activity.id} style={{
                                            background: isDone ? '#f0fdf4' : 'transparent',
                                            transition: 'background 0.3s ease'
                                        }}>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!isDone}
                                                    onChange={() => handleToggleDone(`doc-${activity.id}`, 'documentation', isDone)}
                                                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#22c55e' }}
                                                    title="Mark as Done"
                                                />
                                            </td>
                                            <td style={{ width: '150px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Calendar size={14} className="text-primary" />
                                                    {new Date(activity.activity_date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ width: '200px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <UserIcon size={14} className="text-secondary" />
                                                    {member ? `${member.firstName} ${member.lastName}` : 'Unknown'}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                                    <FileText size={14} style={{ marginTop: '3px', flexShrink: 0 }} className="text-muted" />
                                                    <span style={{
                                                        lineHeight: '1.5',
                                                        color: isDone ? '#166534' : 'black',
                                                        textDecoration: isDone ? 'line-through' : 'none',
                                                        opacity: isDone ? 0.7 : 1
                                                    }}>{activity.description}</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedActivity({ ...activity, id: `doc-${activity.id}`, type: 'documentation', content: activity.description });
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}
                                                        title="Edit Activity"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm('Delete this documentation activity?')) {
                                                                const { error } = await deleteActivity(`doc-${activity.id}`, 'documentation');
                                                                if (error) alert('Error: ' + error.message);
                                                            }
                                                        }}
                                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                                        title="Delete Activity"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <AlertCircle size={32} opacity={0.5} />
                                            <p>No activities found for {activeTab}.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <EditActivityModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                activity={selectedActivity}
                onSave={async (id, type, content) => {
                    const { error } = await updateActivityContent(id, type, content);
                    if (error) alert('Error: ' + error.message);
                }}
            />
        </div>
    );
};

export default Documentation;
