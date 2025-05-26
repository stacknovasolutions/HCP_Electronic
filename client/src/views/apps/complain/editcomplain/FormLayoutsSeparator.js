// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CardSnippet from 'src/@core/components/card-snippet'
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const FormLayoutsSeparator = () => {
  // ** States
  const [date, setDate] = useState(null)
  const [language, setLanguage] = useState([])

  const [values, setValues] = useState({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false
  })

  // Handle Password
  const handlePasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  // Handle Confirm Password
  const handleConfirmChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 })
  }

  // Handle Select
  const handleSelectChange = event => {
    setLanguage(event.target.value)
  }

  return (
    <Card>
      <CardHeader title='Complain Edit' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Customer Info
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='country-select'>Customer ID</InputLabel>
                <Select
                  fullWidth
                  placeholder='UK'
                  label='Country'
                  labelId='country-select'
                  defaultValue='Select Country'
                >
                  <MenuItem value='Select Country'>Customer ID</MenuItem>
                  <MenuItem value='France'>France</MenuItem>
                  <MenuItem value='Russia'>Russia</MenuItem>
                  <MenuItem value='China'>China</MenuItem>
                  <MenuItem value='UK'>UK</MenuItem>
                  <MenuItem value='US'>US</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Assign Info
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='country-select'>Assign ID</InputLabel>
                <Select
                  fullWidth
                  placeholder='UK'
                  label='Country'
                  labelId='country-select'
                  defaultValue='Select Country'
                >
                  <MenuItem value='Select Country'>Assign ID</MenuItem>
                  <MenuItem value='France'>France</MenuItem>
                  <MenuItem value='Russia'>Russia</MenuItem>
                  <MenuItem value='China'>China</MenuItem>
                  <MenuItem value='UK'>UK</MenuItem>
                  <MenuItem value='US'>US</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='country-select'>Technician ID</InputLabel>
                <Select
                  fullWidth
                  placeholder='UK'
                  label='Country'
                  labelId='country-select'
                  defaultValue='Select Country'
                >
                  <MenuItem value='Select Country'>Technician ID</MenuItem>
                  <MenuItem value='France'>France</MenuItem>
                  <MenuItem value='Russia'>Russia</MenuItem>
                  <MenuItem value='China'>China</MenuItem>
                  <MenuItem value='UK'>UK</MenuItem>
                  <MenuItem value='US'>US</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Sort Desc' placeholder='Mall Road' />
            </Grid>
            <Grid item xs={12}>
              <TextField multiline rows={3} fullWidth label='Long Desc' placeholder='1456, Liberty Street' />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                3. Followup Info
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Sort Note' placeholder='Mall Road' />
            </Grid>
            <Grid item xs={12}>
              <TextField multiline rows={3} fullWidth label='Long Note' placeholder='1456, Liberty Street' />
            </Grid>
            <Grid item xs={12}>
              <CardSnippet
                title='Upload Multiple Files'
                code={{
                  tsx: null,
                  jsx: null
                }}
              >
                <FileUploaderMultiple />
              </CardSnippet>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Followup Date' placeholder='Mall Road' />
            </Grid>

          </Grid>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button>
          <Button type='reset' size='large' color='secondary' variant='outlined'>
            Reset
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormLayoutsSeparator
