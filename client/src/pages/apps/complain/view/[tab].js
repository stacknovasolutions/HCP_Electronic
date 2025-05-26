// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/complain/view/UserViewPage'

const UserView = ({ tab, invoiceData }) => {
  return <UserViewPage tab={tab} invoiceData={invoiceData} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'user_detail' } },
      { params: { tab: 'company_detail' } },
      { params: { tab: 'followup_detail' } },
    ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const res = await axios.get('/apps/invoice/invoices')
  const invoiceData = res.data.allData

  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}

export default UserView
