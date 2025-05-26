const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: 'mdi:home-outline',
      path: '/apps/dashboard',
      action: 'Read',
      subject: 'dashboard'
    },
    {
      title: 'Admin',
      icon: 'mdi:account-outline',
      children: [
        {
          title: 'User',
          path: '/apps/user/list',
          action: 'Read',
          subject: 'User'
        },
        {
          title: 'Company',
          path: '/apps/company',
          action: 'Read',
          subject: 'Company'
        }
      ]
    },
    {
      title: 'Roles & Permissions',
      icon: 'mdi:shield-outline',
      children: [
        {
          title: 'System Page',
          path: '/apps/pages',
          action: 'Read',
          subject: 'Pages'
        },
        {
          title: 'Roles',
          path: '/apps/roles',
          action: 'Read',
          subject: 'Role'
        },
        {
          title: 'Roles & Permissions',
          path: '/apps/rolepages',
          action: 'Read',
          subject: 'RoleWise'
        }
      ]
    },
    {
      title: 'Products',
      icon: 'mdi:shield-outline',
      children: [
        {
          title: 'Category',
          icon: 'mdi:shield-outline',
          path: '/apps/category',
          action: 'Read',
          subject: 'Category'
        },
        {
          title: 'Products',
          icon: 'mdi:shield-outline',
          path: '/apps/product',
          action: 'Read',
          subject: 'Product'
        },
        {
          title: 'GST',
          icon: 'mdi:shield-outline',
          path: '/apps/gst',
          action: 'Read',
          subject: 'GST'
        },
      ]
    },
    {
      title: 'CRM',
      icon: 'mdi:shield-outline',
      children: [
        {
          title: 'Inquiry',
          icon: 'mdi:shield-outline',
          path: '/apps/inquiry',
          action: 'Read',
          subject: 'Inquiry'
        },
        {
          title: 'Complain',
          icon: 'mdi:shield-outline',
          path: '/apps/complain',
          action: 'Read',
          subject: 'Complain'
        },
        {
          title: 'Quotation',
          icon: 'mdi:shield-outline',
          path: '/apps/quotation',
          action: 'Read',
          subject: 'Quotation'
        },
        {
          title: 'Term & Condition',
          icon: 'mdi:shield-outline',
          path: '/apps/termcondition',
          action: 'Read',
          subject: 'TermCondition'
        },
      ]
    },
  ]
}

export default navigation
