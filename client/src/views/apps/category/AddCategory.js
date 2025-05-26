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
import { FormHelperText, styled } from '@mui/material'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

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
    categoryName: yup.string().required(),
    categoryCode: yup.string().required(),
    selectParentCategory: yup.string().notOneOf(['Select Country'], 'Please select a Parent Category'),
})

// const defaultValues = {
//     categoryName: '',
// }

const AddCategory = ({ show, setShow, parentCategoryId, parentCategoryData }) => {
    const [selectParentCategory, setSelectParentCategory] = useState();
    const [filePath, setFilePath] = useState()
    const router = useRouter()

    const defaultValues = {
        categoryCode: "",
        categoryName: "",
        selectParentCategory: parentCategoryId === 'root' ? '0' : parentCategoryId,
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

    const handleImageUpload = async e => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append("file", file);
        const [error, result] = await asyncWrap(axios.post("/upload", formData));
        if (error) {
            toast.error(error.response.data.message);

            return;
        }

        setFilePath(result?.data?.fileUrl)
    };

    const onSubmit = async (data) => {
        // console.log(parentCategoryId === 'root parentCategoryData?.categoryLevel + 1)

        const [error, result] = await asyncWrap(
            axios.post("/category", {
                ...data,
                companyId: "1",
                categoryLevel: parentCategoryId === 'root' ? "1" : parentCategoryData?.CategoryLevel + 1,
                filePath: filePath,
                parentCategoryId: parentCategoryId === "root" ? "0" : parentCategoryId
            })
        );
        if (!result) {
            console.log(error);
            toast.error(error.response.data.message);
        } else {
            toast.success(result.data.message)
            reset(defaultValues)

            // router.push('/category')
            setShow(false)
            console.log(result.data)

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
                            Add Category
                        </Typography>
                    </Box>
                    {/* <Grid container spacing={6}> */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <Grid item xs={12}> */}
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <Controller
                                name='parentCategoryData'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        disabled
                                        value={parentCategoryId === 'root' ? 'Root Category' : parentCategoryData?.CategoryName}
                                        label='Parent Category Name'
                                        onChange={onChange}
                                        error={Boolean(errors.parentCategoryData)}
                                    />
                                )}
                            />
                            {errors.parentCategoryData && <FormHelperText sx={{ color: 'error.main' }}>{errors.parentCategoryData.message}</FormHelperText>}
                        </FormControl>
                        {/* </Grid> */}
                        {/* <Grid item xs={12}> */}
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <Controller
                                name='categoryName'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Category Name'
                                        onChange={onChange}
                                        error={Boolean(errors.categoryName)}
                                    />
                                )}
                            />
                            {errors.categoryName && <FormHelperText sx={{ color: 'error.main' }}>{errors.categoryName.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <Controller
                                name='categoryCode'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Category Code'
                                        onChange={onChange}
                                        error={Boolean(errors.categoryCode)}
                                    />
                                )}
                            />
                            {errors.categoryCode && <FormHelperText sx={{ color: 'error.main' }}>{errors.categoryCode.message}</FormHelperText>}
                        </FormControl>
                        {/* </Grid> */}
                        <Grid item xs={12}>
                            <Button component="label" variant="contained">
                                Upload Image
                                <VisuallyHiddenInput onChange={(event) => handleImageUpload(event)} type="file" />
                            </Button>
                        </Grid>

                        {
                            filePath && (
                                <img style={{ width: "200px", marginTop: "10px" }} src={filePath} />
                            )
                        }

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
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

export default AddCategory
