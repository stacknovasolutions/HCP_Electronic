// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** React Imports
import { useState } from 'react'

// ** Demo Components Imports
import AddGst from 'src/views/apps/gst/AddGst'
import ViewGstDetails from 'src/views/apps/gst/ViewGstDetails'
import TableGst from 'src/views/apps/gst/TableGst'
import DeleteGst from 'src/views/apps/gst/DeleteGst'

const GST = () => {
  // ** States
  const [show, setShow] = useState(false)
  const [showGstDetails, setShowGstDetails] = useState(false)
  const [deleteShow, setShowDeleteShow] = useState(false)
  const [defaultData, setDefaultData] = useState()

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>GST Details</Typography>}
        subtitle={
          <Typography variant='body2'>

          </Typography>
        }
      />
      <Grid item xs={12}>
        <TableGst deleteShow={deleteShow} setShowDeleteShow={setShowDeleteShow} defaultData={defaultData} setDefaultData={setDefaultData} setShow={setShow} show={show} showGstDetails={showGstDetails} setShowGstDetails={setShowGstDetails} />
      </Grid>
      <AddGst setDefaultData={setDefaultData} defaultData={defaultData} show={show} setShow={setShow} />
      <ViewGstDetails defaultData={defaultData} show={showGstDetails} setShow={setShowGstDetails} />
      <DeleteGst open={deleteShow} setOpen={setShowDeleteShow} defaultData={defaultData} />
    </Grid>
  )
}

GST.acl = {
  action: 'Read',
  subject: 'GST'
}

export default GST
