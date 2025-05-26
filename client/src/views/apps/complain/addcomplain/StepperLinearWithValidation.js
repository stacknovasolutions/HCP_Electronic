// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import FormLayoutsCollapsible from './FormLayoutsCollapsible'
import CardSnippet from 'src/@core/components/card-snippet'
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import SidebarAddUser from '../../user/list/AddUser'
import { styled } from '@mui/material'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import { useRouter } from 'next/router'
import AddCustomer from '../../AddCustomer'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const steps = [
  {
    title: 'Customer Info',
    subtitle: 'Enter your Customer Info'
  },
  {
    title: 'Assign Info',
    subtitle: 'Enter Your Assign Info'
  },
  {
    title: 'Followup Info',
    subtitle: 'Enter Your Followup Info'
  }
]

const defaultUserValues = {
  userId: ''
}

const defaultComplainDetailsValues = {
  description: '',
  shortDescription: '',
  assignedToUserId: '',
  technicianId: ''
}

const defaultComplainDetailsValues2 = {
  complaintDate: '',
}

const userSchema = yup.object().shape({
  userId: yup.string().required()
})

const complainDetailsSchema = yup.object().shape({
  technicianId: yup.string(),
  description: yup.string().required(),
  shortDescription: yup.string().required(),
  assignedToUserId: yup.string().required()
})

const complainDetailsSchema2 = yup.object().shape({
  complaintDate: yup.date().required(),
})


const StepperLinearWithValidation = () => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)
  const [show, setShow] = useState(false)
  const [userId, setUserId] = useState('');
  const [assignedToUserId, setAssignToUserId] = useState('');
  const [technicianId, setTechnicianId] = useState('')
  const [complainData, setComplainData] = useState()
  const [filePath, setFilePath] = useState()
  const router = useRouter()
  const [userData, setUserData] = useState([])
  const [backOfficeData, setBackOfficeData] = useState([])
  const [TechnicianData, setTechnicianData] = useState([]) 

  const getComplainData = async (id) => {

    const [error, result] = await asyncWrap(axios.get(`/complaint?id=${id}`))

    if (error) {
      toast.error(error)
    } else {
      userReset({
        userId: result.data.data[0]?.UserID
      })
      setUserId(result.data?.data[0].UserID)
      complainDetailsReset({
        description: result.data.data[0]?.Descriptions,
        shortDescription: result.data.data[0]?.ShortDescription,
        assignedToUserId: result.data.data[0]?.AssignedtoUserID,
        technicianId: result.data?.data[0]?.TechnicianID
      })
      setTechnicianId(result.data?.data[0]?.TechnicianID)
      setAssignToUserId(result.data?.data[0].AssignedtoUserID)
      complainDetailsReset2({
        complaintDate: result.data.data[0].ComplainDate ? new Date(result.data?.data[0]?.ComplainDate) : null,
      })
      setFilePath(result.data.data[0]?.FilePath)
      
      // setInquiryDetails(result?.data?.data[0])
    }
  }

  useEffect(() => {
    if (router.query.row) {
      getComplainData(router?.query?.row)
    }
  }, [router.query]);

  // ** Hooks
  const {
    reset: userReset,
    control: userControl,
    handleSubmit: handleUserSubmit,
    register: registerUser,
    formState: { errors: userError }
  } = useForm({
    defaultValues: defaultUserValues,
    resolver: yupResolver(userSchema)
  })

  const {
    reset: complainDetailsReset,
    control: complainDetailsControl,
    register: registerComplainDetails,
    handleSubmit: handleComplainDetailsSubmit,
    formState: { errors: complainDetailsError }
  } = useForm({
    defaultValues: defaultComplainDetailsValues,
    resolver: yupResolver(complainDetailsSchema)
  })

  const {
    reset: complainDetailsReset2,
    control: complainDetailsControl2,
    handleSubmit: handleComplainDetailsSubmit2,
    formState: { errors: complainDetailsError2 }
  } = useForm({
    defaultValues: defaultComplainDetailsValues2,
    resolver: yupResolver(complainDetailsSchema2)
  })

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    userReset({ userId: '' })
    complainDetailsReset({
      description: '',
      technicianId: '',
      shortDescription: '',
      assignedToUserId: ''
    })
    complainDetailsReset2({
      complaintDate: '',
    })
  }

  const onSubmitNextStep = (data) => {
    setComplainData({ ...complainData, ...data })
    console.log({ ...complainData, ...data })
    setActiveStep(activeStep + 1)
  }

  const onSubmitNextStep2 = (data) => {
    console.log(complainData)
    setComplainData({ ...complainData, ...data })
    console.log({ ...complainData, ...data.data })
    setActiveStep(activeStep + 1)
  }

  const handleFileUpload = async e => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    const [error, result] = await asyncWrap(axios.post("/upload", formData));
    if (error) {
      toast.error(error.response.data.message);

      return;
    }

    setFilePath(result.data.fileUrl)
  };

  const onSubmit = async (data) => {

    let requestData = {
      ...data,
      ...complainData,
      filePath
    }

    if (router.query.row) {
      requestData = {
        ...data,
        ...complainData,
        filePath, complaintId: router.query.row || ''
      }
    }

    const [error, result] = await asyncWrap(
      axios.post("/complaint", requestData)
    );
    if (!result) {
      console.log(error);
      toast.error(error.response.data.message);
    } else {
      toast.success(result.data.message)
      router.push('/apps/complain')
    };
  }

  const getUserData = async () => {
    const [error, result] = await asyncWrap(axios.get("/user/customer?pageNo=-1"))

    if (error) {
      toast.error(error)
    } else {
      setUserData(result.data.data)
    }
  }

  const getBackOfficeData = async () => {
    const [error, result] = await asyncWrap(axios.get("/user/staff?pageNo=-1"))

    if (error) {
      toast.error(error)
    } else {
      setBackOfficeData(result.data.data)
    }
  }

  const getTechnicianData = async () => {
    const [error, result] = await asyncWrap(axios.get("/user/technician?pageNo=-1"))

    if (error) {
      toast.error(error)
    } else {
      setTechnicianData(result.data.data)
    }
  }

  useEffect(() => {
    getUserData()
    getBackOfficeData()
    getTechnicianData()
  }, [])

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <>
            <form onSubmit={handleUserSubmit(onSubmitNextStep)} key={0}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[0].title}
                  </Typography>
                  <Typography variant='caption' component='p'>
                    {steps[0].subtitle}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    Select Customer ID
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='country-select'>User Id</InputLabel>
                    <Select
                      fullWidth
                      {...registerUser('userId', { required: true })}
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      label='Select User ID'
                      labelId='country-select'
                      defaultValue='Select User'
                    >
                      {
                        userData.map((item, index) => (
                          <MenuItem key={index} value={item.UserID}>{item.FirstName + " " + item.LastName}</MenuItem>
                        ))
                      }
                    </Select>
                    {userError.userId && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {userError.userId.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button onClick={() => setShow(true)} component="label" variant="contained">
                    Add New Customer
                  </Button>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleBack} size='large' variant='outlined' color='secondary' disabled>
                    Back
                  </Button>
                  <Button size='large' type='submit' variant='contained'>
                    Next
                  </Button>
                </Grid>
              </Grid>
            </form>
            <AddCustomer show={show} setShow={setShow} />
          </>
        )
      case 1:
        return (
          <form onSubmit={handleComplainDetailsSubmit(onSubmitNextStep2)} key={0}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[1].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[1].subtitle}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ mb: '0 !important' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='shortDescription'
                    control={complainDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Short Description'
                        type='text'
                        onChange={onChange}
                        error={Boolean(complainDetailsError.shortDescription)}
                      />
                    )}
                  />
                  {complainDetailsError.shortDescription && <FormHelperText sx={{ color: 'error.main' }}>{complainDetailsError.shortDescription.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='description'
                    control={complainDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        multiline
                        rows={3}
                        fullWidth label='Long Desc'
                        onChange={onChange}
                        error={Boolean(complainDetailsError.description)}
                      />
                    )}
                  />
                  {complainDetailsError.description && <FormHelperText sx={{ color: 'error.main' }}>{complainDetailsError.description.message}</FormHelperText>}
                </FormControl>
              </Grid>


              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  Select Assign ID
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='country-select'>Assign to User</InputLabel>
                  <Select
                    fullWidth
                    {...registerComplainDetails('assignedToUserId', { required: true })}
                    value={assignedToUserId}
                    onChange={(e) => setAssignToUserId(e.target.value)}
                    label='Select User ID'
                    labelId='country-select'
                    defaultValue='Select User'
                  >
                    {
                      backOfficeData.map((item, index) => (
                        <MenuItem key={index} value={item.UserID}>{item.FirstName + " " + item.LastName}</MenuItem>
                      ))
                    }
                  </Select>
                  {complainDetailsError.assignedToUserId && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {complainDetailsError.assignedToUserId.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  Assign to Technician
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='country-select'>Assign to Technician</InputLabel>
                  <Select
                    fullWidth
                    {...registerComplainDetails('technicianId', { required: true })}
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                    label='Select User ID'
                    labelId='country-select'
                    defaultValue='Select User'
                  >
                    {
                      TechnicianData.map((item, index) => (
                        <MenuItem key={index} value={item.UserID}>{item.FirstName + " " + item.LastName}</MenuItem>
                      ))
                    }
                  </Select>
                  {complainDetailsError.technicianId && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {complainDetailsError.technicianId.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>





              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveStep(activeStep - 1)} size='large' variant='outlined' color='secondary'>
                  Back
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 2:
        return (
          <form onSubmit={handleComplainDetailsSubmit2(onSubmit)} key={0}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[2].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[2].subtitle}
                </Typography>
              </Grid>



              <Grid item xs={12}>
                <Button component="label" variant="contained">
                  Upload file
                  <VisuallyHiddenInput onChange={(event) => handleFileUpload(event)} type="file" />
                </Button>
              </Grid>

              {
                filePath && (<Grid item xs={12}>
                  <a href={filePath} >download file</a></Grid>
                )
              }

              <Grid item xs={12} sx={6}>
                <DatePickerWrapper>
                  <Controller
                    name='complaintDate'
                    control={complainDetailsControl2}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        showYearDropdown
                        showMonthDropdown
                        onChange={onChange}
                        placeholderText='MM/DD/YYYY'
                        customInput={
                          <CustomInput
                            value={value}
                            onChange={onChange}
                            label='Date'
                            error={Boolean(complainDetailsError2.complaintDate)}
                          />
                        }
                      />
                    )}
                  />
                  {complainDetailsError2.complaintDate && (
                    <FormHelperText sx={{ mx: 3.5, color: 'error.main' }}>
                      {complainDetailsError2.complaintDate.message}
                    </FormHelperText>
                  )}</DatePickerWrapper>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveStep(activeStep - 1)} size='large' variant='outlined' color='secondary'>
                  Back
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {}
              if (index === activeStep) {
                labelProps.error = false
                if (
                  (userError.userId) &&
                  activeStep === 0
                ) {
                  labelProps.error = true
                } else if (
                  (complainDetailsError.description ||
                    complainDetailsError.shortDescription ||
                    complainDetailsError.assignedToUserId ||
                    complainDetailsError.technicianId) &&
                  activeStep === 1
                ) {
                  labelProps.error = true
                } else if (
                  (complainDetailsError2.complaintDate) &&
                  activeStep === 2
                ) {
                  labelProps.error = true
                } else {
                  labelProps.error = false
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`0${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

export default StepperLinearWithValidation
