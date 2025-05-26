// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import Payment from 'payment'
import Cards from 'react-credit-cards'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { Avatar } from '@mui/material'

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

// Styled Timeline component
const Timeline = styled(MuiTimeline)(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))

const data = [
  {
    cardCvc: '587',
    name: 'Tom McBride',
    expiryDate: '12/24',
    imgAlt: 'Mastercard',
    badgeColor: 'primary',
    cardStatus: 'Primary',
    cardNumber: '5577 0000 5577 9865',
    imgSrc: '/images/logos/mastercard.png'
  },
  {
    cardCvc: '681',
    imgAlt: 'Visa card',
    expiryDate: '02/24',
    name: 'Mildred Wagner',
    cardNumber: '4532 3616 2070 5678',
    imgSrc: '/images/logos/visa.png'
  },
  {
    cardCvc: '3845',
    expiryDate: '08/20',
    badgeColor: 'error',
    cardStatus: 'Expired',
    name: 'Lester Jennings',
    imgAlt: 'American Express card',
    cardNumber: '3700 000000 00002',
    imgSrc: '/images/logos/american-express.png'
  }
]

const InquiryFollowupDetails = () => {
  // ** States
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [focus, setFocus] = useState()
  const [cardId, setCardId] = useState(0)
  const [expiry, setExpiry] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [openEditCard, setOpenEditCard] = useState(false)
  const [openAddressCard, setOpenAddressCard] = useState(false)
  const [openUpgradePlans, setOpenUpgradePlans] = useState(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)

  // Handle Edit Card dialog and get card ID
  const handleEditCardClickOpen = id => {
    setDialogTitle('Edit')
    setCardId(id)
    setCardNumber(data[id].cardNumber)
    setName(data[id].name)
    setCvc(data[id].cardCvc)
    setExpiry(data[id].expiryDate)
    setOpenEditCard(true)
  }

  const handleAddCardClickOpen = () => {
    setDialogTitle('Add')
    setCardNumber('')
    setName('')
    setCvc('')
    setExpiry('')
    setOpenEditCard(true)
  }

  const handleEditCardClose = () => {
    setDialogTitle('Add')
    setCardNumber('')
    setName('')
    setCvc('')
    setExpiry('')
    setOpenEditCard(false)
  }

  // Handle Upgrade Plan dialog
  const handleUpgradePlansClickOpen = () => setOpenUpgradePlans(true)
  const handleUpgradePlansClose = () => setOpenUpgradePlans(false)
  const handleBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Followup Details'
            action={
              <Button variant='contained' onClick={() => setOpenAddressCard(true)}>
                Edit Address
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} lg={6}>
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
                            Company Name:
                          </Typography>
                        </TableCell>
                        <TableCell>ThemeSelection</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Billing Email:
                          </Typography>
                        </TableCell>
                        <TableCell>gertrude@gmail.com</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Tax ID:
                          </Typography>
                        </TableCell>
                        <TableCell>TAX-875623</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            VAT Number:
                          </Typography>
                        </TableCell>
                        <TableCell>SDF754K77</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Billing Address:
                          </Typography>
                        </TableCell>
                        <TableCell>100 Water Plant Avenue, Building 1303 Wake Island</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TableContainer>
                  <Table size='small'>
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
                            Contact:
                          </Typography>
                        </TableCell>
                        <TableCell>+1(609) 933-44-22</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                            Country:
                          </Typography>
                        </TableCell>
                        <TableCell>Australia</TableCell>
                      </TableRow>
                      <TableRow>
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
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>

          <Dialog
            open={openAddressCard}
            onClose={() => setOpenAddressCard(false)}
            aria-labelledby='user-address-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            aria-describedby='user-address-edit-description'
          >
            <DialogTitle
              id='user-address-edit'
              sx={{
                textAlign: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              Edit Address
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <DialogContentText variant='body2' id='user-address-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                Edit Address for future billing
              </DialogContentText>
              <form>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='ThemeSelection' label='Company Name' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type='email' defaultValue='gertrude@gmail.com' label='Email' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='TAX-875623' label='Tax ID' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='SDF754K77' label='VAT Number' />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      label='Billing Address'
                      defaultValue='100 Water Plant Avenue, Building 1303 Wake Island'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='+1(609) 933-44-22' label='Contact' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id='country-select'>Country</InputLabel>
                      <Select labelId='country-select' defaultValue='usa' label='Country'>
                        <MenuItem value='usa'>USA</MenuItem>
                        <MenuItem value='uk'>UK</MenuItem>
                        <MenuItem value='france'>France</MenuItem>
                        <MenuItem value='germany'>Germany</MenuItem>
                        <MenuItem value='japan'>Japan</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth defaultValue='Capholim' label='State' />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type='number' defaultValue='403114' label='Zip Code' />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={() => setOpenAddressCard(false)}>
                Submit
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => setOpenAddressCard(false)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='User Activity Timeline' />
          <CardContent>
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color='error' />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      User login
                    </Typography>
                    <Typography variant='caption'>12 min ago</Typography>
                  </Box>
                  <Typography variant='body2'>User login at 2:12pm</Typography>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color='primary' />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      Meeting with John
                    </Typography>
                    <Typography variant='caption'>45 min ago</Typography>
                  </Box>
                  <Typography variant='body2' sx={{ mb: 2 }}>
                    React Project meeting with John @10:15am
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt='Avatar' src='/images/avatars/2.png' sx={{ width: 40, height: 40, mr: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Leona Watkins (Client)
                      </Typography>
                      <Typography variant='body2'>CEO of Watkins Group</Typography>
                    </Box>
                  </Box>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color='info' />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      Create a new react project for client
                    </Typography>
                    <Typography variant='caption'>2 day ago</Typography>
                  </Box>
                  <Typography variant='body2'>Add files to new design folder</Typography>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color='success' />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      Create invoices for client
                    </Typography>
                    <Typography variant='caption'>12 min ago</Typography>
                  </Box>
                  <Typography variant='body2'>Create new invoices and send to Leona Watkins</Typography>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 28, height: 'auto' }}>
                      <img width={28} height={28} alt='invoice.pdf' src='/images/icons/file-icons/pdf.png' />
                    </Box>
                    <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
                      invoice.pdf
                    </Typography>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InquiryFollowupDetails
