// ** React Imports
import { Fragment, forwardRef, useEffect, useState } from 'react'

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
import { styled } from '@mui/material'
import SidebarAddUser from '../../user/list/AddUser'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import { useRouter } from 'next/router'
import AddCustomer from '../../AddCustomer'

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

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const steps = [
  {
    title: 'Customer Info',
    subtitle: 'Enter your Customer Info'
  },
  {
    title: 'Assignment Info',
    subtitle: 'Enter Your Assignment Info'
  },
  {
    title: 'Followup Info',
    subtitle: 'Enter Your Followup Info'
  }
]

const defaultUserValues = {
  userId: ''
}

const defaultInquiryDetailsValues = {
  inquiryDescription: '',
  shortDescription: '',
  assignedtoUserID: ''
}

const defaultInquiryDetailsValues2 = {
  statusDate: '',
}

const userSchema = yup.object().shape({
  userId: yup.string().required()
})

const inquiryDetailsSchema = yup.object().shape({
  inquiryDescription: yup.string().required(),
  shortDescription: yup.string().required(),
  assignedtoUserID: yup.string().required()
})

const inquiryDetailsSchema2 = yup.object().shape({
  statusDate: yup.date().required(),
})

const StepperLinearWithValidation = ({ inquiryDetails, setInquiryDetails }) => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState('');
  const [assignedtoUserID, setAssignToUserId] = useState('');
  const [inquiryData, setInquiryData] = useState()
  const [filePath, setFilePath] = useState()
  const [userData, setUserData] = useState([])
  const [backOfficeData, setBackOfficeData] = useState()
  const router = useRouter()

  const getInquiryData = async (id) => {

    const [error, result] = await asyncWrap(axios.get(`/inquiry?id=${id}`))

    if (error) {
      toast.error(error)
    } else {
      userReset({
        userId: result.data.data[0]?.UserID
      })
      setUserId(result.data?.data[0].UserID)
      inquiryDetailsReset({
        inquiryDescription: result.data.data[0]?.InquiryDescription,
        shortDescription: result.data.data[0]?.ShortDescription,
        assignedtoUserID: result.data.data[0]?.AssignedtoUserID
      })
      setAssignToUserId(result.data?.data[0].AssignedtoUserID)
      inquiryDetailsReset2({
        statusDate: result.data.data[0].StatusDate ? new Date(result.data?.data[0]?.StatusDate) : null,
      })
      setFilePath(result.data.data[0]?.FilePath)

      // setInquiryDetails(result?.data?.data[0])
    }
  }

  useEffect(() => {
    if (router.query.row) {
      getInquiryData(router?.query?.row)
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
    reset: inquiryDetailsReset,
    control: inquiryDetailsControl,
    register: registerInquiryDetails,
    handleSubmit: handleInquiryDetailsSubmit,
    formState: { errors: inquiryDetailsError }
  } = useForm({
    defaultValues: defaultInquiryDetailsValues,
    resolver: yupResolver(inquiryDetailsSchema)
  })

  const {
    reset: inquiryDetailsReset2,
    control: inquiryDetailsControl2,
    handleSubmit: handleInquiryDetailsSubmit2,
    formState: { errors: inquiryDetailsError2 }
  } = useForm({
    defaultValues: defaultInquiryDetailsValues2,
    resolver: yupResolver(inquiryDetailsSchema2)
  })

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    userReset({ userId: '' })
    inquiryDetailsReset({
      inquiryDescription: '',
      shortDescription: '',
      assignedtoUserID: ''
    })
    inquiryDetailsReset2({
      statusDate: '',
    })
  }

  const onSubmitNextStep = (data) => {
    setInquiryData({ ...inquiryData, ...data })
    console.log({ ...inquiryData, ...data })
    setActiveStep(activeStep + 1)
  }

  const onSubmitNextStep2 = (data) => {
    console.log(inquiryData)
    setInquiryData({ ...inquiryData, ...data })
    console.log({ ...inquiryData, ...data })
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
      ...inquiryData,
      filePath
    }

    if (router.query.row) {
      requestData = {
        ...data,
        ...inquiryData,
        filePath,
        inquriyId: router.query.row || ''
      }
    }

    const [error, result] = await asyncWrap(
      axios.post("/inquiry", requestData)
    );
    if (!result) {
      console.log(error);
      toast.error(error.response.data.message);
    } else {
      toast.success(result.data.message)
      router.push('/apps/inquiry')
    };
  }


  const getUserData = async () => {
    const [error, result] = await asyncWrap(axios.get("/user/customer?pageNo=-1"))

    if (error) {
      toast.error(error)
    } else {
      setUserData(result?.data?.data)
    }
  }

  const getBackOfficeData = async () => {
    const [error, result] = await asyncWrap(axios.get("/user/staff?pageNo=-1"))

    if (error) {
      toast.error(error)
    } else {
      setBackOfficeData(result?.data?.data)
    }
  }

  useEffect(() => {
    getUserData()
    getBackOfficeData()
  }, [])

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <>
            <form onSubmit={handleUserSubmit(onSubmitNextStep)} key={0}>
              <Grid container spacing={5}>
                {/* <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[0].title}
                  </Typography>
                  <Typography variant='caption' component='p'>
                    {steps[0].subtitle}
                  </Typography>
                </Grid> */}
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
          <form onSubmit={handleInquiryDetailsSubmit(onSubmitNextStep2)} key={0}>
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
                    control={inquiryDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Short Description'
                        type='text'
                        onChange={onChange}
                        error={Boolean(inquiryDetailsError.shortDescription)}
                      />
                    )}
                  />
                  {inquiryDetailsError.shortDescription && <FormHelperText sx={{ color: 'error.main' }}>{inquiryDetailsError.shortDescription.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='inquiryDescription'
                    control={inquiryDetailsControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        multiline
                        rows={3}
                        fullWidth label='Long Desc'
                        onChange={onChange}
                        error={Boolean(inquiryDetailsError.inquiryDescription)}
                      />
                    )}
                  />
                  {inquiryDetailsError.inquiryDescription && <FormHelperText sx={{ color: 'error.main' }}>{inquiryDetailsError.inquiryDescription.message}</FormHelperText>}
                </FormControl>
              </Grid>


              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  Select Assign ID
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='country-select'>Select Assign User Id</InputLabel>
                  <Select
                    fullWidth
                    {...registerInquiryDetails('assignedtoUserID', { required: true })}
                    value={assignedtoUserID}
                    onChange={(e) => setAssignToUserId(e.target.value)}
                    label='Select User ID'
                    labelId='country-select'
                    defaultValue='Select User'
                  >
                    {
                      backOfficeData?.map((item, index) => (
                        <MenuItem key={index} value={item.UserID}>{item.FirstName + " " + item.LastName}</MenuItem>
                      ))
                    }
                  </Select>
                  {inquiryDetailsError.assignedtoUserID && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {inquiryDetailsError.assignedtoUserID.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveStep(activeStep - 1)} size='large' variant='outlined' color='secondary' >
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
          <form onSubmit={handleInquiryDetailsSubmit2(onSubmit)} key={0}>
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
                    name='statusDate'
                    control={inquiryDetailsControl2}
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
                            error={Boolean(inquiryDetailsError2.statusDate)}
                          />
                        }
                      />
                    )}
                  />
                  {inquiryDetailsError2.statusDate && (
                    <FormHelperText sx={{ mx: 3.5, color: 'error.main' }}>
                      {inquiryDetailsError2.statusDate.message}
                    </FormHelperText>
                  )}</DatePickerWrapper>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveStep(activeStep - 1)} size='large' variant='outlined' color='secondary'>
                  Back
                </Button>
                <div style={{ gap: "10px" }}>
                  <Button size='large' type='submit' variant='contained'>
                    Add Quotation
                  </Button>
                  <Button style={{ marginLeft: "10px" }} size='large' type='submit' variant='contained'>
                    Next
                  </Button>
                </div>
                {/* <Button size='large' type='submit' variant='contained'> */}
                {/* Next */}
                {/* </Button> */}
              </Grid>
            </Grid>
          </form >
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
                  (inquiryDetailsError.shortDescription ||
                    inquiryDetailsError.inquiryDescription ||
                    inquiryDetailsError.assignedtoUserID) &&
                  activeStep === 1
                ) {
                  labelProps.error = true
                } else if (
                  (inquiryDetailsError2.statusDate) &&
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
