// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** React Imports
import { useState } from 'react'

// ** Import Company Component 
import AddCompany from 'src/views/apps/company/AddCompany'
import ViewCompany from 'src/views/apps/company/ViewCompany'
import TableCompany from 'src/views/apps/company/TableCompany'
import DeleteCompany from 'src/views/apps/company/DeleteCompany'

const Company = () => {
  // ** States
  const [show, setShow] = useState(false)
  const [showCompanyDetails, setShowCompanyDetails] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeleteCompany, setShowDeleteCompany] = useState(false)

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Company Details</Typography>}
        subtitle={
          <Typography variant='body2'>
          </Typography>
        }
      />
      <Grid item xs={12}>
        <TableCompany showDeleteCompany={showDeleteCompany} setShowDeleteCompany={setShowDeleteCompany} selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} setShow={setShow} show={show} setShowCompanyDetails={setShowCompanyDetails} showCompanyDetails={showCompanyDetails} />
      </Grid>
      <DeleteCompany defaultData={selectedCompany} open={showDeleteCompany} setOpen={setShowDeleteCompany} />
      <AddCompany defaultData={selectedCompany} show={show} setShow={setShow} />
      <ViewCompany  defaultData={selectedCompany} show={showCompanyDetails} setShow={setShowCompanyDetails} />
    </Grid>
  )
}

Company.acl = {
  action: 'Read',
  subject: 'Company'
}

export default Company
