// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Dialog, DialogActions, DialogContent, Fade, FormControlLabel, Grid } from '@mui/material'

// import * as yup from 'yup';
import { Radio } from '@mui/material'
import { FormLabel } from '@mui/material'
import RadioGroup from '@mui/material/RadioGroup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// import DatePicker from 'react-datepicker'

import * as yup from 'yup'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  RoleID: yup.string().required('Role ID is required'),
  UserTypeID: yup.string().required("Please select user type"),
  Email: yup.string().email('Invalid email').required('Email is required'),
  FirstName: yup.string().required('First name is required'),
  LastName: yup.string().required('Last name is required'),
  Gender: yup.string().required('Gender is required'),
  Birthdate: yup.date().nullable().required('Birthdate is required'),
  Address: yup.string().required('Address is required'),
  Latitude: yup.number().nullable().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  Longitude: yup.number().nullable().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  RefferalCode: yup.string().nullable(),
  MobileNumber: yup.string().required('Mobile number is required').matches(/^\+?[0-9]{8,15}$/, 'Invalid phone number'),
  stateId: yup.string().required('State ID is required'),
  city: yup.string().required('City is required'),
  pinCode: yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Invalid pincode'),
});

const defaultValues = {
  RoleID: '',
  Email: '',
  FirstName: '',
  LastName: '',
  Gender: '',
  Birthdate: null,
  Address: '',
  Latitude: '',
  Longitude: '',
  RefferalCode: '',
  MobileNumber: '',
  stateId: '',
  city: '',
  pinCode: '',
  UserTypeID: ''
}


const AddUser = props => {
  const { show, setShow, defaultData, setDefaultData } = props
  const [RoleID, setRoleID] = useState('');
  const [UserTypeID, setUserTypeId] = useState('');
  const [stateData, setStateData] = useState([])
  const [rolesData, setRolesData] = useState([])
  const [stateId, setSttateId] = useState('')
  const [userTypeData, setUserTypeData] = useState()

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {

    let requestData = { ...data }

    if (defaultData) {
      requestData = {
        ...data, CompanyID: "1", UserID: defaultData?.UserID || ''
      }
    }

    const [error, result] = await asyncWrap(
      axios.post("/user", requestData)
    );

    if (!result) {
      console.log(error);
      toast.error(error.response.data.message);
    } else {
      toast.success(result.data.message)
      reset(defaultValues)
      setShow(false)
    }
  }

  const getStateData = async () => {
    const [error, result] = await asyncWrap(axios.get("/state"))

    if (error) {
      toast.error(error)
    } else {
      setStateData(result?.data?.data)
    }
  }

  const getRolesData = async () => {
    const [error, result] = await asyncWrap(axios.get("/user/roles?pageNo=-1"))

    if (error) {
      toast.error(error)
    } else {
      setRolesData(result?.data?.data)
    }
  }

  const getUserTypeData = async () => {
    const [error, result] = await asyncWrap(axios.get("/user-type"))

    if (error) {
      toast.error(error)
    } else {
      setUserTypeData(result?.data?.data)
    }
  }


  useEffect(() => {
    getStateData()
    getRolesData()
    getUserTypeData()
  }, [])

  const handleClose = () => {
    // setDefaultData([])
    reset(defaultValues)
    setShow(false)
  }

  useEffect(() => {
    console.log(defaultData)
    if (defaultData && show) {
      const mappedData = {
        RoleID: defaultData.RoleID || '',
        UserTypeId: defaultData.UserTypeID || '',
        Email: defaultData.Email || '',
        FirstName: defaultData.FirstName || '',
        LastName: defaultData.LastName || '',
        Gender: defaultData.Gender || '',
        Address: defaultData.Address || '',
        Birthdate: defaultData.Birthdate ? new Date(defaultData.Birthdate) : null,
        Latitude: defaultData.Lattitude || '',
        Longitude: defaultData.Longiitude || '',
        RefferalCode: defaultData.RefferalCode || '',
        MobileNumber: defaultData.MobileNumber || '',
        stateId: defaultData.StateID || '',
        city: defaultData.City || '',
        pinCode: defaultData.PinCode || '',
      };
      setRoleID(defaultData?.RoleID)
      setUserTypeId(defaultData?.UserTypeID)
      setSttateId(defaultData?.StateID)
      reset(mappedData);
    }
  }, [show]);

  return (
    <Dialog
      fullWidth
      open={show}
      maxWidth='md'
      scroll='body'
      onClose={handleClose}
      TransitionComponent={Transition}
      onBackdropClick={handleClose}
    >
      <DialogContent
        sx={{
          position: 'relative',
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            {defaultData?.UserID ? "Edit User" : "Add New User"}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='FirstName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='FirstName'
                      onChange={onChange}
                      error={Boolean(errors.FirstName)}
                    />
                  )}
                />
                {errors.FirstName && <FormHelperText sx={{ color: 'error.main' }}>{errors.FirstName.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='LastName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='LastName'
                      onChange={onChange}
                      error={Boolean(errors.policyName)}
                    />
                  )}
                />
                {errors.LastName && <FormHelperText sx={{ color: 'error.main' }}>{errors.LastName.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='Email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      disabled={defaultData?.Email}
                      value={value}
                      label='Email'
                      onChange={onChange}
                      error={Boolean(errors.Email)}
                    />
                  )}
                />
                {errors.Email && <FormHelperText sx={{ color: 'error.main' }}>{errors.Email.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='MobileNumber'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      disabled={defaultData?.MobileNumber}
                      value={value}
                      label='MobileNumber'
                      onChange={onChange}
                      error={Boolean(errors.MobileNumber)}
                    />
                  )}
                />
                {errors.MobileNumber && <FormHelperText sx={{ color: 'error.main' }}>{errors.MobileNumber.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>

              <DatePickerWrapper>
                <Controller
                  name='Birthdate'
                  control={control}
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
                          label='Birthdate'
                          error={Boolean(errors.Birthdate)}
                        />
                      }
                    />
                  )}
                />
                {errors.Birthdate && (
                  <FormHelperText sx={{ mx: 3.5, color: 'error.main' }}>
                    {errors.Birthdate.message}
                  </FormHelperText>
                )}</DatePickerWrapper>

            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='RefferalCode'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      disabled={defaultData?.RefferalCode}
                      value={value}
                      label='RefferalCode'
                      onChange={onChange}
                      error={Boolean(errors.RefferalCode)}
                    />
                  )}
                />
                {errors.RefferalCode && <FormHelperText sx={{ color: 'error.main' }}>{errors.RefferalCode.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl error={Boolean(errors.rateType)}>
                <FormLabel>Gender</FormLabel>
                <Controller
                  name='Gender'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value='Male'
                        label='Male'
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value='Female'
                        label='Female'
                        control={<Radio />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.Gender && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.Gender.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* {!defaultData?.UserID && (
              <>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='Password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          type='password'
                          label='Password'
                          onChange={onChange}
                          error={Boolean(errors.Password)}
                        />
                      )}
                    />
                    {errors.Password && <FormHelperText sx={{ color: 'error.main' }}>{errors.Password.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='ConfirmPassword'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='ConfirmPassword'
                          onChange={onChange}
                          error={Boolean(errors.ConfirmPassword)}
                        />
                      )}
                    />
                    {errors.ConfirmPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.ConfirmPassword.message}</FormHelperText>}
                  </FormControl>
                </Grid></>)} */}

            {/* <Grid item sm={6} xs={12}></Grid> */}

            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='country-select'>Select Role</InputLabel>
                <Select
                  fullWidth
                  {...register('RoleID', { required: true })}
                  value={RoleID}
                  disabled={defaultData?.RoleID}
                  onChange={(e) => setRoleID(e.target.value)}
                  placeholder='UK'
                  label='Select Role'
                  labelId='country-select'
                  defaultValue='Select Role'
                >
                  <MenuItem value=''>Select Role</MenuItem>
                  {rolesData?.map((item, index) => (
                    <MenuItem key={index} value={item.RoleID}>{item.RoleName}</MenuItem>
                  ))}
                </Select>
                {errors.RoleID && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.RoleID.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth >
                <InputLabel id='country-select'>Select User Type</InputLabel>
                <Select
                  fullWidth
                  {...register('UserTypeID', { required: true })}
                  value={UserTypeID}
                  onChange={(e) => setUserTypeId(e.target.value)}
                  placeholder='UK'
                  label='Country'
                  labelId='country-select'
                  defaultValue='Select Country'
                >
                  <MenuItem value=''>Select User Type</MenuItem>
                  {userTypeData?.map((item, index) => (
                    <MenuItem key={index} value={item.UserTypeID}>{item.UserType}</MenuItem>
                  ))}
                </Select>
                {errors.UserTypeID && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.UserTypeID.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='Address'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Address'
                      onChange={onChange}
                      error={Boolean(errors.Address)}
                    />
                  )}
                />
                {errors.Address && <FormHelperText sx={{ color: 'error.main' }}>{errors.Address.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='Latitude'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Latitude'
                      onChange={onChange}
                      error={Boolean(errors.Latitude)}
                    />
                  )}
                />
                {errors.Latitude && <FormHelperText sx={{ color: 'error.main' }}>{errors.Latitude.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='Longitude'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Longitude'
                      onChange={onChange}
                      error={Boolean(errors.Longitude)}
                    />
                  )}
                />
                {errors.Longitude && <FormHelperText sx={{ color: 'error.main' }}>{errors.Longitude.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='country-select'>Select State</InputLabel>
                <Select
                  fullWidth
                  {...register('stateId', { required: true })}
                  value={stateId}
                  onChange={(e) => setSttateId(e.target.value)}
                  placeholder='UK'
                  label='Select State'
                  labelId='country-select'
                  defaultValue='Select Role'
                >
                  <MenuItem value=''>Select State</MenuItem>
                  {stateData?.map((item, index) => (
                    <MenuItem key={index} value={item.StateID}>{item.StateName}</MenuItem>
                  ))}
                </Select>
                {errors.stateId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.stateId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='city'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='city'
                      onChange={onChange}
                      error={Boolean(errors.city)}
                    />
                  )}
                />
                {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='pinCode'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Pin Code'
                      onChange={onChange}
                      error={Boolean(errors.pinCode)}
                    />
                  )}
                />
                {errors.pinCode && <FormHelperText sx={{ color: 'error.main' }}>{errors.pinCode.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item sm={6}></Grid>
            <Box sx={{ mr: "auto", ml: "auto", display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                Submit
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={() => setShow(false)}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </form>
      </DialogContent>
    </Dialog >
  )
}

export default AddUser
