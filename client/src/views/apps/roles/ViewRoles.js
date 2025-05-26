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


const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
}))

const ViewRoles = props => {
    // ** Props
    const { show, setShow, defaultData } = props
    console.log(defaultData)
    
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
                <Typography variant='h6'>Roles Details</Typography>
                <IconButton size='small' onClick={() => setShow(!show)} sx={{ color: 'text.primary' }}>
                    <Icon icon='mdi:close' fontSize={20} />
                </IconButton>
            </Header>

            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title={`${defaultData?.RoleName} Details`}

                        // action={
                        //     <Button variant='contained'>
                        //         Edit Roles
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
                                                        Role Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.RoleName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Role Code:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.RoleCode}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Basic description:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Basicdescription}</TableCell>
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

export default ViewRoles
