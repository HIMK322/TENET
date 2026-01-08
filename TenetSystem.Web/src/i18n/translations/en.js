export const en = {
  // Navigation
  nav: {
    dashboard: 'Dashboard',
    buildings: 'Buildings',
    units: 'Units',
    tenants: 'Tenants',
    rentPayments: 'Rent Payments',
    appName: 'Tenet System'
  },
  
  // Dashboard
  dashboard: {
    title: 'Dashboard',
    stats: {
      buildings: 'Buildings',
      totalUnits: 'Total Units',
      vacantUnits: 'Vacant Units',
      currentTenants: 'Current Tenants',
      viewAll: 'View All'
    },
    quickActions: {
      title: 'Quick Actions',
      viewVacantUnits: 'View Vacant Units',
      viewVacantUnitsDesc: 'Check available units for rent',
      addNewTenant: 'Add New Tenant',
      addNewTenantDesc: 'Register a new tenant',
      recordRentPayment: 'Record Rent Payment',
      recordRentPaymentDesc: 'Add a new rent payment',
      addNewBuilding: 'Add New Building',
      addNewBuildingDesc: 'Register a new property'
    }
  },
  
  // Buildings
  buildings: {
    title: 'Buildings',
    addNew: 'Add New Building',
    noBuildings: 'No buildings found. Start by adding your first building.',
    viewDetails: 'View Details',
    units: 'Units',
    editBuilding: 'Edit Building',
    deleteBuilding: 'Delete',
    backToBuildings: 'Back to Buildings',
    confirmDelete: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete this building? This action cannot be undone.',
    cancel: 'Cancel',
    form: {
      title: 'Add New Building',
      editTitle: 'Edit Building',
      name: 'Building Name',
      address: 'Address',
      description: 'Description',
      layoutMap: 'Layout Map URL',
      save: 'Save Building',
      saving: 'Saving...'
    },
    details: {
      address: 'Address',
      description: 'Description',
      units: 'Units',
      noUnits: 'No units found in this building.',
      addUnit: 'Add Unit'
    }
  },
  
  // Units
  units: {
    title: 'All Units',
    vacantTitle: 'Vacant Units',
    addNew: 'Add New Unit',
    viewAll: 'View All Units',
    viewVacantOnly: 'View Vacant Only',
    noUnits: 'No units found. Start by adding your first unit.',
    noVacantUnits: 'No vacant units found.',
    viewDetails: 'View Details',
    unitNumber: 'Unit',
    building: 'Building',
    type: 'Type',
    lastRent: 'Last Rent',
    currentTenant: 'Current Tenant',
    occupied: 'Occupied',
    vacant: 'Vacant',
    editUnit: 'Edit Unit',
    deleteUnit: 'Delete',
    backToUnits: 'Back to Units',
    status: 'Status',
    rentPeriod: 'Rent Period',
    monthly: 'Monthly',
    yearly: 'Yearly',
    types: {
      shop: 'Shop',
      apartment: 'Apartment'
    },
    form: {
      title: 'Add New Unit',
      editTitle: 'Edit Unit',
      building: 'Building',
      selectBuilding: 'Select Building',
      tenant: 'Tenants',
      selectTenant: 'Select Tenant',
      unitNumber: 'Unit Number',
      type: 'Unit Type',
      rentPeriod: 'Rent Period',
      lastRentAmount: 'Last Rent Amount',
      save: 'Save Unit',
      saving: 'Saving...',
      cancel: 'Cancel'
    },
    details: {
      building: 'Building',
      tenant: 'Tenant',
      noTenant: 'No Tenant',
      type: 'Type',
      rentPeriod: 'Rent Period',
      lastRentAmount: 'Last Rent Amount',
      currentTenant: 'Current Tenant',
      moveOutTenant: 'Move Out Tenant',
      moveInTenant: 'Move In Tenant',
      confirmMoveOut: 'Confirm Move Out',
      confirmMoveOutMessage: 'Are you sure you want to move out the current tenant? This action will mark the unit as vacant.',
      rentHistory: 'Rent History',
      noRentHistory: 'No rent payments recorded for this unit.',
      recordPayment: 'Record Payment'
    }
  },
  
  // Tenants
  tenants: {
    title: 'Current Tenants',
    addNew: 'Add New Tenant',
    noTenants: 'No tenants found. Start by adding your first tenant.',
    viewDetails: 'View Details',
    currentTenant: 'Current Tenant',
    formerTenant: 'Former Tenant',
    editTenant: 'Edit Tenant',
    deleteTenant: 'Delete',
    backToTenants: 'Back to Tenants',
    form: {
      title: 'Add New Tenant',
      editTitle: 'Edit Tenant',
      moveInTitle: 'Move-In New Tenant',
      name: 'Tenant Name',
      phoneNumber: 'Phone Number',
      email: 'Email',
      address: 'Address',
      unit: 'Unit',
      selectUnit: 'Select Unit',
      rentAmount: 'Rent Amount',
      save: 'Add Tenant',
      update: 'Update Tenant',
      moveIn: 'Move In Tenant',
      saving: 'Saving...',
      cancel: 'Cancel'
    },
    details: {
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      currentUnit: 'Current Unit',
      moveInDate: 'Move-in Date',
      occupancyHistory: 'Occupancy History',
      noOccupancyHistory: 'No occupancy history found.',
      rentPaymentHistory: 'Rent Payment History',
      noRentHistory: 'No rent payments recorded for this tenant.',
      recordPayment: 'Record Payment'
    }
  },
  
  // Rent Payments
  rentPayments: {
    title: 'Rent Payments',
    recordPayment: 'Record Payment',
    cancel: 'Cancel',
    noPayments: 'No rent payments recorded yet.',
    recordFirst: 'Record First Payment',
    form: {
      title: 'Record Rent Payment',
      tenant: 'Tenant',
      selectTenant: 'Select or search tenant...',
      unit: 'Unit',
      selectUnit: 'Select or search unit...',
      amount: 'Amount',
      paymentDate: 'Payment Date',
      rentMonth: 'Rent Month',
      rentPeriod: 'Rent Period',
      paymentMethod: 'Payment Method',
      notes: 'Notes',
      record: 'Record Payment',
      recording: 'Recording...',
      success: 'Payment recorded successfully!',
      payingForMonths: 'Paying for {count} months (${amount} × {count})',
      payingConsecutive: 'Paying for {count} consecutive months starting from {month}',
      payingForYear: 'Paying for full year',
      selectPeriod: 'Select rent period...'
    },
    table: {
      paymentDate: 'Payment Date',
      tenant: 'Tenant',
      unit: 'Unit',
      amount: 'Amount',
      rentPeriod: 'Rent Period',
      rentMonth: 'Rent Month',
      method: 'Method',
      actions: 'Actions',
      view: 'View'
    },
    periodTypes: {
      monthly: 'Monthly',
      yearly: 'Yearly'
    }
  },
  
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    confirmDelete: 'Confirm Delete',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    amount: 'Amount',
    unknown: 'Unknown',
    na: 'N/A',
    past: 'Past',
    current: 'Current'
  },
  
  // Payment Methods
  paymentMethods: {
    cash: 'Cash',
    check: 'Check',
    bankTransfer: 'Bank Transfer',
    creditCard: 'Credit Card'
  }
};
