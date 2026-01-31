import React, { useState } from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { FileText, Factory, Wifi, Server, ClipboardCheck, Save, Share, Plus, Edit2, Trash2, ArrowLeft, Search, Filter, Upload } from 'lucide-react';

const INITIAL_FORM_STATE = {
    // Lead Info
    companyName: '', pocName: '', pocEmail: '', annualRevenue: '', userCount: '', currentErp: '',
    painPoints: '', timeline: '',
    status: 'New',

    // Operations
    sites: '', operators: '', shifts: '', woPerDay: '', fgItems: '', inventoryItems: '',

    // Connectivity
    opcMachines: '', workCells: '', oldMachines: '',
    hasOpcServer: 'No',
    scales: 'No', scaleVendor: '',
    opcDirectory: 'No', directoryFormat: '',
    controlsEngineer: 'No',
    scada: 'No', scadaSystem: '',
    signals: { material: false, counts: false, compliance: false, process: false },

    // Systems
    netsuiteEdition: 'None',
    scheduling: 'No', schedulingSystem: '',
    customizations: 'No', customizationsDesc: '',
    wms: 'No', wmsSystem: '',
    qms: 'No', qmsSystem: '',
    labeling: 'No', zebraPrinters: 'No',
    regulatory: 'None', validation: 'No',

    // Demo
    demoNotes: ''
};

const Presales = () => {
    const { leads, addLead, updateLead, removeLead, hasPermission } = useData();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [activeTab, setActiveTab] = useState('lead');
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProbability, setFilterProbability] = useState('All');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

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

    const handleSave = (e) => {
        e.preventDefault();
        if (formData.id) {
            updateLead(formData);
        } else {
            addLead(formData);
        }
        setView('list');
    };

    const filteredLeads = leads.filter(lead =>
    (lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.pocName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleShare = () => {
        const subject = `Presales Discovery: ${formData.companyName || 'New Lead'}`;
        const body = `
Presales Discovery Data
-----------------------
Company: ${formData.companyName}
POC: ${formData.pocName} (${formData.pocEmail})
Revenue: ${formData.annualRevenue}
Users: ${formData.userCount}
ERP: ${formData.currentErp}

Lead Info
---------
Pain Points: ${formData.painPoints}
Timeline: ${formData.timeline}

Operations
----------
Sites: ${formData.sites} | Shifts: ${formData.shifts} | Operators: ${formData.operators}
WO/Day: ${formData.woPerDay}

Connectivity
------------
IoT Machines: ${formData.opcMachines}
OPC Server: ${formData.hasOpcServer}
SCADA: ${formData.scada} (${formData.scadaSystem})

Systems
-------
NetSuite: ${formData.netsuiteEdition}
WMS: ${formData.wmsSystem}
QMS: ${formData.qmsSystem}
Regulatory: ${formData.regulatory}

Demo Notes
----------
${formData.demoNotes}
        `.trim();

        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const tabs = [
        { id: 'lead', label: 'Lead Info', icon: FileText },
        { id: 'ops', label: 'Operations', icon: Factory },
        { id: 'connect', label: 'Connectivity', icon: Wifi },
        { id: 'systems', label: 'Systems', icon: Server },
        { id: 'mfg', label: 'Demo', icon: ClipboardCheck },
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
                            <h3 className="card-title">Deal Qualification</h3>
                            <div className="form-group">
                                <label>Pain Points (Top 3)</label>
                                <textarea className="glass-panel w-full" rows="10" value={formData.painPoints} onChange={e => handleChange('painPoints', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Target Go-Live</label>
                                <input type="date" className="search-input w-full" value={formData.timeline} onChange={e => handleChange('timeline', e.target.value)} />
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
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Plant Layout</label>
                                    <button type="button" className="glass-panel w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>
                                        <Upload size={18} /> Upload Plant Layout
                                    </button>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>BOM / Routing</label>
                                    <button type="button" className="glass-panel w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>
                                        <Upload size={18} /> Upload BOM/Routing
                                    </button>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Other Documentation</label>
                                    <button type="button" className="glass-panel w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>
                                        <Upload size={18} /> Upload Other
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'connect' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        <Card>
                            <h3 className="card-title">Machine Capabilities</h3>
                            <div className="form-row">
                                <div className="form-group"><label>Machines w/ IoT</label><input type="number" className="search-input w-full" value={formData.opcMachines} onChange={e => handleChange('opcMachines', e.target.value)} /></div>
                                <div className="form-group"><label>Group Work Cells?</label><input className="search-input w-full" value={formData.workCells} onChange={e => handleChange('workCells', e.target.value)} /></div>
                            </div>
                            <div className="form-group"><label>Older Machines (No IoT)</label><input type="number" className="search-input w-full" value={formData.oldMachines} onChange={e => handleChange('oldMachines', e.target.value)} /></div>
                            <div className="form-row">
                                <div className="form-group"><label>OPC-UA Server?</label><select className="search-input w-full" value={formData.hasOpcServer} onChange={e => handleChange('hasOpcServer', e.target.value)}><option>No</option><option>Yes</option></select></div>
                                <div className="form-group"><label>Controls Engineer on Staff?</label><select className="search-input w-full" value={formData.controlsEngineer} onChange={e => handleChange('controlsEngineer', e.target.value)}><option>No</option><option>Yes</option></select></div>
                            </div>
                            <div className="form-group">
                                <label>SCADA System?</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select className="search-input" value={formData.scada} onChange={e => handleChange('scada', e.target.value)}><option>No</option><option>Yes</option></select>
                                    {formData.scada === 'Yes' && <input className="search-input w-full" placeholder="OEM Name" value={formData.scadaSystem} onChange={e => handleChange('scadaSystem', e.target.value)} />}
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <h3 className="card-title">Data Signals & Peripherals</h3>
                            <div className="form-group">
                                <label>Connect to Scales?</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select className="search-input" value={formData.scales} onChange={e => handleChange('scales', e.target.value)}><option>No</option><option>Yes</option></select>
                                    {formData.scales === 'Yes' && <input className="search-input w-full" placeholder="Vendor" value={formData.scaleVendor} onChange={e => handleChange('scaleVendor', e.target.value)} />}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>OPC Directory Available?</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select className="search-input" value={formData.opcDirectory} onChange={e => handleChange('opcDirectory', e.target.value)}><option>No</option><option>Partial</option><option>Yes</option></select>
                                    {formData.opcDirectory === 'Yes' && <input className="search-input w-full" placeholder="Format" value={formData.directoryFormat} onChange={e => handleChange('directoryFormat', e.target.value)} />}
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ marginBottom: '0.5rem', display: 'block' }}>Signals to Capture:</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label className="checkbox-label"><input type="checkbox" checked={formData.signals.material} onChange={() => handleSignalChange('material')} /> Automated Material Delivery</label>
                                    <label className="checkbox-label"><input type="checkbox" checked={formData.signals.counts} onChange={() => handleSignalChange('counts')} /> Production Count Points</label>
                                    <label className="checkbox-label"><input type="checkbox" checked={formData.signals.compliance} onChange={() => handleSignalChange('compliance')} /> Product Compliance Checks (Metal Det, etc)</label>
                                    <label className="checkbox-label"><input type="checkbox" checked={formData.signals.process} onChange={() => handleSignalChange('process')} /> Process Control Checks (Speed, Temp)</label>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'systems' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        <Card>
                            <h3 className="card-title">ERP & Software</h3>
                            <div className="form-group">
                                <label>NetSuite Edition</label>
                                <select className="search-input w-full" value={formData.netsuiteEdition} onChange={e => handleChange('netsuiteEdition', e.target.value)}>
                                    <option>None</option>
                                    <option>Standard</option>
                                    <option>Premium</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>3rd Party Scheduling?</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select className="search-input" value={formData.scheduling} onChange={e => handleChange('scheduling', e.target.value)}><option>No</option><option>Yes</option></select>
                                    {formData.scheduling === 'Yes' && <input className="search-input w-full" placeholder="Solution Name" value={formData.schedulingSystem} onChange={e => handleChange('schedulingSystem', e.target.value)} />}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>NetSuite WO/Inv Customizations?</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <select className="search-input" value={formData.customizations} onChange={e => handleChange('customizations', e.target.value)} style={{ width: '100px' }}><option>No</option><option>Yes</option></select>
                                    {formData.customizations === 'Yes' && <textarea className="glass-panel w-full" rows="2" placeholder="Describe customizations..." value={formData.customizationsDesc} onChange={e => handleChange('customizationsDesc', e.target.value)} />}
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <h3 className="card-title">Quality & Compliance</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>WMS Solution?</label>
                                    <input className="search-input w-full" placeholder="NS or 3rd Party" value={formData.wmsSystem} onChange={e => handleChange('wmsSystem', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>QMS Solution?</label>
                                    <input className="search-input w-full" placeholder="NS or 3rd Party" value={formData.qmsSystem} onChange={e => handleChange('qmsSystem', e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Regulatory Compliance?</label>
                                <input className="search-input w-full" placeholder="FDA, USDA, SQF..." value={formData.regulatory} onChange={e => handleChange('regulatory', e.target.value)} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Validation (IQ/OQ/PQ)?</label>
                                    <select className="search-input w-full" value={formData.validation} onChange={e => handleChange('validation', e.target.value)}><option>No</option><option>Yes</option></select>
                                </div>
                                <div className="form-group">
                                    <label>Labeling / Zebra?</label>
                                    <select className="search-input w-full" value={formData.labeling} onChange={e => handleChange('labeling', e.target.value)}><option>No</option><option>Yes (Zebra)</option><option>Yes (Other)</option></select>
                                </div>
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

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <button type="button" className="glass-panel" onClick={() => setView('list')} style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>Cancel</button>
                    <button type="button" className="glass-panel" onClick={handleShare} style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', cursor: 'pointer' }}>
                        <Share size={18} /> Share Lead
                    </button>
                    {((!formData.id && hasPermission('CREATE_LEAD')) || (formData.id && hasPermission('EDIT_LEAD'))) && (
                        <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Save size={18} /> {formData.id ? 'Update Lead' : 'Save Lead'}
                        </button>
                    )}
                </div>
            </form>

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
