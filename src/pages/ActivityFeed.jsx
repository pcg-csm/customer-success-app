import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import { Calendar, User, ArrowRight, MessageSquare } from 'lucide-react';

const ActivityFeed = () => {
    const { customers, documentationActivities, employees } = useData();
    const navigate = useNavigate();

    // Flatten and sort activities
    const customerActivities = customers.flatMap(customer =>
        (customer.activityLog || []).map(log => ({
            ...log,
            id: `cust-${log.id}`,
            type: 'customer',
            timestamp: log.timestamp,
            title: customer.company,
            content: log.content,
            subTitle: log.customerName,
            customerId: customer.id
        }))
    );

    const docActivities = (documentationActivities || []).map(doc => {
        const member = employees.find(e => e.id === doc.team_member_id);
        return {
            ...doc,
            id: `doc-${doc.id}`,
            type: 'documentation',
            timestamp: doc.activity_date,
            title: doc.product_type,
            content: doc.description,
            subTitle: member ? `${member.firstName} ${member.lastName}` : 'Unknown Member'
        };
    });

    const allActivities = [...customerActivities, ...docActivities].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MessageSquare size={32} style={{ color: 'var(--color-primary)' }} />
                    Global Activity Feed
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Real-time updates across your entire customer portfolio and documentation efforts.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
                {allActivities.length > 0 ? (
                    allActivities.map((activity) => (
                        <Card key={activity.id} style={{ display: 'flex', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', paddingTop: '0.25rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                                    {new Date(activity.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                                    {new Date(activity.timestamp).getHours()}:{new Date(activity.timestamp).getMinutes().toString().padStart(2, '0')}
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
                                                background: activity.type === 'documentation' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                color: activity.type === 'documentation' ? '#38bdf8' : '#10b981',
                                                border: `1px solid ${activity.type === 'documentation' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
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
                                    {activity.type === 'customer' && (
                                        <button
                                            onClick={() => navigate(`/customers/${activity.customerId}`)}
                                            className="glass-panel"
                                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                                        >
                                            View Profile <ArrowRight size={12} />
                                        </button>
                                    )}
                                </div>

                                <p style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                                    {activity.content}
                                </p>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No activity logged yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
