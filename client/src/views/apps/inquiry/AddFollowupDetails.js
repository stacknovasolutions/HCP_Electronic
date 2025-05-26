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

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Avatar, Card, CardContent, CardHeader, Divider, Fade, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab'
import TimelineFilled from 'src/views/components/timeline/TimelineFilled'
import axios from 'axios'
import { asyncWrap } from 'src/store/util'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import toast from 'react-hot-toast'
import MuiTimeline from '@mui/lab/Timeline'
import moment from 'moment'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'

// Styled Timeline component
const Timeline = styled(MuiTimeline)({
    paddingLeft: 0,
    paddingRight: 0,
    '& .MuiTimelineItem-root': {
        width: '100%',
        '&:before': {
            display: 'none'
        }
    }
})

// Styled component for the image of a shoe
const ImgShoe = styled('img')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius
}))

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

const CustomInput = forwardRef((props, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} label='Next Followup Date' autoComplete='off' />
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

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
    followUpDate: yup.date().required(),
    followUpDescription: yup.string().required(),
})

const defaultValues = {
    followUpDate: '',
    followUpDescription: '',
}

const AddFollowupDetails = props => {
    
    // ** Props
    const { open, toggle, inquiryData } = props
    console.log(inquiryData)

    // ** State
    const [plan, setPlan] = useState('basic')
    const [role, setRole] = useState('subscriber')
    const [date, setDate] = useState(null)
    const [followupData, setFollowupData] = useState()

    // ** Hooks
    const dispatch = useDispatch()
    const store = useSelector(state => state.user)

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        const [error, result] = await asyncWrap(
            axios.post("/inquiry/follow-up", {
                ...data,
                inquiryId: inquiryData?.InquriyID,
            })
        );
        if (!result) {
            console.log(error);
            toast.error(error.response.data.message);
        } else {
            toast.success(result.data.message)
            reset(defaultValues)
            toggle(false)
        };
    }

    const handleClose = () => {
        reset(defaultValues)
        toggle()
    }

    const getFollowupData = async () => {
        const [error, result] = await asyncWrap(axios.get(`/inquiry/follow-up?inquiryId=${inquiryData?.InquriyID}&pageNo=-1`))

        if (error) {
            toast.error(error)
        } else {
            setFollowupData(result?.data?.data)
        }
    }

    useEffect(() => {
        if (open) {
            getFollowupData()
        }
    }, [open])

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
        >
            <Header>
                <Typography variant='h6'>Add Followup</Typography>
                <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
                    <Icon icon='mdi:close' fontSize={20} />
                </IconButton>
            </Header>

            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title='Inquiry Details'
                        
                        // action={
                        //     <Button variant='contained'>
                        //         Edit Inquiry
                        //     </Button>
                        // }
                    />
                    <CardContent>
                        <Grid container spacing={6}>
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
                                                <TableCell>{inquiryData?.InquriyID}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Short Description:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{inquiryData?.ShortDescription}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Long Description:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{inquiryData?.InquiryDescription}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        User Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{inquiryData?.FirstName + " " + inquiryData?.LastName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Assign User:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{inquiryData?.AssignToFirstName + " " + inquiryData?.AssignToLastName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Status Date:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{moment(inquiryData?.StatusDate).format("DD-MM-YYYY")}</TableCell>
                                            </TableRow>
                                            {inquiryData?.FilePath && (<TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        File Download:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell> <a href={inquiryData?.FilePath} target="_blank" rel="noopener noreferrer">download file</a></TableCell>
                                            </TableRow>)}
                                            {/* <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Country:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>Australia</TableCell>
                                            </TableRow>*/}
                                            {/* <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        State:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>Queensland</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Zip Code:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>403114</TableCell>
                                            </TableRow> */}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Timeline sx={{ m: 6 }}>
                                {
                                    followupData?.map((item, index) => (
                                        <TimelineItem key={index}>
                                            <TimelineSeparator>
                                                <TimelineDot color='primary' />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                                                        {item.FollowUpDescriptions}
                                                    </Typography>
                                                    <Typography variant='caption'>  {moment(item.FollowUpDate)?.format("DD-MM-YYYY")}</Typography>
                                                </Box>
                                                {/* <Typography variant='body2' sx={{ color: 'text.primary' }}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus quos, voluptates voluptas rem.
          </Typography> */}
                                                <Divider sx={{ my: theme => `${theme.spacing(3)} !important` }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Avatar src='/images/avatars/2.png' sx={{ width: '2rem', height: '2rem', mr: 2 }} />
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                                                {item.FollowUpByName}
                                                            </Typography>
                                                            <Typography variant='caption'> {item.FollowUpByMobile}</Typography>
                                                            <Typography variant='caption'> {item.FollowUpByEmail}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <div>
                                                        {/* <IconButton sx={{ color: 'text.secondary' }}>
                <Icon icon='mdi:message-outline' fontSize={20} />
              </IconButton>
              <IconButton sx={{ color: 'text.secondary' }}>
                <Icon icon='mdi:phone-dial-outline' fontSize={20} />
              </IconButton> */}
                                                    </div>
                                                </Box>
                                            </TimelineContent>
                                        </TimelineItem>
                                    ))
                                }

                            </Timeline>

                        </Grid>
                    </CardContent>


                </Card>
            </Grid>

            {/* <TimelineFilled /> */}

            <Box style={{ position: "sticky", bottom: "0", background: "white" }} sx={{ p: 5 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <Controller
                                name='followUpDescription'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        multiline
                                        rows={3}
                                        label='Long Description'
                                        onChange={onChange}
                                        error={Boolean(errors.followUpDescription)}
                                    />
                                )}
                            />
                            {errors.followUpDescription && <FormHelperText sx={{ color: 'error.main' }}>{errors.followUpDescription.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: "20px" }}>
                        <DatePickerWrapper>
                            <Controller
                                name='followUpDate'
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
                                                label='Followup Date'
                                                error={Boolean(errors.followUpDate)}
                                            />
                                        }
                                    />
                                )}
                            />
                            {errors.followUpDate && (
                                <FormHelperText sx={{ mx: 3.5, color: 'error.main' }}>
                                    {errors.followUpDate.message}
                                </FormHelperText>
                            )}</DatePickerWrapper>
                    </Grid>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 6 }}>
                        <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                            Submit
                        </Button>
                        <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    )
}

export default AddFollowupDetails
