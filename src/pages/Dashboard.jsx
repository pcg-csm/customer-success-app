
import React from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
    const { customers } = useData();
    const totalCustomers = customers.length;
    const highRisk = customers.filter(c => c.status === 'Risk' || c.status === 'Warning' || c.accountHealth === 'At Risk').length;
    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Welcome back to your overview.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--color-primary)' }}>
                            <Users size={24} />
                        </div>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>+12%</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2,543</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Customers</p>
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--color-accent)' }}>
                            <TrendingUp size={24} />
                        </div>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>+5%</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>98.2%</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Retention Rate</p>
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.2)', color: 'var(--color-secondary)' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <span style={{ color: 'var(--color-secondary)', fontSize: '0.875rem' }}>3 Action</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>High Risk</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Customers requiring attention</p>
                </Card>
            </div>

            <Card>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Activity</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Activity feed placeholder...</p>
            </Card>
        </div>
    );
};

export default Dashboard;
