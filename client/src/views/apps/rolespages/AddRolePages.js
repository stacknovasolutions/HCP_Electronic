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
import { Checkbox, FormControlLabel, FormHelperText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, styled } from '@mui/material'

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
    selectRoleId: yup.string().required(),
    companyId: yup.string()
})

const defaultValues = {
    selectRoleId: '',
    companyId: ''
}

const rolesArr = [
    'User Management',
    'Content Management',
    'Disputes Management',
    'Database Management',
    'Financial Management',
    'Reporting',
    'API Control',
    'Repository Management',
    'Payroll'
]

const AddRolePages = ({ show, setShow }) => {
    const [selectRoleId, setSelectRoleId] = useState()
    const [selectPageData, setSelectPageData] = useState()
    const [companyId, setCompanyId] = useState()
    const [rolesData, setRolesData] = useState()
    const [pagesData, setPagesData] = useState([])

    const [open, setOpen] = useState(false)
    const [companyData, setCompanyData] = useState()
    const [dialogTitle, setDialogTitle] = useState('Add')
    const [selectedCheckbox, setSelectedCheckbox] = useState([])
    const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)

    const handleClickOpen = () => setOpen(true)

    const handleClose = () => {
        setShow(false)
        setSelectedCheckbox([])
        setIsIndeterminateCheckbox(false)
    }

    const togglePermission = id => {
        const arr = [...selectedCheckbox]; // Create a new array to avoid mutating state directly
        if (selectedCheckbox.includes(id)) {
            arr.splice(arr.indexOf(id), 1);
        } else {
            arr.push(id);

            // If the selected permission is 'create' or 'delete', also add the 'read' permission
            const [pageId, permission] = id.split('-');
            if ((permission === 'create' || permission === 'delete') && !arr.includes(`${pageId}-read`)) {
                arr.push(`${pageId}-read`);
            }
        }
        console.log(arr)
        setSelectedCheckbox(arr);
    };


    const handleSelectAllCheckbox = () => {
        if (isIndeterminateCheckbox) {
            setSelectedCheckbox([])
        } else {
            pagesData.forEach(row => {
                console.log(pagesData)
                const id = row.PageID;
                togglePermission(`${id}-read`)
                togglePermission(`${id}-create`)
                togglePermission(`${id}-delete`)
            })
        }
    }
    useEffect(() => {
        if (selectedCheckbox.length > 0 && selectedCheckbox.length < rolesArr.length * 3) {
            setIsIndeterminateCheckbox(true)
        } else {
            setIsIndeterminateCheckbox(false)
        }
    }, [selectedCheckbox])

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

    const convertCheckboxData = () => {
        const formattedData = [];
        selectedCheckbox.forEach(id => {
            const [pageId, permission] = id.split('-');
            const permissionName = permission === 'read' ? 'Read' : permission === 'create' ? 'Create' : 'Delete';
            const roleID = selectRoleId; // Assuming you have selectedRoleId available
            formattedData.push({
                RoleID: roleID,
                PageID: pageId,
                PermissionName: permissionName,
                Permission: 1
            });
        });

        return formattedData;
    };

    const revertCheckboxData = (formattedData) => {
        const revertedData = [];
        formattedData.forEach(item => {
            let permission;
            switch (item.PermissionName) {
                case 'Read':
                    permission = 'read';
                    break;
                case 'Create':
                    permission = 'create';
                    break;
                case 'Delete':
                    permission = 'delete';
                    break;
                default:
                    permission = ''; // Handle any unexpected cases
            }
            revertedData.push(`${item.PageID}-${permission}`);
        });

        return revertedData;
    };


    const onSubmit = async (data) => {
        const formattedData = convertCheckboxData();

        let requestData = {
            roleWisePage: formattedData
        }

        console.log(formattedData)
        if (JSON.parse(localStorage.getItem("userData"))?.CompanyID === "0") {
            requestData = { ...data, roleWisePage: formattedData }
        }

        const [error, result] = await asyncWrap(
            axios.post("/page/rolewise", requestData)
        );
        if (!result) {
            console.log(error);
            toast.error(error.response.data.message);
        } else {
            toast.success(result.data?.message)
            setSelectedCheckbox([])
            setIsIndeterminateCheckbox(false)
            setShow(false)
        };
    }


    const getPagesData = async (id = 0) => {
        let url = ''

        if (JSON.parse(localStorage.getItem("userData")).CompanyID === "0") {
            url = `/page/company-pages?companyId=${id}`
        } else {
            url = `/page/company-pages`
        }

        const [error, result] = await asyncWrap(axios.get(url))

        if (error) {
            toast.error(error)
        } else {
            setPagesData(result?.data?.data)
        }
    }

    const getRolesData = async () => {
        const [error, result] = await asyncWrap(axios.get("/user/roles"))

        if (error) {
            toast.error(error)
        } else {
            setRolesData(result?.data?.data)
        }
    }

    const getCompanyWiseRoleData = async (id) => {
        const [error, result] = await asyncWrap(axios.get(`/user/roles?companyId=${id}`))

        if (error) {
            toast.error(error)
        } else {
            setRolesData(result?.data?.data)
        }
    }

    const getCompanyData = async () => {
        const [error, result] = await asyncWrap(axios.get("/company?pageNo=-1"))

        if (error) {
            toast.error(error)
        } else {
            setCompanyData(result?.data?.data)
        }
    }

    const getRolesWiseData = async (id) => {
        const [error, result] = await asyncWrap(axios.get(`/page/roleWise?roleId=${id}&pageNo=-1`))

        if (error) {
            toast.error(error)
        } else {
            const formattedData = revertCheckboxData(result?.data?.data)
            setSelectedCheckbox(formattedData)
        }
    }


    useEffect(() => {
        getPagesData()
        getRolesData()
        getCompanyData()
    }, [])

    return (
        <>
            <Dialog
                fullWidth
                open={show}
                maxWidth='md'
                scroll='body'
                onClose={() => {
                    setSelectRoleId("")
                    setCompanyId("")
                    setShow(!show)
                }}
                TransitionComponent={Transition}
                onBackdropClick={() => {
                    setSelectRoleId("")
                    setCompanyId("")
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
                            setSelectRoleId("")
                            setCompanyId("")
                            setShow(false)
                        }}
                        sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    >
                        <Icon icon='mdi:close' />
                    </IconButton>
                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ mb: 3 }}>
                            Add Roles Pages
                        </Typography>
                    </Box>
                    {/* <Grid container spacing={6}> */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <Grid item xs={12}> */}

                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <InputLabel id='country-select'>Select Company</InputLabel>
                            <Select
                                disabled={JSON.parse(localStorage.getItem("userData"))?.CompanyID !== "0"}
                                fullWidth
                                {...register('companyId', { required: true })}
                                value={companyId}
                                onChange={(e) => {
                                    getCompanyWiseRoleData(e.target.value)
                                    getPagesData(e.target.value)
                                    setCompanyId(e.target.value)
                                }}
                                placeholder='UK'
                                label='Country'
                                labelId='country-select'
                                defaultValue={
                                    JSON.parse(localStorage.getItem("userData"))?.CompanyId === "0" ? "" : JSON.parse(localStorage.getItem("userData"))?.CompanyID
                                }
                            >
                                {companyData?.map((item, index) => (
                                    <MenuItem key={index} value={item?.CompanyID}>{item?.CompanyName}</MenuItem>
                                ))}
                            </Select>
                            {errors.companyId && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.companyId.message}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <InputLabel id='country-select'>Select Role</InputLabel>
                            <Select
                                fullWidth
                                {...register('selectRoleId', { required: true })}
                                value={selectRoleId}
                                onChange={(e) => {
                                    getRolesWiseData(e.target.value)
                                    setSelectRoleId(e.target.value)
                                }}
                                placeholder='UK'
                                label='Country'
                                labelId='country-select'
                                defaultValue=''
                            >
                                <MenuItem value="">Select Role</MenuItem>
                                {rolesData?.map((item, index) => (
                                    <MenuItem key={index} value={item?.RoleID}>{item?.RoleName}</MenuItem>
                                ))}
                            </Select>
                            {errors.selectRoleId && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.selectRoleId.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {/* </Grid> */}
                        {/* <Grid item xs={12}> */}
                        <TableContainer>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        {/* <TableCell sx={{ pl: '0 !important' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    fontSize: '0.875rem',
                                                    whiteSpace: 'nowrap',
                                                    alignItems: 'center',
                                                    textTransform: 'capitalize',
                                                    '& svg': { ml: 1, cursor: 'pointer' }
                                                }}
                                            >
                                                Administrator Access
                                                <Tooltip placement='top' title='Allows a full access to the system'>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Icon icon='mdi:information-outline' fontSize='1rem' />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        </TableCell> */}
                                        {/* <TableCell colSpan={3}>
                                            <FormControlLabel
                                                label='Select All'
                                                sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                                                control={
                                                    <Checkbox
                                                        size='small'
                                                        onChange={handleSelectAllCheckbox}
                                                        indeterminate={isIndeterminateCheckbox}
                                                        checked={selectedCheckbox.length === rolesArr.length * 3}
                                                    />
                                                }
                                            />
                                        </TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagesData.map((item, index) => {
                                        const id = item.PageID
                                        console.log(id)

                                        return (
                                            <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                                                <TableCell
                                                    sx={{
                                                        fontWeight: 600,
                                                        whiteSpace: 'nowrap',
                                                        color: theme => `${theme.palette.text.primary} !important`
                                                    }}
                                                >
                                                    {item.PageName}
                                                </TableCell>
                                                <TableCell>
                                                    <FormControlLabel
                                                        label='Read'
                                                        control={
                                                            <Checkbox
                                                                size='small'
                                                                id={`${id}-read`}
                                                                onChange={() => togglePermission(`${id}-read`)}
                                                                checked={selectedCheckbox.includes(`${id}-read`)}
                                                            />
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormControlLabel
                                                        label='Create'
                                                        control={
                                                            <Checkbox
                                                                size='small'
                                                                id={`${id}-create`}
                                                                onChange={() => togglePermission(`${id}-create`)}
                                                                checked={selectedCheckbox.includes(`${id}-create`)}
                                                            />
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormControlLabel
                                                        label='Delete'
                                                        control={
                                                            <Checkbox
                                                                size='small'
                                                                id={`${id}-delete`}
                                                                onChange={() => togglePermission(`${id}-delete`)}
                                                                checked={selectedCheckbox.includes(`${id}-delete`)}
                                                            />
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

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

export default AddRolePages
