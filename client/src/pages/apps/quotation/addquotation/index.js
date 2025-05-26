// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import StepperLinearWithValidation from 'src/views/apps/quotation/addquotation/StepperLinearWithValidation'

const AddQuotation = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6'>Quotation</Typography>
      </Grid>
      <Grid item xs={12}>
        <StepperLinearWithValidation />
      </Grid>

    </Grid>
  )
}

AddQuotation.acl = {
  action: 'Create',
  subject: 'Quotation'
}

export default AddQuotation
