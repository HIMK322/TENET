export const ar = {
  // Navigation
  nav: {
    dashboard: 'لوحة التحكم',
    buildings: 'المباني',
    units: 'الوحدات',
    tenants: 'المستأجرين',
    rentPayments: 'مدفوعات الإيجار',
    appName: 'نظام المستأجرين'
  },
  
  // Dashboard
  dashboard: {
    title: 'لوحة التحكم',
    stats: {
      buildings: 'المباني',
      totalUnits: 'إجمالي الوحدات',
      vacantUnits: 'الوحدات الشاغرة',
      currentTenants: 'المستأجرين الحاليين',
      viewAll: 'عرض الكل'
    },
    quickActions: {
      title: 'إجراءات سريعة',
      viewVacantUnits: 'عرض الوحدات الشاغرة',
      viewVacantUnitsDesc: 'تحقق من الوحدات المتاحة للإيجار',
      addNewTenant: 'إضافة مستأجر جديد',
      addNewTenantDesc: 'تسجيل مستأجر جديد',
      recordRentPayment: 'تسجيل دفعة إيجار',
      recordRentPaymentDesc: 'إضافة دفعة إيجار جديدة',
      addNewBuilding: 'إضافة مبنى جديد',
      addNewBuildingDesc: 'تسجيل عقار جديد'
    }
  },
  
  // Buildings
  buildings: {
    title: 'المباني',
    addNew: 'إضافة مبنى جديد',
    noBuildings: 'لم يتم العثور على مباني. ابدأ بإضافة مبناك الأول.',
    viewDetails: 'عرض التفاصيل',
    units: 'الوحدات',
    editBuilding: 'تعديل المبنى',
    deleteBuilding: 'حذف',
    backToBuildings: 'العودة إلى المباني',
    confirmDelete: 'تأكيد الحذف',
    confirmDeleteMessage: 'هل أنت متأكد من حذف هذا المبنى؟ لا يمكن التراجع عن هذا الإجراء.',
    cancel: 'إلغاء',
    form: {
      title: 'إضافة مبنى جديد',
      editTitle: 'تعديل المبنى',
      name: 'اسم المبنى',
      address: 'العنوان',
      description: 'الوصف',
      layoutMap: 'رابط خريطة المخطط',
      save: 'حفظ المبنى',
      saving: 'جاري الحفظ...'
    },
    details: {
      address: 'العنوان',
      description: 'الوصف',
      units: 'الوحدات',
      noUnits: 'لم يتم العثور على وحدات في هذا المبنى.',
      addUnit: 'إضافة وحدة'
    }
  },
  
  // Units
  units: {
    title: 'جميع الوحدات',
    vacantTitle: 'الوحدات الشاغرة',
    addNew: 'إضافة وحدة جديدة',
    viewAll: 'عرض جميع الوحدات',
    viewVacantOnly: 'عرض الشاغرة فقط',
    noUnits: 'لم يتم العثور على وحدات. ابدأ بإضافة وحدتك الأولى.',
    noVacantUnits: 'لم يتم العثور على وحدات شاغرة.',
    viewDetails: 'عرض التفاصيل',
    unitNumber: 'الوحدة',
    building: 'المبنى',
    type: 'النوع',
    lastRent: 'آخر إيجار',
    currentTenant: 'المستأجر الحالي',
    occupied: 'مشغولة',
    vacant: 'شاغرة',
    editUnit: 'تعديل الوحدة',
    deleteUnit: 'حذف',
    backToUnits: 'العودة إلى الوحدات',
    status: 'الحالة',
    rentPeriod: 'فترة الإيجار',
    monthly: 'شهري',
    yearly: 'سنوي',
    types: {
      shop: 'محل',
      apartment: 'شقة'
    },
    form: {
      title: 'إضافة وحدة جديدة',
      editTitle: 'تعديل الوحدة',
      building: 'المبنى',
      selectBuilding: 'اختر المبنى',
      tenant: 'المستأجرين',
      selectTenant: 'اختر المستأجر',
      unitNumber: 'رقم الوحدة',
      type: 'نوع الوحدة',
      rentPeriod: 'فترة الإيجار',
      lastRentAmount: 'مبلغ الإيجار الأخير',
      save: 'حفظ الوحدة',
      saving: 'جاري الحفظ...',
      cancel: 'إلغاء'
    },
    details: {
      building: 'المبنى',
      tenant: 'المستأجر',
      noTenant: 'لا يوجد مستأجر',
      type: 'النوع',
      rentPeriod: 'فترة الإيجار',
      lastRentAmount: 'مبلغ الإيجار الأخير',
      currentTenant: 'المستأجر الحالي',
      moveOutTenant: 'إخلاء المستأجر',
      moveInTenant: 'إضافة مستأجر',
      confirmMoveOut: 'تأكيد الإخلاء',
      confirmMoveOutMessage: 'هل أنت متأكد من إخلاء المستأجر الحالي؟ سيتم تحديد الوحدة كشاغرة.',
      rentHistory: 'سجل الإيجار',
      noRentHistory: 'لم يتم تسجيل دفعات إيجار لهذه الوحدة.',
      recordPayment: 'تسجيل دفعة'
    }
  },
  
  // Tenants
  tenants: {
    title: 'المستأجرين الحاليين',
    addNew: 'إضافة مستأجر جديد',
    noTenants: 'لم يتم العثور على مستأجرين. ابدأ بإضافة مستأجرك الأول.',
    viewDetails: 'عرض التفاصيل',
    currentTenant: 'مستأجر حالي',
    formerTenant: 'مستأجر سابق',
    editTenant: 'تعديل المستأجر',
    deleteTenant: 'حذف',
    backToTenants: 'العودة إلى المستأجرين',
    form: {
      title: 'إضافة مستأجر جديد',
      editTitle: 'تعديل المستأجر',
      moveInTitle: 'إضافة مستأجر جديد',
      name: 'اسم المستأجر',
      phoneNumber: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      address: 'العنوان',
      unit: 'الوحدة',
      selectUnit: 'اختر الوحدة',
      rentAmount: 'مبلغ الإيجار',
      save: 'إضافة مستأجر',
      update: 'تحديث المستأجر',
      moveIn: 'إضافة المستأجر',
      saving: 'جاري الحفظ...',
      cancel: 'إلغاء'
    },
    details: {
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      address: 'العنوان',
      currentUnit: 'الوحدة الحالية',
      moveInDate: 'تاريخ الإضافة',
      occupancyHistory: 'سجل الإقامة',
      noOccupancyHistory: 'لم يتم العثور على سجل إقامة.',
      rentPaymentHistory: 'سجل دفعات الإيجار',
      noRentHistory: 'لم يتم تسجيل دفعات إيجار لهذا المستأجر.',
      recordPayment: 'تسجيل دفعة'
    }
  },
  
  // Rent Payments
  rentPayments: {
    title: 'دفعات الإيجار',
    recordPayment: 'تسجيل دفعة',
    cancel: 'إلغاء',
    noPayments: 'لم يتم تسجيل دفعات إيجار بعد.',
    recordFirst: 'تسجيل أول دفعة',
    form: {
      title: 'تسجيل دفعة إيجار',
      tenant: 'المستأجر',
      selectTenant: 'اختر أو ابحث عن مستأجر...',
      unit: 'الوحدة',
      selectUnit: 'اختر أو ابحث عن وحدة...',
      amount: 'المبلغ',
      paymentDate: 'تاريخ الدفع',
      rentMonth: 'شهر الإيجار',
      rentPeriod: 'فترة الإيجار',
      paymentMethod: 'طريقة الدفع',
      notes: 'ملاحظات',
      record: 'تسجيل الدفعة',
      recording: 'جاري التسجيل...',
      success: 'تم تسجيل الدفعة بنجاح!',
      payingForMonths: 'الدفع عن {count} أشهر ({amount}$ × {count})',
      payingConsecutive: 'الدفع عن {count} أشهر متتالية بدءاً من {month}',
      payingForYear: 'الدفع عن سنة كاملة',
      selectPeriod: 'اختر فترة الإيجار...'
    },
    table: {
      paymentDate: 'تاريخ الدفع',
      tenant: 'المستأجر',
      unit: 'الوحدة',
      amount: 'المبلغ',
      rentPeriod: 'فترة الإيجار',
      rentMonth: 'شهر الإيجار',
      method: 'الطريقة',
      actions: 'الإجراءات',
      view: 'عرض'
    },
    periodTypes: {
      monthly: 'شهري',
      yearly: 'سنوي'
    }
  },
  
  // Common
  common: {
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجاح',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    back: 'رجوع',
    confirmDelete: 'تأكيد الحذف',
    actions: 'الإجراءات',
    status: 'الحالة',
    date: 'التاريخ',
    amount: 'المبلغ',
    unknown: 'غير معروف',
    na: 'غير متوفر',
    past: 'سابق',
    current: 'حالي'
  },
  
  // Payment Methods
  paymentMethods: {
    cash: 'نقدي',
    check: 'شيك',
    bankTransfer: 'تحويل بنكي',
    creditCard: 'بطاقة ائتمان'
  }
};
