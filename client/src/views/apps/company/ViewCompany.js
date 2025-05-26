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

const ViewCompany = props => {
    // ** Props
    const { show, setShow, defaultData } = props

    return (
        <Drawer
            open={show}
            anchor='right'
            variant='temporary'
            onClose={() => setShow(!show)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
        >
            <Header>
                <Typography variant='h6'>Company Details</Typography>
                <IconButton size='small' onClick={() => setShow(!show)} sx={{ color: 'text.primary' }}>
                    <Icon icon='mdi:close' fontSize={20} />
                </IconButton>
            </Header>

            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title={`${defaultData?.CompanyName} Details`}

                    // action={
                    //     <Button variant='contained'>
                    //         Edit Company
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
                                                        Company Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.CompanyName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Registration Number:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.RegistrationNumber}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Short Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.ShortName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Industry Type:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.IndustryType}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Date of Establishment:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{moment(defaultData?.DateofEstablishment).format("DD-MM-YYYY")}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Founder CEO:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Founder_CEO}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Contact:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.ContactInformation}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Number Of Employee:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.NumberOfEmployee}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Partnerships:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Partnerships}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Company UserLimit:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.CompanyUserLimit}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Address:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Address}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        City:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.City}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        StateID:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.StateID}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Pincode:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Pincode}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Lattitude:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Lattitude}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Longiitude:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Longiitude}</TableCell>
                                            </TableRow>
                                            {
                                                defaultData?.LOGOURL && (<Grid item xs={12}>
                                                     <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Company Logo:
                                                    </Typography>
                                                    <img style={{ width: "200px", marginTop: "10px" }} src={defaultData?.LOGOURL} /></Grid>
                                                )
                                            }
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

export default ViewCompany
