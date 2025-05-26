// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import StepperAlternativeLabel from 'src/views/forms/form-wizard/StepperAlternativeLabel'
import StepperVerticalWithNumbers from 'src/views/forms/form-wizard/StepperVerticalWithNumbers'
import StepperLinearWithValidation from 'src/views/apps/inquiry/addinquiry/StepperLinearWithValidation'
import StepperVerticalWithoutNumbers from 'src/views/forms/form-wizard/StepperVerticalWithoutNumbers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddInquiry = () => {

    const router = useRouter()

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h6'>{router.query?.row ? "Edit Inquiry" : "Add Inquiry"}</Typography>
            </Grid>
            <Grid item xs={12}>
                <StepperLinearWithValidation />
            </Grid>

        </Grid>
    )
}

AddInquiry.acl = {
    action: "Create",
    subject: "Inquiry"
}

export default AddInquiry
