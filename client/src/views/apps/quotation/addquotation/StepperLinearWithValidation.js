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
import TableBasic from './TableBasic'
import { FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const steps = [
  {
    title: 'Inquiry Info',
    subtitle: 'Enter your Inquiry Info'
  },
  {
    title: 'Quotation',
    subtitle: 'Quotation Info'
  },
  {
    title: 'Terms & Condition',
    subtitle: 'Terms & Condition Info'
  },
  {
    title: 'Quotation Details',
    subtitle: 'Quotation Details'
  }
]

const defaultInquiryValues = {
  inquiryId: ''
}

const defaultTermCondition = {
  termConditionId: ''
}

const defaultQuotation = {
  quotationData: ''
}

const defaultLastValues = {
  shortDescription: '',
  description: '',
  quotationDate: '',
}

const inquirySchema = yup.object().shape({
  inquiryId: yup.string().required()
})

const termConditionSchema = yup.object().shape({
  termConditionId: yup.string().required()
})

const quotationSchema = yup.object().shape({
  quotationType: yup.string().required()
})

const lastSchema = yup.object().shape({
  shortDescription: yup.string().required(),
  description: yup.string().required(),
  quotationDate: yup.date().required()
})

const personalSchema = yup.object().shape({
  country: yup.string().required(),
  'last-name': yup.string().required(),
  'first-name': yup.string().required(),
  language: yup.array().min(1).required()
})

const socialSchema = yup.object().shape({
  google: yup.string().required(),
  twitter: yup.string().required(),
  facebook: yup.string().required(),
  linkedIn: yup.string().required()
})

const initialState = {
  Serial_Number: '',
  Product_Code: '',
  Product_Name: '',
  Unit_Price: '',
  Quantity: '',
  Gst: '',
  Total_price: ''
};

const initialProductState = {
  Serial_Number: 'SERIAL NUMBER 1',
  Product_Code: 'PRODUCT CODE 1',
  Product_Name: 'PRODUCT NAME',
  Unit_Price: '10',
  Quantity: '5',
  Gst: 'gst ..',
  Total_price: '50'
};

const StepperLinearWithValidation = () => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)
  const router = useRouter()
  const [inquiryData, setInquiryData] = useState([])
  const [termConditionData, setTermConditionData] = useState()
  const [productDetailsData, setProductDetailsData] = useState([])
  const [inquiryId, setInquiryId] = useState()
  const [termConditionId, setTermConditionId] = useState()
  const [quotationData, setQuotationData] = useState()
  const [selectedProduct, setSelectedProduct] = useState('Select Country');
  const [quantity, setQuantity] = useState('');
  const [productError, setProductError] = useState("")
  const [productList, setProductList] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)

  // State to hold table data
  const [tableData, setTableData] = useState([]);

  // Function to handle adding a row
  const handleAddRow = () => {
    setTableData(prevData => [...prevData, {
      Serial_Number: '',
      Product_Code: '',
      Product_Name: '',
      Unit_Price: '',
      Quantity: '',
      Gst: '',
      Total_price: ''
    }]);
  };

  const onDataChange = (index, field, value) => {
    setTableData(prevData => {
      const newData = [...prevData];
      newData[index][field] = value;
      
      return newData;
    });
  }

  // Function to handle input changes in a row
  const handleInputChange = (index, field, value) => {
    onDataChange(index, field, value);

    // If the changed field is Unit_Price or Quantity, calculate and update Total_price
    if (field === 'Unit_Price') {
      const unitPrice = parseFloat(value);
      const quantity = parseFloat(tableData[index].Quantity);
      const total = isNaN(unitPrice) || isNaN(quantity) ? '' : (unitPrice * quantity).toFixed(2);
      onDataChange(index, 'Total_price', total);
    }

    if (field === 'Quantity') {
      const quantity = parseFloat(value);
      const unitPrice = parseFloat(tableData[index].Unit_Price);
      const total = isNaN(unitPrice) || isNaN(quantity) ? '' : (unitPrice * quantity).toFixed(2);
      onDataChange(index, 'Total_price', total);
    }
  };



  const [productData, setProductData] = useState([{
    Serial_Number: 'SERIAL NUMBER 1',
    Product_Code: 'PRODUCT CODE 1',
    Product_Name: 'PRODUCT NAME',
    Unit_Price: '10',
    Quantity: '5',
    Gst: 'gst ..',
    Total_price: '50'
  }, {
    Serial_Number: 'SERIAL NUMBER 1',
    Product_Code: 'PRODUCT CODE 1',
    Product_Name: 'PRODUCT NAME',
    Unit_Price: '10',
    Quantity: '5',
    Gst: 'gst ..',
    Total_price: '50'
  }, {
    Serial_Number: 'SERIAL NUMBER 1',
    Product_Code: 'PRODUCT CODE 1',
    Product_Name: 'PRODUCT NAME',
    Unit_Price: '10',
    Quantity: '5',
    Gst: 'gst ..',
    Total_price: '50'
  }]);

  const handleProductData = (event) => {
    const productData = event.target.value;
    console.log(productData)
    setSelectedProduct(productData);
  };

  // const handleInputChange = (index, fieldName, value) => {
  //   const updatedProducts = [...productList];
  //   const product = updatedProducts[index];

  //   if (fieldName === 'Quantity') {
  //     product.Quantity = value;
  //     product.Sub_Total = parseInt(value) * product.UnitPrice; // Recalculate subtotal based on new quantity
  //   } else if (fieldName === 'UnitPrice') {
  //     product.UnitPrice = value;
  //     product.Sub_Total = parseInt(value) * product.Quantity; // Recalculate subtotal based on new unit price
  //   }

  //   // setTotalAmount(total)
  //   setProductList(updatedProducts);
  // };

  const handleAddRowProduct = () => {
    if (!selectedProduct) {
      setProductError('Please select a product');

      return;
    }

    if (!quantity || quantity <= 0) {
      setProductError('Please enter a valid quantity');

      return;
    }

    const selectedProductDetails = productDetailsData.find(item => item.ProductID === selectedProduct);
    const productName = selectedProductDetails ? selectedProductDetails.ProductName : '';

    // Add the selected product details to the product list array
    setProductList([...productList, {
      ProductID: selectedProductDetails.ProductID,
      ProductName: selectedProductDetails.ProductName,
      Quantity: quantity,
      ProductCode: selectedProductDetails.ProductCode,
      GSTPolicyID: selectedProductDetails.GSTPolicyID,
      UnitPrice: selectedProductDetails?.UnitPirce || 0,
      Sub_Total: parseInt(quantity) * selectedProductDetails?.UnitPirce
    }]);

    setTotalAmount(totalAmount + (parseInt(quantity) * 20))

    // Clear the selected product and quantity fields
    setSelectedProduct(null);
    setQuantity('');

    // Clear any previous errors
    setProductError("");
  };

  const calculateTotalAmount = () => {

    // console.log(totalAmount)
    let totalAmount = 0;
    productList?.map(product => {
      totalAmount += product.Sub_Total;
    });
    setTotalAmount(totalAmount)

    return totalAmount;
  };

  const [state, setState] = useState({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false
  })

  // ** Hooks
  const {
    reset: inquiryReset,
    control: inquiryControl,
    register,
    handleSubmit: handleInquirySubmit,
    formState: { errors: inquiryError }
  } = useForm({
    defaultValues: defaultInquiryValues,
    resolver: yupResolver(inquirySchema)
  })

  const {
    reset: termConditionReset,
    control: termConditionControl,
    register: termConditionRegister,
    handleSubmit: handleTermConditionSubmit,
    formState: { errors: termConditionError }
  } = useForm({
    defaultValues: defaultTermCondition,
    resolver: yupResolver(termConditionSchema)
  })

  const {
    reset: lastReset,
    control: lastControl,
    register: lastRegister,
    handleSubmit: handleLastSubmit,
    formState: { errors: lastError }
  } = useForm({
    defaultValues: defaultLastValues,
    resolver: yupResolver(lastSchema)
  })

  const {
    reset: quotationReset,
    control: quotationControl,
    handleSubmit: handleSubmitQuotation,
    formState: { errors: quotationError }
  } = useForm({
    defaultValues: defaultQuotation,
    resolver: yupResolver(quotationSchema)
  })

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    inquiryReset(defaultInquiryValues)
    termConditionReset(defaultTermCondition)
    quotationReset(defaultQuotation)
    lastReset(defaultLastValues)

    // socialReset({ google: '', twitter: '', facebook: '', linkedIn: '' })
    // accountReset({ email: '', username: '', password: '', 'confirm-password': '' })
    // personalReset({ country: '', language: [], 'last-name': '', 'first-name': '' })
  }

  const onSubmit = async (data) => {

    const convertedFormat = productList.map(item => ({
      ProductID: item.ProductID,
      Quantity: item.Quantity,
      UnitPrice: item.UnitPrice,
      SubTotal: item.Sub_Total
    }));

    const requestData = {
      ...data,
      ...quotationData,
      totalAmount,
      quotationType: quotationType,
      quotationItem: convertedFormat
    }

    const [error, result] = await asyncWrap(
      axios.post("/quotation", requestData)
    );
    if (!result) {
      console.log(error);
      toast.error(error.response.data.message);
    } else {
      toast.success(result.data.message)
      router.push('/apps/quotation')
    };

  }

  // Handle Password
  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }

  // Handle Confirm Password
  const handleClickShowConfirmPassword = () => {
    setState({ ...state, showPassword2: !state.showPassword2 })
  }

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [quotationType, setQuotationType] = useState('tender');
  const [selectTermConditionData, setSelectTermConditionData] = useState()
  const [selectInquiryData, setSelectInquiryData] = useState()

  const handleRadioChange = (event) => {
    setProductData([])
    setQuotationType(event.target.value);
  };

  const handleTermConditionChange = (e) => {
    console.log(e.target.value)
    const selectedId = e.target.value;
    const selectedItem = termConditionData.find(item => item.TermsConditionID === selectedId);
    console.log(selectedItem)
    setTermConditionId(selectedId);
    setSelectTermConditionData(selectedItem);
  };

  const handleInquiryChange = (e) => {
    const selectedId = e.target.value;
    const selectedItem = inquiryData.find(item => item.InquriyID === selectedId);
    setSelectInquiryData(selectedItem);
    setInquiryId(selectedId);
  };

  const onSubmitInquiry = (data) => {
    setQuotationData({ ...quotationData, ...data })
    console.log({ ...quotationData, ...data })
    setActiveStep(activeStep + 1)
  }

  const onSubmitTermCondition = (data) => {
    console.log(selectInquiryData)
    console.log(selectTermConditionData)
    setQuotationData({ ...quotationData, ...data })
    setActiveStep(activeStep + 1)
  }

  const onSubmitQuotationData = (data) => {

    if (!quotationType) {
      toast.error('Please select a Quotation Type');

      return;
    }

    if (quotationType !== "tender") {
      if (productList.length <= 0) {
        toast.error('Please select a Quotation Item');

        return;
      }

      let total = 0
      productList?.map(product => {
        total += product.Sub_Total;
      });

      setTotalAmount(total)
    } else {
      if (tableData.length <= 0) {
        toast.error('Please select a Quotation Item');

        return;
      }

      let total = 0
      tableData?.map(product => {
        total += parseInt(product.Total_price);
      });

      setTotalAmount(total)
    }


    setActiveStep(activeStep + 1)
  }

  const getStateData = async () => {
    const [error, result] = await asyncWrap(axios.get("/inquiry"))

    if (error) {
      toast.error(error)
    } else {
      setInquiryData(result?.data?.data)
    }
  }

  const getTermConditionData = async () => {
    const [error, result] = await asyncWrap(axios.get("/terms?pageNo=-1"))

    if (error) {
      toast.error(error)
    } else {
      setTermConditionData(result?.data?.data)
    }
  }

  const getProductData = async () => {
    const [error, result] = await asyncWrap(axios.get("/product?pageNo=-1"))

    if (error) {
      toast.error(error)
    } else {
      setProductDetailsData(result?.data?.data)
    }
  }

  useEffect(() => {
    getStateData()
    getProductData()
    getTermConditionData()
  }, [])

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleInquirySubmit(onSubmitInquiry)} key={0}>
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
                  1. Inquiry Info
                </Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='country-select'>Select State</InputLabel>
                  <Select
                    fullWidth
                    {...register('inquiryId', { required: true })}
                    value={inquiryId}
                    onChange={handleInquiryChange}
                    placeholder='UK'
                    label='Select State'
                    labelId='country-select'
                    defaultValue='Select Role'
                  >
                    <MenuItem value=''>Select State</MenuItem>
                    {inquiryData?.map((item, index) => (
                      <MenuItem key={index} value={item.InquriyID}>{item.ShortDescription}</MenuItem>
                    ))}
                  </Select>
                  {inquiryError.inquiryId && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {inquiryError.inquiryId.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={() => router.push('/apps/inquiry/addinquiry')} component="label" variant="contained">
                  Add Inquiry
                </Button>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' disabled>
                  Back
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>

          </form>
        )
      case 1:
        return (

          <Grid spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                {steps[1].title}
              </Typography>
              <Typography variant='caption' component='p'>
                {steps[1].subtitle}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Select Quotation Type</FormLabel>
                <RadioGroup
                  row
                  value={quotationType}
                  onChange={handleRadioChange}
                  defaultValue='home'
                  aria-label='address type'
                  name='form-layouts-collapsible-address-radio'
                >
                  <FormControlLabel value='tender' control={<Radio />} label='Tender' />
                  <FormControlLabel value='product' control={<Radio />} label='Product' />
                  <FormControlLabel value='sparts' control={<Radio />} label='type 3' />
                </RadioGroup>
              </FormControl>
            </Grid>
            {quotationType === "tender" && (<div>
              <div>
                <TableContainer >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Serial Number</TableCell>
                        <TableCell>Product Code</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>GST Number</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              style={{ width: "200px" }}
                              type='text'
                              label='Serial Number'
                              placeholder='carterleonard@gmail.com'
                              name="Serial_Number"
                              value={row.Serial_Number}
                              onChange={(e) => handleInputChange(index, 'Serial_Number', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "200px" }}
                              type='text'
                              label='Product Code'
                              placeholder='text'
                              name="Product_Code"
                              value={row.Product_Code}
                              onChange={(e) => handleInputChange(index, 'Product_Code', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "200px" }}
                              type='text'
                              label='Product Name'
                              placeholder='text'
                              name="Product_Name"
                              value={row.Product_Name}
                              onChange={(e) => handleInputChange(index, 'Product_Name', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "100px" }}
                              type='Number'
                              label='Unit Price'
                              placeholder='10'
                              name="Unit_Price"
                              value={row.Unit_Price}
                              onChange={(e) => handleInputChange(index, 'Unit_Price', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "100px" }}
                              type='Number'
                              label='Quantity'
                              placeholder='10'
                              name="Quantity"
                              value={row.Quantity}
                              onChange={(e) => handleInputChange(index, 'Quantity', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "200px" }}
                              type='text'
                              label='GST number'
                              placeholder='10'
                              name="Gst"
                              value={row.Gst}
                              onChange={(e) => handleInputChange(index, 'Gst', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>{row.Total_price}</TableCell>
                          <TableCell>
                            <IconButton component={Link} href='/apps/user/view/overview/'>
                              <Icon icon='ic:outline-delete' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* <TableRow>
                          <TableCell>
                            <TextField
                              style={{ width: "200px" }}
                              type='text'
                              label='Serial Number'
                              placeholder='carterleonard@gmail.com'
                              name="Serial_Number"
                              value={formData.Serial_Number}
                              onChange={handleInputChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "200px" }}
                              type='text'
                              label='Product Code'
                              placeholder='text'
                              name="Product_Code"
                              value={formData.Product_Code}
                              onChange={handleInputChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "200px" }}
                              type='text'
                              label='Product Name'
                              placeholder='text'
                              name="Product_Name"
                              value={formData.Product_Name}
                              onChange={handleInputChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "100px" }}
                              type='Number'
                              label='Unit Price'
                              placeholder='10'
                              name="Unit_Price"
                              value={formData.Unit_Price}
                              onChange={handleInputChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "100px" }}
                              type='Number'
                              label='Quantity'
                              placeholder='10'
                              name="Quantity"
                              value={formData.Quantity}
                              onChange={handleInputChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "200px" }}
                              type='text'
                              label='GST number'
                              placeholder='10'
                              name="Gst"
                              value={formData.Gst}
                              onChange={handleInputChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              style={{ width: "150px" }}
                              type='Number'
                              label='Total Price'
                              placeholder='10'
                              name="Total_price"
                              value={formData.Total_price}
                              onChange={handleInputChange}
                            />
                          </TableCell>
                        </TableRow> */}


                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

            </div>)}
            {quotationType === "tender" && (<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: "20px" }}>
              <Button variant="contained" color="primary" onClick={handleAddRow}>
                Add Product
              </Button>
            </Grid>)}

            {(quotationType === "product" || quotationType === "sparts") && (
              <>
                <Grid item container spacing={2}>
                  <Grid item sm={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='country-select'>Add Product</InputLabel>
                      <Select
                        fullWidth
                        placeholder='UK'
                        label='Country'
                        labelId='country-select'
                        defaultValue='Select Country'
                        value={selectedProduct}
                        onChange={(event) => setSelectedProduct(event.target.value)}
                      >
                        <MenuItem value=''>Select Product</MenuItem>
                        {productDetailsData?.map((item, index) => (
                          <MenuItem key={index} value={item.ProductID}>{item.ProductName}</MenuItem>
                        ))}
                      </Select>
                      {productError && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {productError}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} lg={3}>
                    <TextField fullWidth value={quantity}
                      onChange={(e) => setQuantity(e.target.value)} label='Quantity' type="number"
                      placeholder='Mall Road' />
                  </Grid>
                  <Grid item style={{ alignSelf: "center" }} xs={3} lg={3}>
                    <Button variant="contained" color="primary" onClick={handleAddRowProduct}>
                      Add Product
                    </Button>
                  </Grid>
                </Grid>

                {productList.length > 0 && (<div style={{ width: "100%" }}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Serial Number</TableCell>
                          <TableCell>Product Code</TableCell>
                          <TableCell>Product Name</TableCell>
                          <TableCell>Unit Price</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>GST Number</TableCell>
                          <TableCell>Total Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productList.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.ProductID}</TableCell>
                            <TableCell>{row.ProductName}</TableCell>
                            <TableCell>{row.ProductCode}</TableCell>
                            <TableCell>
                              <TextField
                                style={{ width: "100px" }}
                                type='Number'
                                label='Unit price'
                                placeholder='10'
                                name="Unit Price"
                                value={row.UnitPrice}
                                onChange={(event) => {
                                  handleInputChange(index, "UnitPrice", event.target.value)
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                style={{ width: "100px" }}
                                type='Number'
                                label='Quantity'
                                placeholder='10'
                                name="Quantity"
                                value={row.Quantity}
                                onChange={(event) => {
                                  handleInputChange(index, "Quantity", event.target.value)
                                }}
                              />
                            </TableCell>
                            <TableCell>{row.GSTPolicyID}</TableCell>
                            <TableCell>{row.Sub_Total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>)}
              </>)}

            {/* {quotationType === "sparts" && (
                <>
                  <Grid item container spacing={2}>
                    <Grid item xs={12} lg={6}>
                      <FormControl fullWidth>
                        <InputLabel id='country-select'>Select Product</InputLabel>
                        <Select
                          fullWidth
                          placeholder='UK'
                          label='Country'
                          labelId='country-select'
                          defaultValue='Select Country'
                          value={selectedProduct}
                          onChange={handleProductData}
                        >
                          <MenuItem value='Select Country'>select product</MenuItem>
                          <MenuItem value='product 1'>part 1</MenuItem>
                          <MenuItem value='product 2'>part 2</MenuItem>
                          <MenuItem value='product 3'>part 3</MenuItem>
                          <MenuItem value='product 4'>part 4</MenuItem>
                          <MenuItem value='product 5'>part 5</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                      <TextField fullWidth value={quantity}
                        onChange={(e) => setQuantity(e.target.value)} label='Quantity' type="number"
                        placeholder='Mall Road' />
                    </Grid>
                    <Grid item style={{ alignSelf: "center" }} xs={3} lg={3}>
                      <Button variant="contained" color="primary" onClick={handleAddRowProduct}>
                        Add Product
                      </Button>
                    </Grid>
                  </Grid>

                  {productData.length > 0 && (<div style={{ width: "100%" }}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Serial Number</TableCell>
                            <TableCell>Product Code</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Unit Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>GST Number</TableCell>
                            <TableCell>Total Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.Serial_Number}</TableCell>
                              <TableCell>{row.Product_Code}</TableCell>
                              <TableCell>{row.Product_Name}</TableCell>
                              <TableCell>{row.Unit_Price}</TableCell>
                              <TableCell>{row.Quantity}</TableCell>
                              <TableCell>{row.Gst}</TableCell>
                              <TableCell>{row.Total_price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>)}
                </>)} */}


            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: "15px" }}>
              <Button onClick={() => setActiveStep(activeStep - 1)} size='large' variant='outlined' color='secondary'>
                Back
              </Button>
              <Button onClick={() => onSubmitQuotationData()} size='large' type='submit' variant='contained'>
                Next
              </Button>
            </Grid>
          </Grid>


        )
      case 2:
        return (
          <form onSubmit={handleTermConditionSubmit(onSubmitTermCondition)} key={2}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[2].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[2].subtitle}
                </Typography>
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='country-select'>Terms & Conditions</InputLabel>
                  <Select
                    fullWidth
                    {...termConditionRegister('termConditionId', { required: true })}
                    value={termConditionId}
                    onChange={handleTermConditionChange}
                    placeholder='UK'
                    label='Select State'
                    control={termConditionControl}
                    labelId='country-select'
                    defaultValue='Select Role'
                  >
                    <MenuItem value=''>Select State</MenuItem>
                    {termConditionData?.map((item, index) => (
                      <MenuItem key={index} value={item.TermsConditionID}>{item.Description}</MenuItem>
                    ))}
                  </Select>
                  {termConditionError.termConditionId && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {termConditionError.termConditionId.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='country-select'>Terms & Conditions</InputLabel>
                  <Select
                    fullWidth
                    placeholder='UK'
                    label='Country'
                    labelId='country-select'
                    defaultValue='Select Country'
                  >
                    <MenuItem value='Select Country'>Terms & Conditions</MenuItem>
                    <MenuItem value='France'>France</MenuItem>
                    <MenuItem value='Russia'>Russia</MenuItem>
                    <MenuItem value='China'>China</MenuItem>
                    <MenuItem value='UK'>UK</MenuItem>
                    <MenuItem value='US'>US</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              {/* <Grid item xs={12}>
                <TableBasic />
              </Grid> */}
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
      case 3:
        return (
          <form onSubmit={handleLastSubmit(onSubmit)} key={3} >
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
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Inquiry Info
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table size='small' sx={{ width: '95%' }}>
                    <TableBody
                      sx={{
                        '& .MuiTableCell-root': {
                          border: 0,
                          pt: 2,
                          pb: 2.5,
                          pl: '0 !important',
                          pr: '0 !important',
                          '&:first-of-type': {
                            width: 148
                          }
                        }
                      }}
                    >

                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Inquiry ID:
                          </Typography>
                        </TableCell>
                        <TableCell>{selectInquiryData?.InquriyID}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            User ID:
                          </Typography>
                        </TableCell>
                        <TableCell>{selectInquiryData?.UserID}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            User Name:
                          </Typography>
                        </TableCell>
                        <TableCell>{selectInquiryData?.FirstName + " " + selectInquiryData?.LastName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Assign Id:
                          </Typography>
                        </TableCell>
                        <TableCell>{selectInquiryData?.AssignedtoUserID}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Assign Name:
                          </Typography>
                        </TableCell>
                        <TableCell>{selectInquiryData?.AssignToFirstName + " " + selectInquiryData?.AssignToLastName }</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Sort Details:
                          </Typography>
                        </TableCell>
                        <TableCell>{selectInquiryData?.ShortDescription}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Long Details:
                          </Typography>
                        </TableCell>
                        <TableCell>{selectInquiryData?.InquiryDescription}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Status Date:
                          </Typography>
                        </TableCell>
                        <TableCell>{selectInquiryData?.StatusDate}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Quotation Info
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table size='small' sx={{ width: '95%' }}>
                    <TableBody
                      sx={{
                        '& .MuiTableCell-root': {
                          border: 0,
                          pt: 2,
                          pb: 2.5,
                          pl: '0 !important',
                          pr: '0 !important',
                          '&:first-of-type': {
                            width: 148
                          }
                        }
                      }}
                    >
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Quotation Type:
                          </Typography>
                        </TableCell>
                        <TableCell> {quotationType}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Serial Number</TableCell>
                        <TableCell>Product Code</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>GST Number</TableCell>
                        <TableCell>Total Price</TableCell>
                      </TableRow>
                    </TableHead>
                    {quotationType === "tender" ? (
                      <TableBody>
                        {tableData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.Serial_Number}</TableCell>
                            <TableCell>{row.Product_Code}</TableCell>
                            <TableCell>{row.Product_Name}</TableCell>
                            <TableCell>{row.Unit_Price}</TableCell>
                            <TableCell>{row.Quantity}</TableCell>
                            <TableCell>{row.Gst}</TableCell>
                            <TableCell>{row.Total_price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (<TableBody>
                      {productList.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.ProductID}</TableCell>
                          <TableCell>{row.ProductName}</TableCell>
                          <TableCell>{row.ProductCode}</TableCell>
                          <TableCell>{row.UnitPrice}</TableCell>
                          <TableCell>{row.Quantity}</TableCell>
                          <TableCell>{row.Gst}</TableCell>
                          <TableCell>{row.Sub_Total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>)}
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1' sx={{ fontWeight: 600, textAlign: "end" }}>
                  Total Amount : {totalAmount}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  3. Terms & Conditions Info
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  Terms & Conditions Description : {selectTermConditionData?.Description} 
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  4. Followup Info
                </Typography>
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
                    control={lastControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Short Description'
                        onChange={onChange}
                        error={Boolean(lastError.shortDescription)}
                      />
                    )}
                  />
                  {lastError.shortDescription && <FormHelperText sx={{ color: 'error.main' }}>{lastError.shortDescription.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='description'
                    control={lastControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        multiline
                        rows={3}
                        label='Long Description'
                        onChange={onChange}
                        error={Boolean(lastError.description)}
                      />
                    )}
                  />
                  {lastError.description && <FormHelperText sx={{ color: 'error.main' }}>{lastError.description.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DatePickerWrapper>
                  <Controller
                    name='quotationDate'
                    control={lastControl}
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
                            label='Quotation Date'
                            error={Boolean(lastError.quotationDate)}
                          />
                        }
                      />
                    )}
                  />
                  {lastError.quotationDate && (
                    <FormHelperText sx={{ mx: 3.5, color: 'error.main' }}>
                      {lastError.quotationDate.message}
                    </FormHelperText>
                  )}</DatePickerWrapper>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveStep(activeStep - 1)} size='large' variant='outlined' color='secondary'>
                  Back
                </Button>
                <div>
                  <Button size='large' type='submit' variant='contained'>
                    Save
                  </Button>
                  <Button style={{ marginLeft: "10px" }} size='large' type='submit' variant='contained'>
                    Save & Send
                  </Button>
                </div>
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
                  inquiryError.inquiryId &&
                  activeStep === 0
                ) {
                  labelProps.error = true
                } else if (
                  (quotationType ||
                    productList.length <= 0) &&
                  activeStep === 1
                ) {
                  labelProps.error = true
                } else if (
                  (termConditionId) &&
                  activeStep === 2
                ) {
                  labelProps.error = true
                } else if (
                  (lastError.shortDescription || lastError.description || lastError.quotationDate) &&
                  activeStep === 3
                ) {
                  labelProps.error = true
                }
                else {
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
