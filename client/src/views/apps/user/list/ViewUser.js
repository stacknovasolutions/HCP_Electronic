// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button } from '@mui/material'
import moment from 'moment'


const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
}))

const ViewUser = props => {
    // ** Props
    const { show, setShow, defaultData, setDefaultData } = props

    return (
        <Drawer
            open={show}
            anchor='right'
            variant='temporary'
            onClose={() => {
                setDefaultData([])
                setShow(!show)
            }}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
        >
            <Header>
                <Typography variant='h6'>User Details</Typography>
                <IconButton size='small' onClick={() => {
                    setDefaultData([])
                    setShow(!show)
                }} sx={{ color: 'text.primary' }}>
                    <Icon icon='mdi:close' fontSize={20} />
                </IconButton>
            </Header>

            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title={`${defaultData?.FirstName + " " + defaultData?.LastName} Details`}
                        
                        // action={
                        //     <Button variant='contained'>
                        //         Edit User
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
                                                        width: 170
                                                    }
                                                }
                                            }}
                                        >
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        First Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.FirstName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Last Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.LastName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Role Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.RoleName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    User Type:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.RoleName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Birth Date:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{moment(defaultData?.Birthdate).format("DD-MM-YYYY")}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Company Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.CompanyName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Email:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Email}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    MobileNumber:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.MobileNumber}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    RefferalCode:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.RefferalCode}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Gender:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Gender}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Address:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{ defaultData?.Address}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    City:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{ defaultData?.City}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    State Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{ defaultData?.StateName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Pincode:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{ defaultData?.PinCode}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Lattitude:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{ defaultData?.Lattitude}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                    Longiitude:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{ defaultData?.Longiitude}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>


                        </Grid>
                    </CardContent>


                </Card>
            </Grid>
        </Drawer>
    )
}

export default ViewUser
