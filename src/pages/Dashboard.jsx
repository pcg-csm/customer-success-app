import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { Search, Calendar, User, ArrowRight, MessageSquare, Plus, Edit2, Trash2 } from 'lucide-react';
import EditActivityModal from '../components/EditActivityModal';

const Dashboard = () => {
    const {
        allActivities,
        employees,
        isLoading,
        deleteActivity,
        updateActivityContent,
        toggleActivityStatus
    } = useData();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialType = searchParams.get('type');

    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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

    // Enhanced filtering and sorting
    const filteredActivities = useMemo(() => {
        let result = allActivities || [];

        if (filterType === 'Next Actions') {
            result = result.filter(act => {
                const nextDate = act.nextActionDate || act.next_action_date;
                if (!nextDate) return false;

                const d = new Date(nextDate);
                if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    if (d < start) return false;
                }
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    if (d > end) return false;
                }
                return true;
            });
        } else if (filterType !== 'All') {
            result = result.filter(act => act.type === filterType.toLowerCase());
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(act =>
                (act.content && act.content.toLowerCase().includes(lowerSearch)) ||
                (act.title && act.title.toLowerCase().includes(lowerSearch)) ||
                (act.subTitle && act.subTitle.toLowerCase().includes(lowerSearch))
            );
        }

        return result.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    }, [allActivities, filterType, searchTerm, startDate, endDate]);

    const handleDelete = async (id, type) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            const { error } = await deleteActivity(id, type);
            if (error) alert('Error deleting activity: ' + error.message);
        }
    };

    const handleEditClick = (activity) => {
        setSelectedActivity(activity);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (id, type, newContent, nextActionDate) => {
        const { error } = await updateActivityContent(id, type, newContent, nextActionDate);
        if (error) alert('Error updating activity: ' + error.message);
    };

    const handleToggleDone = async (id, type, currentStatus) => {
        const { error } = await toggleActivityStatus(id, type, currentStatus);
        if (error) alert('Error updating status: ' + error.message);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'documentation': return { bg: 'rgba(56, 189, 248, 0.1)', text: '#38bdf8' };
            case 'training': return { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7' };
            case 'presales': return { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24' };
            default: return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
        }
    };

    if (isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading activities...</div>;
    }

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <MessageSquare size={32} style={{ color: 'var(--color-primary)' }} />
                            Activity Dashboard
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)' }}>Monitor and manage cross-customer activities and reminders.</p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/activity/new')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={20} /> Create Activity
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            className="search-input"
                            placeholder="Search activity content, title, or member..."
                            style={{ width: '100%', paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        {['All', 'Customer', 'Documentation', 'Training', 'Presales', 'Next Actions'].map(type => (
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

                    {filterType === 'Next Actions' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Range:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '4px',
                                        color: 'black',
                                        fontSize: '0.75rem',
                                        padding: '2px 4px',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                />
                                <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '4px',
                                        color: 'black',
                                        fontSize: '0.75rem',
                                        padding: '2px 4px',
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
                {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity, index) => {
                        const colors = getTypeColor(activity.type);
                        const isDone = activity.isDone || activity.is_done;
                        return (
                            <div key={activity.id} className="activity-item" style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1.25rem',
                                borderBottom: index !== filteredActivities.length - 1 ? '1px solid var(--glass-border)' : 'none',
                                background: isDone ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                                transition: 'background 0.3s ease'
                            }}>
                                <div style={{ paddingTop: '0.25rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={!!isDone}
                                        onChange={() => handleToggleDone(activity.id, activity.type, isDone)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#22c55e' }}
                                        title="Mark as Done"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{
                                                background: colors.bg,
                                                color: colors.text,
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {activity.type}
                                            </span>
                                            <span style={{ fontSize: '0.85rem', color: isDone ? '#16653499' : 'var(--color-text-muted)', fontWeight: '500' }}>
                                                {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEditClick(activity)}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}
                                                title="Edit Activity"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(activity.id, activity.type)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                                title="Delete Activity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: isDone ? '#166534' : 'inherit' }}>{activity.title}</h3>
                                    <p style={{ fontSize: '0.875rem', color: isDone ? '#16653499' : 'var(--color-text-muted)', marginBottom: '0.75rem' }}>{activity.subTitle}</p>

                                    <p style={{
                                        lineHeight: '1.6',
                                        color: isDone ? '#166534' : '#000000',
                                        background: isDone ? '#dcfce7' : '#f8fafc',
                                        padding: '1rem',
                                        border: isDone ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        opacity: isDone ? 0.7 : 1
                                    }}>
                                        {activity.content}
                                    </p>

                                    {(activity.nextActionDate || activity.next_action_date) && (
                                        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDone ? '#16653499' : '#dc2626', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                            <Calendar size={14} />
                                            Next Action: {new Date(activity.nextActionDate || activity.next_action_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No activities found matching your criteria.</p>
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

export default Dashboard;
