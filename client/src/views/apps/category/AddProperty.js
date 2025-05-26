// ** React Imports
import { useState, forwardRef } from 'react'

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
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
import { Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'

// import toast from 'react-hot-toast'

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})


const schema = yup.object().shape({
    propertyName: yup.string().required(),
    categoryId: yup.string().required(),
})

const AddProperty = ({ show, setShow, parentCategoryId, parentCategoryData }) => {

    console.log(parentCategoryId)

    const defaultValues = {
        categoryId: parentCategoryId === 'root' ? '0' : parentCategoryId,
        propertyName: ''
    }

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

        const [error, result] = await asyncWrap(
            axios.post("/property", {
                ...data,
                companyId: "1",
                categoryId: parentCategoryId
            })
        );
        if (!result) {
            console.log(error);
            toast.error(error.response.data.message);
        } else {
            toast.success(result.data?.message)
            reset(defaultValues)
            setShow(false)
        };
    }

    return (
        <>
            <Dialog
                fullWidth
                open={show}
                maxWidth='md'
                scroll='body'
                onClose={() => {
                    reset(defaultValues)
                    setShow(!show)
                }}
                TransitionComponent={Transition}
                onBackdropClick={() => {
                    reset(defaultValues)
                    setShow(!show)
                }}
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
                        onClick={() => {
                            reset(defaultValues)
                            setShow(false)
                        }}
                        sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    >
                        <Icon icon='mdi:close' />
                    </IconButton>
                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ mb: 3 }}>
                            Add Property
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={6}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='categoryId'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                disabled
                                                value={parentCategoryId === 'root' ? 'Root Category' : parentCategoryData?.CategoryName}
                                                label='Parent Category Name'
                                                onChange={onChange}
                                                error={Boolean(errors.categoryId)}
                                            />
                                        )}
                                    />
                                    {errors.categoryId && <FormHelperText sx={{ color: 'error.main' }}>{errors.categoryId.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} >
                                <FormControl fullWidth>
                                    <Controller
                                        name='propertyName'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='Property Name'
                                                onChange={onChange}
                                                error={Boolean(errors.propertyName)}
                                            />
                                        )}
                                    />
                                    {errors.propertyName && <FormHelperText sx={{ color: 'error.main' }}>{errors.propertyName.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Box sx={{ marginLeft: "auto", marginRight: "auto", display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                                <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                                    Submit
                                </Button>
                                <Button size='large' variant='outlined' color='secondary' onClick={() => {
                                    reset(defaultValues)
                                    setShow(false)
                                }}>
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

export default AddProperty
