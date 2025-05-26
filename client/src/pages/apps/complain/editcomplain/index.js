// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports
import FormLayoutsTabs from 'src/views/forms/form-layouts/FormLayoutsTabs'
import FormLayoutsBasic from 'src/views/forms/form-layouts/FormLayoutsBasic'
import FormLayoutsIcons from 'src/views/forms/form-layouts/FormLayoutsIcons'
import FormLayoutsSeparator from 'src/views/apps/complain/editcomplain/FormLayoutsSeparator'
import FormLayoutsAlignment from 'src/views/forms/form-layouts/FormLayoutsAlignment'
import FormLayoutsCollapsible from 'src/views/forms/form-layouts/FormLayoutsCollapsible'

const FormLayouts = () => {
    return (
        <DatePickerWrapper>
            <Grid container spacing={6}>

                <Grid item xs={12}>
                    <FormLayoutsSeparator />
                </Grid>
            </Grid>
        </DatePickerWrapper>
    )
}

export default FormLayouts
