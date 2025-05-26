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
import { Button, Divider } from '@mui/material'


const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
}))

const ViewProduct = props => {
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
                <Typography variant='h6'>Product Details</Typography>
                <IconButton size='small' onClick={() => setShow(!show)} sx={{ color: 'text.primary' }}>
                    <Icon icon='mdi:close' fontSize={20} />
                </IconButton>
            </Header>

            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title={`${defaultData?.ProductName} Details`}

                    // action={
                    //     <Button variant='contained'>
                    //         Edit Product
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
                                                        Product Name:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.ProductName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Product Code:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.ProductCode}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Product Type:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.ProductType}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Description:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.Description}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        ProductDescription:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.ProductDescription}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        GSTPolicyID:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.GSTPolicyID}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Is Gst Inclusive:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.IsGstInclusive ? "YES" : "NO"}</TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        Category ID:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{defaultData?.CategoryID}</TableCell>
                                            </TableRow>
                                            {JSON.parse(defaultData?.ProductProperty || '[]')?.length !== 0 ? (
                                                <>
                                                    {/* <Divider /> */}
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                                Property
                                                            </Typography>
                                                        </TableCell>
                                                        {/* <TableCell>{item?.Value}</TableCell> */}
                                                    </TableRow></>) : null}
                                            {JSON.parse(defaultData?.ProductProperty || '[]')?.map((item, index) => (<TableRow key={index}>
                                                <TableCell>
                                                    <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                        {item?.PropertyName}:
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{item?.Value}</TableCell>
                                            </TableRow>))}

                                            {JSON.parse(defaultData?.ProductImages || '[]')?.length !== 0 ? (
                                                <>
                                                    {/* <Divider /> */}
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                                                                Product Images
                                                            </Typography>
                                                        </TableCell>
                                                        {/* <TableCell>{item?.Value}</TableCell> */}
                                                    </TableRow></>) : null}

                                            {JSON.parse(defaultData?.ProductImages || '[]')?.map((item, index) => (<div key={index}>
                                                <Box sx={{
                                                    display:"flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent:"center",
                                                    borderRadius: 1,
                                                    marginTop:"10px",
                                                    border: theme => `4px solid ${theme.palette.divider}`,
                                                    ...(item?.IsDefault
                                                        ? { borderColor: `primary.main` }
                                                        : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } })
                                                }}>
                                                    <img style={{ width: "100px", marginTop: "10px" }} src={item?.ImagePath} />
                                                </Box>
                                            </div>))}

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

export default ViewProduct
