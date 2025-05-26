// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { FormHelperText, styled } from '@mui/material'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import toast from 'react-hot-toast'

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
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
    description: yup.string().trim().required(),
})

const defaultValues = {
    description: '',
}

const AddTermCondition = ({ show, setShow, defaultData }) => {

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
                ...data, id: defaultData?.TermsConditionID || ''
            }
        }

        const [error, result] = await asyncWrap(
            axios.post("/terms", requestData)
        );
        if (!result) {
            console.log(error);
            toast.error(error.response.data.message);
        } else {
            toast.success(result.data.message)
            reset(defaultValues)
            setShow(false)
        };
    }

    useEffect(() => {
        if (defaultData && show) {
            const mappedData = {
                description: defaultData.Description || '',
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
                onClose={() => setShow(!show)}
                TransitionComponent={Transition}
                onBackdropClick={() => setShow(!show)}
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
                            {defaultData?.TermsConditionID ? "Edit Term & Condition" : "Add Term & Condition"}
                        </Typography>
                    </Box>
                    {/* <Grid container spacing={6}> */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <Grid item xs={12}> */}
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <Controller
                                name='description'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        multiline
                                        type='textarea'
                                        rows={9}
                                        label='Term & Condition Details'
                                        onChange={onChange}
                                        error={Boolean(errors.description)}
                                    />
                                )}
                            />
                            {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
                        </FormControl>
                        {/* </Grid> */}
                        {/* <Grid item xs={12}> */}
                        {/* <FormControl fullWidth sx={{ mb: 6 }}>
                            <Controller
                                name='pagePath'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Page Path'
                                        onChange={onChange}
                                        error={Boolean(errors.pagePath)}
                                    />
                                )}
                            />
                            {errors.pagePath && <FormHelperText sx={{ color: 'error.main' }}>{errors.pagePath.message}</FormHelperText>}
                        </FormControl> */}

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                                Submit
                            </Button>
                            <Button size='large' variant='outlined' color='secondary' onClick={() => setShow(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                    {/* </Grid> */}
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

export default AddTermCondition
