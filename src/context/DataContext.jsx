import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const DataContext = createContext();

const nullifyEmpty = (val) => (val === '' ? null : val);

// Helper to map DB snake_case to UI camelCase
const mapCustomerFromDB = (c) => ({
    id: c.id,
    company: c.company,
    name: c.name,
    email: c.email,
    phone: c.phone,
    status: c.status,
    active: c.active,
    arr: c.arr,
    signedDate: c.signed_date,
    terms: c.terms,
    satisfaction: c.satisfaction || 7,
    netsuite: c.netsuite || {},
    tulip: c.tulip || {},
    customerTeam: c.customer_team || [],
    activityLog: c.activity_log || [],
    licensedProducts: c.licensed_products || [],
    attachments: c.attachments || [],
    documents: c.documents || [],
    personalizations: c.personalizations,
    pcgSupportPocId: c.pcg_support_poc_id,
    pcgImplementationLeadId: c.pcg_implementation_lead_id,
    pcgSalesPocId: c.pcg_sales_poc_id,
    pcgProjectPocId: c.pcg_project_poc_id
});

const mapCustomerToDB = (c) => ({
    company: c.company,
    name: c.name,
    email: c.email,
    phone: c.phone,
    status: c.status,
    active: c.active,
    arr: c.arr,
    signed_date: c.signedDate,
    terms: c.terms,
    satisfaction: c.satisfaction,
    netsuite: c.netsuite,
    tulip: c.tulip,
    customer_team: c.customerTeam,
    activity_log: c.activityLog,
    licensed_products: c.licensedProducts,
    attachments: c.attachments,
    documents: c.documents,
    personalizations: c.personalizations,
    pcg_support_poc_id: c.pcgSupportPocId,
    pcg_implementation_lead_id: c.pcgImplementationLeadId,
    pcg_sales_poc_id: c.pcgSalesPocId,
    pcg_project_poc_id: c.pcgProjectPocId
});

const mapLeadFromDB = (l) => ({
    id: l.id,
    companyName: l.company_name,
    pocName: l.poc_name,
    pocEmail: l.poc_email,
    annualRevenue: l.annual_revenue,
    userCount: l.user_count,
    currentErp: l.current_erp,
    painPoints: l.pain_points,
    timeline: l.timeline,
    budgetStatus: l.budget_status,
    decisionProcess: l.decision_process,
    nextStepDate: l.next_step_date,
    probability: l.probability,
    status: l.status,
    sites: l.sites,
    operators: l.operators,
    shifts: l.shifts,
    woPerDay: l.wo_per_day,
    fgItems: l.fg_items,
    inventoryItems: l.inventory_items,
    stagingBins: l.staging_bins,
    coMan: l.co_man,
    equipmentCount: l.equipment_count,
    manualStations: l.manual_stations,
    opcMachines: l.opc_machines,
    workCells: l.work_cells,
    oldMachines: l.old_machines,
    hasOpcServer: l.has_opc_server,
    controlsEngineer: l.controls_engineer,
    scada: l.scada,
    scadaSystem: l.scada_system,
    scales: l.scales,
    scaleVendor: l.scale_vendor,
    opcDirectory: l.opc_directory,
    directoryFormat: l.directory_format,
    signals: l.signals || {},
    netsuiteEdition: l.netsuite_edition,
    scheduling: l.scheduling,
    schedulingSystem: l.scheduling_system,
    customizations: l.customizations,
    customizationsDesc: l.customizations_desc,
    wms: l.wms,
    wmsSystem: l.wms_system,
    qms: l.qms,
    qmsSystem: l.qms_system,
    labeling: l.labeling,
    zebraPrinters: l.zebra_printers,
    regulatory: l.regulatory,
    validation: l.validation,
    batchProcess: l.batch_process,
    ebr: l.ebr,
    continuousImprovement: l.continuous_improvement,
    ciData: l.ci_data,
    setupInstructions: l.setup_instructions,
    setupFormat: l.setup_format,
    workInstructions: l.work_instructions,
    wiFormat: l.wi_format,
    downtime: l.downtime,
    materialLoss: l.material_loss,
    laborCodes: l.labor_codes
});

const mapLeadToDB = (l) => ({
    company_name: l.companyName,
    poc_name: l.pocName,
    poc_email: l.pocEmail,
    annual_revenue: l.annualRevenue,
    user_count: nullifyEmpty(l.userCount),
    current_erp: l.currentErp,
    pain_points: l.painPoints,
    timeline: l.timeline,
    budget_status: l.budgetStatus,
    decision_process: l.decisionProcess,
    next_step_date: nullifyEmpty(l.nextStepDate),
    probability: l.probability,
    status: l.status,
    sites: nullifyEmpty(l.sites),
    operators: nullifyEmpty(l.operators),
    shifts: nullifyEmpty(l.shifts),
    wo_per_day: nullifyEmpty(l.woPerDay),
    fg_items: nullifyEmpty(l.fgItems),
    inventory_items: nullifyEmpty(l.inventoryItems),
    staging_bins: l.stagingBins,
    co_man: l.coMan,
    equipment_count: nullifyEmpty(l.equipmentCount),
    manual_stations: nullifyEmpty(l.manualStations),
    opc_machines: nullifyEmpty(l.opcMachines),
    work_cells: l.workCells,
    old_machines: nullifyEmpty(l.oldMachines),
    has_opc_server: l.hasOpcServer,
    controls_engineer: l.controlsEngineer,
    scada: l.scada,
    scada_system: l.scadaSystem,
    scales: l.scales,
    scale_vendor: l.scaleVendor,
    opc_directory: l.opcDirectory,
    directory_format: l.directoryFormat,
    signals: l.signals,
    netsuite_edition: l.netsuiteEdition,
    scheduling: l.scheduling,
    scheduling_system: l.schedulingSystem,
    customizations: l.customizations,
    customizations_desc: l.customizationsDesc,
    wms: l.wms,
    wms_system: l.wmsSystem,
    qms: l.qms,
    qms_system: l.qmsSystem,
    labeling: l.labeling,
    zebra_printers: l.zebraPrinters,
    regulatory: l.regulatory,
    validation: l.validation,
    batch_process: l.batchProcess,
    ebr: l.ebr,
    continuous_improvement: l.continuousImprovement,
    ci_data: l.ciData,
    setup_instructions: l.setupInstructions,
    setup_format: l.setupFormat,
    work_instructions: l.workInstructions,
    wi_format: l.wiFormat,
    downtime: l.downtime,
    material_loss: l.materialLoss,
    labor_codes: l.laborCodes
});

const mapEmployeeFromDB = (e) => ({
    id: e.id,
    firstName: e.first_name,
    lastName: e.last_name,
    email: e.email,
    role: e.role,
    location: e.location,
    bio: e.bio,
    title: e.title,
    certBasicAppBuilder: e.cert_basic_app_builder,
    certAdvancedAppBuilder: e.cert_advanced_app_builder,
    certSolutionLead: e.cert_solution_lead,
    certAdoptionManager: e.cert_adoption_manager,
    certSales: e.cert_sales,
    certGxP: e.cert_gxp,
    certAiOps: e.cert_ai_ops,
    certTulipCertified: e.cert_tulip_certified
});

const mapEmployeeToDB = (e) => ({
    first_name: e.firstName,
    last_name: e.lastName,
    email: e.email,
    role: e.role,
    location: e.location,
    bio: e.bio,
    title: e.title,
    cert_basic_app_builder: e.certBasicAppBuilder,
    cert_advanced_app_builder: e.certAdvancedAppBuilder,
    cert_solution_lead: e.certSolutionLead,
    cert_adoption_manager: e.certAdoptionManager,
    cert_sales: e.certSales,
    cert_gxp: e.certGxP,
    cert_ai_ops: e.certAiOps,
    cert_tulip_certified: e.certTulipCertified
});

export const DataProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [documentationActivities, setDocumentationActivities] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial auth check and data fetch
    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // Fetch profile for the authenticated user
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setCurrentUser({
                        id: profile.id,
                        firstName: profile.first_name,
                        lastName: profile.last_name,
                        email: session.user.email,
                        role: profile.role
                    });
                } else {
                    // Fallback to basic user info if profile doesn't exist yet
                    setCurrentUser({
                        id: session.user.id,
                        firstName: session.user.email.split('@')[0],
                        lastName: '',
                        email: session.user.email,
                        role: 'VIEWER'
                    });
                }
                fetchData();
            } else {
                setCurrentUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchData = async () => {
        // Only fetch if authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        setIsLoading(true);
        try {
            const [
                { data: customersData },
                { data: productsData },
                { data: employeesData },
                { data: leadsData },
                { data: docActivitiesData }
            ] = await Promise.all([
                supabase.from('customers').select('*').order('company'),
                supabase.from('products').select('*').order('name'),
                supabase.from('employees').select('*'),
                supabase.from('leads').select('*').order('created_at', { ascending: false }),
                supabase.from('documentation_activities').select('*').order('created_at', { ascending: false }),
                supabase.from('profiles').select('*').order('first_name')
            ]);

            if (customersData) setCustomers(customersData.map(mapCustomerFromDB));
            if (productsData) setProducts(productsData.map(p => p.name));
            if (employeesData) setEmployees(employeesData.map(mapEmployeeFromDB));
            if (leadsData) setLeads(leadsData.map(mapLeadFromDB));
            if (docActivitiesData) setDocumentationActivities(docActivitiesData);
            if (profilesData) setUsers(profilesData.map(p => ({
                id: p.id,
                firstName: p.first_name,
                lastName: p.last_name,
                email: p.email || '', // Email might be in auth.users, but we store it in profiles for easier access if sync'd
                role: p.role
            })));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const hasPermission = (permission) => {
        if (!currentUser) return false;
        if (currentUser.role === 'ADMIN') return true;

        switch (permission) {
            case 'VIEW_ALL':
                return true;
            case 'CREATE_LEAD':
                return currentUser.role === 'LEAD_CREATOR';
            case 'EDIT_LEAD':
                return false;
            case 'DELETE_LEAD':
                return false;
            case 'MANAGE_CUSTOMERS':
                return false;
            case 'MANAGE_USERS':
                return false;
            default:
                return false;
        }
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Login error:', error.message);
            return { success: false, error: error.message };
        }

        return { success: true };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    const addProduct = async (productName) => {
        const { data, error } = await supabase.from('products').insert([{ name: productName }]).select();
        if (!error && data) {
            setProducts([...products, productName]);
        }
    };

    const removeProduct = async (productToRemove) => {
        const { error } = await supabase.from('products').delete().eq('name', productToRemove);
        if (!error) {
            setProducts(products.filter(p => p !== productToRemove));
        }
    };

    const addEmployee = async (employee) => {
        const dbEmployee = mapEmployeeToDB(employee);
        const { data, error } = await supabase.from('employees').insert([dbEmployee]).select();
        if (!error && data) {
            setEmployees([...employees, mapEmployeeFromDB(data[0])]);
        }
    };

    const removeEmployee = async (employeeId) => {
        const { error } = await supabase.from('employees').delete().eq('id', employeeId);
        if (!error) {
            setEmployees(employees.filter(e => e.id !== employeeId));
        }
    };

    const updateEmployee = async (updatedEmployee) => {
        const dbEmployee = mapEmployeeToDB(updatedEmployee);
        const { data, error } = await supabase.from('employees').update(dbEmployee).eq('id', updatedEmployee.id).select();
        if (!error && data) {
            const mapped = mapEmployeeFromDB(data[0]);
            setEmployees(employees.map(e => e.id === updatedEmployee.id ? mapped : e));
            return { data: mapped, error: null };
        }
        return { data: null, error };
    };

    const addCustomer = async (customer) => {
        const dbCustomer = mapCustomerToDB(customer);
        const { data, error } = await supabase.from('customers').insert([dbCustomer]).select();
        if (!error && data) {
            const newCustomer = mapCustomerFromDB(data[0]);
            setCustomers([...customers, newCustomer]);
            return newCustomer;
        }
    };

    const updateCustomer = async (updatedCustomer) => {
        const dbCustomer = mapCustomerToDB(updatedCustomer);
        const { data, error } = await supabase.from('customers').update(dbCustomer).eq('id', updatedCustomer.id).select();
        if (!error && data) {
            const mapped = mapCustomerFromDB(data[0]);
            setCustomers(customers.map(c => c.id === updatedCustomer.id ? mapped : c));
        }
    };

    const addLead = async (lead) => {
        const dbLead = mapLeadToDB(lead);
        const { data, error } = await supabase.from('leads').insert([dbLead]).select();
        if (!error && data) {
            const newLead = mapLeadFromDB(data[0]);
            setLeads([...leads, newLead]);
            return newLead;
        }
    };

    const updateLead = async (updatedLead) => {
        const dbLead = mapLeadToDB(updatedLead);
        const { data, error } = await supabase.from('leads').update(dbLead).eq('id', updatedLead.id).select();
        if (!error && data) {
            const mapped = mapLeadFromDB(data[0]);
            setLeads(leads.map(l => l.id === updatedLead.id ? mapped : l));
        }
    };

    const removeLead = async (leadId) => {
        const { error } = await supabase.from('leads').delete().eq('id', leadId);
        if (!error) {
            setLeads(leads.filter(l => l.id !== leadId));
        }
    };

    const addUser = async (user) => {
        // Note: New users should ideally be invited via Supabase Auth Dashboard
        // This just creates the profile record
        const { error } = await supabase
            .from('profiles')
            .insert([{
                id: user.id || undefined, // Expecting UUID from auth if possible
                first_name: user.firstName,
                last_name: user.lastName,
                role: user.role
            }]);

        if (error) console.error('Error adding user profile:', error);
        fetchData();
    };

    const removeUser = async (userId) => {
        if (currentUser && userId === currentUser.id) return;

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) console.error('Error removing user profile:', error);
        fetchData();
    };

    const getEmployee = (id) => employees.find(e => e.id === id);

    const addDocumentationActivity = async (activity) => {
        const { data, error } = await supabase
            .from('documentation_activities')
            .insert([activity])
            .select();

        if (!error && data) {
            setDocumentationActivities(prev => [data[0], ...prev]);
        }
        return { data, error };
    };

    return (
        <DataContext.Provider value={{
            customers,
            products,
            employees,
            leads,
            users,
            documentationActivities,
            currentUser,
            isLoading,
            addProduct,
            removeProduct,
            addEmployee,
            removeEmployee,
            updateEmployee,
            addCustomer,
            updateCustomer,
            addLead,
            updateLead,
            removeLead,
            addDocumentationActivity,
            addUser,
            removeUser,
            login,
            logout,
            hasPermission,
            setCurrentUser,
            getEmployee,
            refreshData: fetchData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
