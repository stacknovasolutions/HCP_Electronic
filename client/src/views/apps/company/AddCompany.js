// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'

// import * as yup from 'yup';
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import toast from 'react-hot-toast'

import { Autocomplete, Checkbox, FormHelperText, styled } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'


const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

// ** Demo Components Imports
// import Table from 'src/views/apps/company/TableCompany'
// import { Controller } from 'react-hook-form'

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
    companyName: yup.string().required('Company name is required'),
    shortName: yup.string().required('Short name is required'),
    registrationNumber: yup.string().required('Registration number is required'),
    industryType: yup.string().required('Industry type is required'),
    address: yup.string().required('Address is required'),
    contactInformation: yup.string().required('Contact information is required').matches(/^\+?[0-9]{8,15}$/, 'Invalid phone number'),
    founder_CEO: yup.string().required('Founder/CEO name is required'),
    dateofEstablishment: yup.date().required('Date of establishment is required'),
    numberOfEmployee: yup.number().required('Number of employees is required').positive('Number of employees must be positive'),
    partnerships: yup.string().required('Partnerships information is required'),
    logoUrl: yup.string().url('Logo URL must be a valid URL'),
    pinCode: yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Invalid pincode'),
    stateId: yup.string().required('State is required'),
    city: yup.string().required('City is required'),
    latitude: yup.number().nullable().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
    longitude: yup.number().nullable().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
    userLimit: yup.string().required('Number of account limit is required'),
    email: yup.string().email('Invalid email').required('Email is required')
});

const defaultValues = {
    companyName: '',
    shortName: '',
    registrationNumber: '',
    industryType: '',
    address: '',
    contactInformation: '',
    founder_CEO: '',
    dateofEstablishment: '',
    numberOfEmployee: '',
    partnerships: '',
    logoUrl: '',
    pinCode: '',
    stateId: '',
    city: '',
    latitude: '',
    longitude: '',
    userLimit: '',
    email: ''
}

const AddCompany = ({ show, setShow, defaultData }) => {

    const [selectParentCategory, setSelectParentCategory] = useState();
    const [stateData, setStateData] = useState([])
    const [stateId, setStateId] = useState()
    const [moduleData, setModuleData] = useState([])

    const [logoUrl, setLogourl] = useState()
    const [selectedValues, setSelectedValues] = useState([]);

    const handleChange = (event, value) => {
        console.log(selectedValues)

        setSelectedValues(value);
    };

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

    const handleImageUpload = async e => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append("file", file);
        const [error, result] = await asyncWrap(axios.post("/upload", formData));
        if (error) {
            toast.error(error.response.data.message);

            return;
        }

        setLogourl(result?.data?.fileUrl)
        toast.success(reset.data?.message)
    };

    const onSubmit = async (data) => {

        const moduleNames = selectedValues.map(value => value.ModuleID).join(',');

        let requestData = { ...data, logoUrl, moduleId: moduleNames }

        if (defaultData) {
            requestData = {
                ...data, logoUrl, moduleId: moduleNames, companyId: defaultData?.CompanyID || ''
            }
        }

        console.log({ ...data, selectParentCategory })

        const [error, result] = await asyncWrap(
            axios.post("/company", requestData)
        );
        if (!result) {
            console.log(error);
            toast.error(error.response.data.message);
        } else {
            toast.success(result.data.message)
            setSelectParentCategory([])
            reset(defaultValues)
            setShow(false)

        };
    }

    const getStateData = async () => {
        const [error, result] = await asyncWrap(axios.get("/state"))

        if (error) {
            toast.error(error)
        } else {
            setStateData(result?.data?.data)
        }
    }

    const getModuleData = async () => {
        const [error, result] = await asyncWrap(axios.get("/module"))

        if (error) {
            toast.error(error)
        } else {
            setModuleData(result?.data?.data)
        }
    }

    useEffect(() => {
        getStateData()
        getModuleData()
    }, [])

    useEffect(() => {
        console.log(defaultData)
        if (defaultData && show) {
            const mappedData = {
                companyName: defaultData.CompanyName || '',
                shortName: defaultData.ShortName || '',
                registrationNumber: defaultData.RegistrationNumber || '',
                industryType: defaultData.IndustryType || '',
                address: defaultData.Address || '',
                contactInformation: defaultData.ContactInformation || '',
                founder_CEO: defaultData.Founder_CEO || '',
                dateofEstablishment: defaultData.DateofEstablishment ? new Date(defaultData.DateofEstablishment) : null,
                numberOfEmployee: defaultData.NumberOfEmployee || '',
                partnerships: defaultData.Partnerships || '',
                logoUrl: defaultData.LOGOURL || '',
                pinCode: defaultData.Pincode || '',
                stateId: defaultData.StateID || '',
                city: defaultData.City || '',
                latitude: defaultData.Lattitude || '',
                longitude: defaultData.Longiitude || '',
                userLimit: defaultData.CompanyUserLimit || '',
                email: defaultData?.Email || ''
            };
            if (defaultData?.Modules) {
                setSelectedValues(JSON.parse(defaultData?.Modules || "") || [])
            } else {
                setSelectedValues([])
            }
            setStateId(defaultData?.StateID)
            setLogourl(defaultData?.LOGOURL)
            reset(mappedData);
        }
    }, [show]);

    return (
        <>
            <Dialog
                fullWidth
                open={show}
                maxWidth='md'
                scroll='body'
                onClose={() => setShow(false)}
                TransitionComponent={Transition}
                onBackdropClick={() => setShow(false)}
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
                        onClick={() => setShow(false)}
                        sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    >
                        <Icon icon='mdi:close' />
                    </IconButton>
                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ mb: 3 }}>
                            {defaultData?.CompanyID ? "Edit Company" : "Add New Company"}
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={6}>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='companyName'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='Company Name'
                                                onChange={onChange}

                                                error={Boolean(errors.companyName)}
                                            />
                                        )}
                                    />
                                    {errors.companyName && <FormHelperText sx={{ color: 'error.main' }}>{errors.companyName.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='shortName'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='short Name'
                                                onChange={onChange}

                                                error={Boolean(errors.shortName)}
                                            />
                                        )}
                                    />
                                    {errors.shortName && <FormHelperText sx={{ color: 'error.main' }}>{errors.shortName.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='registrationNumber'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='Registration Number'
                                                onChange={onChange}
                                                error={Boolean(errors.registrationNumber)}
                                            />
                                        )}
                                    />
                                    {errors.registrationNumber && <FormHelperText sx={{ color: 'error.main' }}>{errors.registrationNumber.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='industryType'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='industryType'
                                                onChange={onChange}
                                                error={Boolean(errors.industryType)}
                                            />
                                        )}
                                    />
                                    {errors.industryType && <FormHelperText sx={{ color: 'error.main' }}>{errors.industryType.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='address'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='address'
                                                onChange={onChange}

                                                error={Boolean(errors.address)}
                                            />
                                        )}
                                    />
                                    {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <DatePickerWrapper>
                                    <Controller
                                        name='dateofEstablishment'
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
                                                        label='dateofEstablishment'
                                                        error={Boolean(errors.dateofEstablishment)}
                                                    />
                                                }
                                            />
                                        )}
                                    />
                                    {errors.dateofEstablishment && (
                                        <FormHelperText sx={{ mx: 3.5, color: 'error.main' }}>
                                            {errors.dateofEstablishment.message}
                                        </FormHelperText>
                                    )}</DatePickerWrapper>
                            </Grid>

                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='email'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                disabled={defaultData?.Email}
                                                value={value}
                                                label='Email'
                                                onChange={onChange}
                                                error={Boolean(errors.email)}
                                            />
                                        )}
                                    />
                                    {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='founder_CEO'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='founder_CEO'
                                                onChange={onChange}

                                                error={Boolean(errors.founder_CEO)}
                                            />
                                        )}
                                    />
                                    {errors.founder_CEO && <FormHelperText sx={{ color: 'error.main' }}>{errors.founder_CEO.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='contactInformation'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='contactInformation'
                                                onChange={onChange}

                                                error={Boolean(errors.contactInformation)}
                                            />
                                        )}
                                    />
                                    {errors.contactInformation && <FormHelperText sx={{ color: 'error.main' }}>{errors.contactInformation.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='numberOfEmployee'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='numberOfEmployee'
                                                onChange={onChange}

                                                error={Boolean(errors.numberOfEmployee)}
                                            />
                                        )}
                                    />
                                    {errors.numberOfEmployee && <FormHelperText sx={{ color: 'error.main' }}>{errors.numberOfEmployee.message}</FormHelperText>}
                                </FormControl>
                            </Grid>


                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='partnerships'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='partnerships'
                                                onChange={onChange}

                                                error={Boolean(errors.partnerships)}
                                            />
                                        )}
                                    />
                                    {errors.partnerships && <FormHelperText sx={{ color: 'error.main' }}>{errors.partnerships.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    disableCloseOnSelect
                                    options={moduleData}
                                    id='autocomplete-checkboxes'
                                    getOptionLabel={option => option.ModuleName || ''}
                                    value={selectedValues}
                                    onChange={handleChange}
                                    renderInput={params => <TextField {...params} label='Modules' placeholder='' />}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox checked={selected} sx={{ mr: 2 }} />
                                            {option.ModuleName}
                                        </li>
                                    )}
                                    getOptionSelected={(option, selectedValues) =>
                                        selectedValues.some(val => val.ModuleID === option.ModuleID
                                        )}
                                />
                            </Grid>

                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='latitude'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='latitude'
                                                onChange={onChange}

                                                error={Boolean(errors.latitude)}
                                            />
                                        )}
                                    />
                                    {errors.latitude && <FormHelperText sx={{ color: 'error.main' }}>{errors.latitude.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='longitude'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='longitude'
                                                onChange={onChange}

                                                error={Boolean(errors.longitude)}
                                            />
                                        )}
                                    />
                                    {errors.longitude && <FormHelperText sx={{ color: 'error.main' }}>{errors.longitude.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='userLimit'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='userLimit'
                                                onChange={onChange}

                                                error={Boolean(errors.userLimit)}
                                            />
                                        )}
                                    />
                                    {errors.userLimit && <FormHelperText sx={{ color: 'error.main' }}>{errors.userLimit.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='pinCode'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='pinCode'
                                                onChange={onChange}

                                                error={Boolean(errors.pinCode)}
                                            />
                                        )}
                                    />
                                    {errors.pinCode && <FormHelperText sx={{ color: 'error.main' }}>{errors.pinCode.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
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
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth>
                                    <InputLabel id='country-select'>Select State</InputLabel>
                                    <Select
                                        fullWidth
                                        {...register('stateId', { required: true })}
                                        value={stateId}
                                        onChange={(e) => setStateId(e.target.value)}
                                        placeholder='UK'
                                        label='Select State'
                                        labelId='country-select'
                                        defaultValue=''
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
                            <Grid item xs={12}>
                                <Button component="label" variant="contained">
                                    Upload Logo Image
                                    <VisuallyHiddenInput onChange={(event) => handleImageUpload(event)} type="file" />
                                </Button>
                                {errors.logoUrl && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.logoUrl.message}
                                    </FormHelperText>
                                )}
                            </Grid>

                            {
                                logoUrl && ( <Grid item xs={12}>
                                    <img style={{ width: "200px", marginTop: "10px" }} src={logoUrl} /></Grid>
                                )
                            }


                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px', marginLeft: "auto", marginRight: "auto" }}>
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
                {/* <DialogActions
                    sx={{
                        justifyContent: 'center',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Button variant='contained' sx={{ mr: 1 }} onClick={() => setShow(false)}>
                        Submit
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
                        Cancel
                    </Button>
                </DialogActions> */}
            </Dialog>
        </>
    )
}

export default AddCompany
