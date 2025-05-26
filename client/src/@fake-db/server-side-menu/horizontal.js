// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const navigation = [

  {
    title: 'User',
    icon: 'mdi:account-outline',
    path: '/apps/user/list'
  },
  {
    title: 'Roles & Permissions',
    icon: 'mdi:shield-outline',
    path: '/apps/roles'

  }
]


mock.onGet('/api/horizontal-nav/data').reply(() => {
  return [200, navigation]
})
