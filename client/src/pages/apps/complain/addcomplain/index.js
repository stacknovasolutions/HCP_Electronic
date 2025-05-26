// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import StepperAlternativeLabel from 'src/views/forms/form-wizard/StepperAlternativeLabel'
import StepperVerticalWithNumbers from 'src/views/forms/form-wizard/StepperVerticalWithNumbers'
import StepperLinearWithValidation from 'src/views/apps/complain/addcomplain/StepperLinearWithValidation'
import StepperVerticalWithoutNumbers from 'src/views/forms/form-wizard/StepperVerticalWithoutNumbers'
import { useRouter } from 'next/router'

const AddComplain = () => {

    const router = useRouter()

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h6'>{router.query?.row ? "Edit Complain" : "Add Complain"}</Typography>
            </Grid>
            <Grid item xs={12}>
                <StepperLinearWithValidation />
            </Grid>

        </Grid>
    )
}

AddComplain.acl = {
    action: "Create",
    subject: "Complain"
}

export default AddComplain
