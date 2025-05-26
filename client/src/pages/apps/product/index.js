// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import Table from 'src/views/apps/product/Table'
import { CardHeader, Divider } from '@mui/material'
import axios from 'axios'
import AddProduct from 'src/views/apps/product/AddProduct'
import ViewProduct from 'src/views/apps/product/ViewProduct'
import DeleteProduct from 'src/views/apps/product/DeleteProduct'

const Product = ({ apiData }) => {
  // ** States
  const [show, setShow] = useState(false)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState(false)
  const [defaultData, setDefaultData] = useState()

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Product Details</Typography>}
      />
      {/* <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon} />} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <Grid item xs={12}>
            <Table setDeleteProduct={setDeleteProduct} deleteProduct={deleteProduct} setShow={setShow} show={show} setShowProductDetails={setShowProductDetails} showProductDetails={showProductDetails} defaultData={defaultData} setDefaultData={setDefaultData} />
          </Grid>

        </Card>
      </Grid>
      <DeleteProduct defaultData={defaultData} open={deleteProduct} setOpen={setDeleteProduct} />
      <ViewProduct defaultData={defaultData} show={showProductDetails} setShow={setShowProductDetails} />
      <AddProduct defaultData={defaultData} show={show} setShow={setShow} />
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

Product.acl = {
  action: 'Read',
  subject: 'Product'
}

export default Product
