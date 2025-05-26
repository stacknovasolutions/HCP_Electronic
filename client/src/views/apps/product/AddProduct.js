// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
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
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { FormHelperText, styled } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import * as yup from 'yup'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import CustomRadioImg from 'src/@core/components/custom-radio/image'


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

const schema = yup.object().shape({
    productName: yup.string().required('Product name is required'),
    productCode: yup.string().required('Product code is required'),
    productType: yup.string().required('Product type is required'),
    description: yup.string().required('Short description is required'),
    productDescription: yup.string().required('Long description is required'),
    categoryID: yup.string().required("Category is required"),
    gstPolicyId: yup.string(),
    gstInclusive: yup.string().oneOf(["1", "0"]),
    unitPrice: yup.number().required().positive("Please Enter Positive Value"),
});

const defaultValues = {
    productName: '',
    productCode: '',
    productType: '',
    description: '',
    productDescription: '',
    categoryID: '',
    gstPolicyId: '',
    gstInclusive: '',
    unitPrice: ''
};

const AddProduct = ({ show, setShow, defaultData }) => {
    const [categoryID, setCategoryId] = useState('');
    const [gstPolicyId, setGstPolicyId] = useState('');
    const [categoryData, setCategoryData] = useState([]);
    const [gstData, setGSTData] = useState([]);
    const [propertyData, setPropertyData] = useState([]);
    const [filePaths, setFilePaths] = useState([]);
    const [defaultImageSet, setDefaultImageSet] = useState(false);

    const {
        reset,
        control,
        setValue,
        register,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    });

    const handleImageUpload = async (e) => {
        const files = e.target.files;

        const promises = Array.from(files).map(async (file, index) => {
            const formData = new FormData();
            formData.append('file', file);

            const [error, result] = await asyncWrap(axios.post('/upload', formData));
            if (error) {
                console.error(error);

                return null;
            }

            return { ImagePath: result?.data?.fileUrl, value: result?.data?.fileUrl, IsDefault: index === 0 && !defaultImageSet ? "1" : "0" };
        });

        const uploadedImages = await Promise.all(promises);

        // Filter out null values (failed uploads)
        const newFilePaths = uploadedImages.filter((image) => image !== null);

        // Update default image set flag after the first image is uploaded
        if (!defaultImageSet && newFilePaths.length > 0) {
            setDefaultImageSet(true);
        }

        console.log(filePaths)

        // Update state
        setFilePaths([...filePaths, ...newFilePaths]);
    };

    const handlePropertyValueChange = (PropertyID, newValue) => {
        // Update the propertyValues in form state
        setValue(`propertyValues.${PropertyID}`, newValue);
    };

    const onclickhandle = () => {
        console.log(schema.value)
    }

    const onSubmit = async (data) => {

        console.log(data)

        const propertyValues = propertyData.map(property => ({
            PropertyID: property.PropertyID,
            PropertyName: property.PropertyName,
            Value: property.Value
        }));

        let requestData = {
            ...data,
            productProperty: propertyValues,
            productImages: filePaths
        }

        if (defaultData) {
            requestData = {
                ...data,
                productProperty: propertyValues,
                productImages: filePaths,
                productId: defaultData?.ProductID || ''
            }
        }

        const [error, result] = await asyncWrap(
            axios.post("/product", requestData)
        );

        if (!result) {
            console.log(error);
            toast.error(error.response.data.message);
        } else {
            toast.success(result.data.message)
            reset(defaultValues)
            setShow(false)
        }
    };

    const getPropertyData = async (id) => {
        const [error, result] = await asyncWrap(axios.get(`/property/category?companyId=1&categoryId=${id}`));

        if (error) {
            console.error(error);
        } else {
            const formattedData = result.data?.data?.map(item => ({
                PropertyID: item.PropertyID,
                PropertyName: item.Propertyname || "",
                Value: ""
            }));

            setPropertyData(formattedData);
        }
    };

    const getGSTData = async () => {
        const [error, result] = await asyncWrap(axios.get("/gst"));

        if (error) {
            console.error(error);
        } else {
            setGSTData(result?.data?.data);
        }
    };

    const getCategoryData = async () => {
        const [error, result] = await asyncWrap(axios.get("/category?pageNo=-1"));

        if (error) {
            console.error(error);
        } else {
            setCategoryData(result?.data?.data);
        }
    };

    useEffect(() => {
        getGSTData();
        getCategoryData();
    }, []);

    useEffect(() => {
        console.log(defaultData)
        if (defaultData && show) {
            // Initialize default form values
            reset({
                productName: defaultData.ProductName || '',
                productCode: defaultData.ProductCode || '',
                productType: defaultData.ProductType || '',
                description: defaultData.Description || '',
                productDescription: defaultData.ProductDescription || '',
                categoryID: defaultData?.CategoryID || '',
                gstPolicyId: defaultData.GSTPolicyID || '',
                gstInclusive: defaultData?.IsGstInclusive ? "1" : "0",
                unitPrice: defaultData?.UnitPirce || '',
                propertyValues: Object.fromEntries(JSON.parse(defaultData.ProductProperty)?.map(property => [property.PropertyID, property.Value || ''])) || {},
                productImages: JSON.parse(defaultData.ProductImages)?.map((item, index) => ({
                    ImagePath: item.ImagePath,
                    value: item.ImagePath,
                    IsDefault: index === 0 && !defaultImageSet ? "1" : "0"
                })) || []
            });

            console.log({
                productName: defaultData.ProductName || '',
                productCode: defaultData.ProductCode || '',
                productType: defaultData.ProductType || '',
                description: defaultData.Description || '',
                productDescription: defaultData.ProductDescription || '',
                categoryID: '',
                gstPolicyId: defaultData.GSTPolicyID || '',
                gstInclusive: defaultData?.IsGstInclusive ? "1" : "0",
                unitPrice: defaultData?.UnitPirce || 0,
                productProperty: [],
                propertyValues: Object.fromEntries(JSON.parse(defaultData.ProductProperty)?.map(property => [property.PropertyID, property.Value || ''])) || {},
                productImages: JSON.parse(defaultData.ProductImages)?.map((item, index) => ({
                    ImagePath: item.ImagePath,
                    value: item.ImagePath,
                    IsDefault: index === 0 && !defaultImageSet ? "1" : "0"
                })) || []
            })

            // Set category ID and GST policy ID
            setCategoryId(defaultData.CategoryID || '');
            setGstPolicyId(defaultData.GSTPolicyID || '');

            // Set property data
            const formattedData = JSON.parse(defaultData.ProductProperty)?.map(item => ({
                PropertyID: item.PropertyID,
                PropertyName: item.PropertyName || "",
                Value: item.Value || ""
            }));
            setPropertyData(formattedData);

            // Set file paths
            let convertedData = [];
            if (defaultData.ProductImages) {
                convertedData = JSON.parse(defaultData.ProductImages)?.map((item, index) => ({
                    ImagePath: item.ImagePath,
                    value: item.ImagePath,
                    IsDefault: item.IsDefault ? "1" : "0"
                }));
            }
            console.log(convertedData);
            setFilePaths(convertedData);

        } else {
            setCategoryId('');
            setGstPolicyId('');
            setPropertyData([])
            setFilePaths([])
        }

    }, [show]);


    const handleChange = (selectedValue) => {
        console.log(selectedValue)
        console.log(filePaths)

        const updatedFilePaths = filePaths.map(item => ({
            ...item,
            IsDefault: item.ImagePath === selectedValue ? "1" : "0"
        }));
        setFilePaths(updatedFilePaths);
    };

    const handleInputChange = (index, value) => {
        const updatedPropertyData = [...propertyData]; // Create a copy of the state array
        updatedPropertyData[index].Value = value; // Update the value of the property at the specified index
        setPropertyData(updatedPropertyData); // Set the updated state
    };


    return (
        <>
            <Dialog
                fullWidth
                open={show}
                maxWidth='md'
                scroll='body'
                onClose={() => {
                    reset(defaultValues)
                    setShow(false)
                }}
                TransitionComponent={Transition}
                onBackdropClick={() => {
                    reset(defaultValues)
                    setShow(false)
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
                            {defaultData?.ProductID ? "Edit Product" : "Add New Product"}
                        </Typography>
                        {/* <Typography variant='body2'>Add New Product Here</Typography> */}
                    </Box>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <Grid container spacing={6}>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='productName'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='Product Name'
                                                onChange={onChange}
                                                error={Boolean(errors.productName)}
                                            />
                                        )}
                                    />
                                    {errors.productName && <FormHelperText sx={{ color: 'error.main' }}>{errors.productName.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='productCode'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='Product Code'
                                                onChange={onChange}
                                                error={Boolean(errors.productCode)}
                                            />
                                        )}
                                    />
                                    {errors.productCode && <FormHelperText sx={{ color: 'error.main' }}>{errors.productCode.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='unitPrice'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='Unit Price'
                                                type='number'
                                                onChange={onChange}
                                                error={Boolean(errors.unitPrice)}
                                            />
                                        )}
                                    />
                                    {errors.unitPrice && <FormHelperText sx={{ color: 'error.main' }}>{errors.unitPrice.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl error={Boolean(errors.productType)}>
                                    <FormLabel>Product Type</FormLabel>
                                    <Controller
                                        name='productType'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <RadioGroup row {...field}>
                                                <FormControlLabel
                                                    value='Product'
                                                    label='Product'
                                                    control={<Radio />}
                                                />
                                                <FormControlLabel
                                                    value='Labour'
                                                    label='Labour'
                                                    control={<Radio />}
                                                />
                                                <FormControlLabel
                                                    value='Parts'
                                                    label='Parts'
                                                    control={<Radio />}
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.productType && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.productType.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='description'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                label='Short Description'
                                                type='text'
                                                onChange={onChange}
                                                error={Boolean(errors.description)}
                                            />
                                        )}
                                    />
                                    {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='productDescription'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                multiline
                                                rows={3}
                                                fullWidth label='Long Desc'
                                                onChange={onChange}
                                                error={Boolean(errors.productDescription)}
                                            />
                                        )}
                                    />
                                    {errors.productDescription && <FormHelperText sx={{ color: 'error.main' }}>{errors.productDescription.message}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl error={Boolean(errors.gstInclusive)}>
                                    <FormLabel>Gst Inclusive</FormLabel>
                                    <Controller
                                        name='gstInclusive'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <RadioGroup row {...field}>
                                                <FormControlLabel
                                                    value='1'
                                                    label='Yes'
                                                    control={<Radio />}
                                                />
                                                <FormControlLabel
                                                    value='0'
                                                    label='No'
                                                    control={<Radio />}
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.gstInclusive && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.gstInclusive.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} >
                                <FormControl fullWidth>
                                    <InputLabel id='country-select'>Select GST Policy</InputLabel>
                                    <Select
                                        fullWidth
                                        {...register('gstPolicyId')}
                                        value={gstPolicyId}
                                        onChange={(e) => setGstPolicyId(e.target.value)}
                                        placeholder='UK'
                                        label='Country'
                                        labelId='country-select'
                                        disabled={watch('gstInclusive') === "0"}
                                        defaultValue='Select Country'
                                    >
                                        {gstData?.map((item, index) => (
                                            <MenuItem key={index} value={item?.GSTID}>{item?.PolicyName}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.gstPolicyId && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.gstPolicyId.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} >
                                <FormControl fullWidth>
                                    <InputLabel id='country-select'>Category</InputLabel>
                                    <Select
                                        fullWidth
                                        {...register('categoryID', { required: true })}
                                        value={categoryID}
                                        onChange={(e) => {
                                            setCategoryId(e.target.value)
                                            getPropertyData(e.target.value)
                                        }
                                        }
                                        placeholder='UK'
                                        label='Country'
                                        labelId='country-select'
                                        defaultValue='Select Country'
                                    >
                                        {categoryData?.map((item, index) => (
                                            <MenuItem key={index} value={item?.CategoryID}>{item?.CategoryName}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.categoryID && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.categoryID.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {propertyData.map((property, index) => (
                                <Grid key={index} item xs={12} sx={{ width: "100%" }} >
                                    <TextField
                                        fullWidth
                                        label={property?.PropertyName}
                                        placeholder={property?.PropertyName}
                                        name="Unit_Price"
                                        value={property.Value}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                    /></Grid>
                            ))}



                            <Grid item xs={12}>
                                <Button component="label" variant="contained">
                                    Upload Product Image
                                    <VisuallyHiddenInput onChange={(event) => handleImageUpload(event)} type="file" />
                                </Button>
                            </Grid>

                            <Grid item container spacing={4}>
                                {filePaths?.map((item, index) => (
                                    <CustomRadioImg
                                        key={index}
                                        data={filePaths[index]}
                                        selected={item.IsDefault === "1"}
                                        name='custom-radios-img'
                                        handleChange={handleChange}
                                        gridProps={{ sm: 4, xs: 12 }}
                                    />
                                ))}
                            </Grid>

                            <Box sx={{ marginLeft: "auto", marginRight: "auto", display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                                <Button onClick={onclickhandle} size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                                    Submit
                                </Button>
                                <Button size='large' variant='outlined' color='secondary' onClick={() => {
                                    reset(defaultValues)
                                    setShow(false)
                                }}>
                                    Cancel
                                </Button>
                            </Box>
                        </Grid></form>
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
            </Dialog >
        </>
    )
}

export default AddProduct
