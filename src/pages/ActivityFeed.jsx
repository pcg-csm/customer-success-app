import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import { Calendar, User, ArrowRight, MessageSquare, Plus, Edit2, Trash2 } from 'lucide-react';
import EditActivityModal from '../components/EditActivityModal';

const ActivityFeed = () => {
    const { allActivities, employees, deleteActivity, updateActivityContent, toggleActivityStatus, hasPermission } = useData();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialType = searchParams.get('type');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const getFormattedType = (type) => {
        if (!type) return 'All';
        const formatted = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        if (formatted === 'Doc') return 'Documentation';
        return formatted;
    };

    const [filterType, setFilterType] = useState(getFormattedType(initialType));

    useEffect(() => {
        if (initialType) {
            setFilterType(getFormattedType(initialType));
        }
    }, [initialType]);

    const filteredActivities = useMemo(() => {
        let result = allActivities || [];

        if (filterType === 'Next Actions') {
            result = result.filter(act => act.nextActionDate || act.next_action_date);
        } else if (filterType !== 'All') {
            result = result.filter(act => act.type === filterType.toLowerCase());
        }

        return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [allActivities, filterType]);

    const canManageActivity = (type) => {
        if (!type) return false;
        const permissionMap = {
            'documentation': 'MANAGE_DOCUMENTATION',
            'training': 'MANAGE_TRAINING',
            'scheduler': 'MANAGE_SCHEDULER',
            'presales': 'CREATE_LEAD',
            'customer': 'MANAGE_CUSTOMERS'
        };
        return hasPermission(permissionMap[type.toLowerCase()]);
    };

    const handleDelete = async (id, type) => {
        if (!canManageActivity(type)) {
            alert('You do not have permission to delete this activity.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this activity?')) {
            const { error } = await deleteActivity(id, type);
            if (error) alert('Error deleting activity: ' + error.message);
        }
    };

    const handleEditClick = (activity) => {
        if (!canManageActivity(activity.type)) {
            alert('You do not have permission to edit this activity.');
            return;
        }
        setSelectedActivity(activity);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (id, type, newContent, nextActionDate) => {
        const { error } = await updateActivityContent(id, type, newContent, nextActionDate);
        if (error) alert('Error updating activity: ' + error.message);
    };

    const handleToggleDone = async (id, type, currentStatus) => {
        if (!canManageActivity(type)) {
            alert('You do not have permission to update this activity.');
            return;
        }
        const { error } = await toggleActivityStatus(id, type, currentStatus);
        if (error) alert('Error updating status: ' + error.message);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'documentation': return { bg: 'rgba(56, 189, 248, 0.1)', text: '#38bdf8' };
            case 'training': return { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7' };
            case 'presales': return { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24' };
            case 'scheduler': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
            default: return { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8' };
        }
    };

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <MessageSquare size={32} style={{ color: 'var(--color-primary)' }} />
                            Global Activity Feed
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Real-time updates across your entire customer portfolio and documentation efforts.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            {['All', 'Customer', 'Documentation', 'Training', 'Presales', 'Scheduler', 'Next Actions'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: filterType === type ? 'var(--color-primary)' : 'transparent',
                                        color: filterType === type ? 'white' : 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: filterType === type ? '600' : '400',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/activity/new')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={20} /> Create Activity
                        </button>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
                {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => {
                        const colors = getTypeColor(activity.type);
                        const isDone = activity.isDone || activity.is_done;
                        return (
                            <Card key={activity.id} style={{
                                display: 'flex',
                                gap: '1.5rem',
                                position: 'relative',
                                background: isDone ? '#f0fdf4' : 'var(--glass-bg)',
                                border: isDone ? '1px solid #bbf7d0' : '1px solid var(--glass-border)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px', paddingTop: '0.25rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={!!isDone}
                                        onChange={() => handleToggleDone(activity.id, activity.type, isDone)}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                            accentColor: '#22c55e',
                                            opacity: canManageActivity(activity.type) ? 1 : 0.5
                                        }}
                                        title={canManageActivity(activity.type) ? "Mark as Done" : "Permission Denied"}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', paddingTop: '0.25rem' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isDone ? '#166534' : 'var(--color-text)', marginBottom: '0.25rem' }}>
                                        {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: isDone ? '#16653499' : 'var(--color-text-muted)' }}>
                                        {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                    </div>
                                </div>

                                <div style={{ flex: 1, borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{activity.title}</h3>
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    background: colors.bg,
                                                    color: colors.text,
                                                    border: `1px solid ${colors.text}33`,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {activity.type}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                                <User size={14} /> {activity.subTitle}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleEditClick(activity)}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px', opacity: canManageActivity(activity.type) ? 1 : 0.3 }}
                                                title="Edit Activity"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(activity.id, activity.type)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', opacity: canManageActivity(activity.type) ? 1 : 0.3 }}
                                                title="Delete Activity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            {activity.type === 'customer' && (
                                                <button
                                                    onClick={() => navigate(`/customers/${activity.customerId}`)}
                                                    className="glass-panel"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', marginLeft: '0.5rem' }}
                                                >
                                                    View Profile <ArrowRight size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p style={{
                                        lineHeight: '1.6',
                                        color: isDone ? '#166534' : '#000000',
                                        background: isDone ? '#dcfce7' : '#f8fafc',
                                        padding: '1rem',
                                        border: isDone ? '1px solid #86efac' : '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        opacity: isDone ? 0.7 : 1
                                    }}>
                                        {activity.content}
                                    </p>

                                    {(activity.nextActionDate || activity.next_action_date) && (
                                        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                            <Calendar size={14} />
                                            Next Action: {new Date(activity.nextActionDate || activity.next_action_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No activity logged yet.</p>
                    </div>
                )}
            </div>

            <EditActivityModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                activity={selectedActivity}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

export default ActivityFeed;
