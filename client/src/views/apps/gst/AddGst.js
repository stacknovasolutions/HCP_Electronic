// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { FormControl, FormControlLabel, FormHelperText, Radio } from '@mui/material'
import { FormLabel } from '@mui/material'
import RadioGroup from '@mui/material/RadioGroup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import DatePicker from 'react-datepicker'

import * as yup from 'yup'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

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
    policyName: yup.string().required(),
    gstRate: yup.number().required(),
    date: yup.date().required(),
    rateType: yup.string().required()
})

const defaultValues = {
    policyName: '',
    gstRate: '',
    date: null,
    rateType: ''
}

const AddGst = ({ show, setShow, defaultData, setDefaultData }) => {

    const {
        reset,
        control,
        setValue,
        setError,
        handleSubmit,
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
                ...data, gstId: defaultData?.GSTID || ''
            }
        }


        const [error, result] = await asyncWrap(
            axios.post("/gst", requestData)
        );

        if (!result) {
            console.log(error);
            toast.error(error.response.data.message);
        } else {
            toast.success(result.data.data[0].Message)
            reset(defaultValues)
            setDefaultData("")
            setShow(false)
        }
    }

    useEffect(() => {
        if (defaultData && show) {
            const mappedData = {
                policyName: defaultData.PolicyName || '',
                gstRate: defaultData.GSTRate || '',
                date: defaultData.Date ? new Date(defaultData.Date) : null,
                rateType: defaultData.RateType || '',
            };
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
                            {defaultData?.GSTID ? "Edit GST" : "Add New GST"}
                        </Typography>
                        {/* <Typography variant='body2'>Add new gst details</Typography> */}
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={6}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='policyName'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='Policy Name'
                                                onChange={onChange}
                                                error={Boolean(errors.policyName)}
                                            />
                                        )}
                                    />
                                    {errors.policyName && <FormHelperText sx={{ color: 'error.main' }}>{errors.policyName.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='gstRate'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='GST Rate'
                                                type='number'
                                                onChange={onChange}
                                                error={Boolean(errors.gstRate)}
                                            />
                                        )}
                                    />
                                    {errors.gstRate && <FormHelperText sx={{ color: 'error.main' }}>{errors.gstRate.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl error={Boolean(errors.rateType)}>
                                    <FormLabel>Rate Type</FormLabel>
                                    <Controller
                                        name='rateType'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <RadioGroup row {...field}>
                                                <FormControlLabel
                                                    value='FX'
                                                    label='Fixed'
                                                    control={<Radio />}
                                                />
                                                <FormControlLabel
                                                    value='PR'
                                                    label='Percentage'
                                                    control={<Radio />}
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.rateType && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.rateType.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <DatePickerWrapper>
                                    <Controller
                                        name='date'
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
                                                        label='Date'
                                                        error={Boolean(errors.date)}
                                                    />
                                                }
                                            />
                                        )}
                                    />
                                    {errors.date && (
                                        <FormHelperText sx={{ mx: 3.5, color: 'error.main' }}>
                                            {errors.date.message}
                                        </FormHelperText>
                                    )}</DatePickerWrapper>
                            </Grid>

                            <Box sx={{ marginLeft: "auto", marginRight: "auto", display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
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
        </>
    )
}

export default AddGst
