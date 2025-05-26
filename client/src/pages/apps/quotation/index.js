// ** React Imports
import { useState, useEffect, useCallback, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/quotation/TableHeader'
import TableCollapsible from 'src/views/apps/quotation/TableCollapsible'

// import { usePagination } from '@mui/lab'
import { TablePagination } from '@mui/material'
import { usePagination } from 'src/hooks/usePagination'
import PageHeader from 'src/@core/components/page-header'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useRouter } from 'next/router'
import DeleteQuotation from 'src/views/apps/quotation/DeleteQuotation'
import AddFollowupDetails from 'src/views/apps/quotation/AddFollowupDetails'
import moment from 'moment'

const Quotation = ({ apiData }) => {
  // ** State
  const { data: rows, total, loading, currentPage, gotoPage, setPerPage, perPage, fetchData } = usePagination('/quotation');
  const ability = useContext(AbilityContext)
  const router = useRouter()
  const [defaultData, setDefaultData] = useState()
  const [deleteQuotation, setDeleteQuotation] = useState(false)
  const [showOpenFollowup, setShowOpenFollowup] = useState(false)

  const [urlParams, setUrlParams] = useState({
    quotationType: '',
    inquiryId: '',
    quotationDate: ''
  })

  useEffect(() => {
    fetchData()
  },  [deleteQuotation])

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'ShortDescription',
      headerName: 'Short Description',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.ShortDescription}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'InquiryID',
      headerName: 'Inquiry ID',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.InquiryID}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'QuatationType',
      headerName: 'Quatation Type',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.QuatationType}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'QuatationDate',
      minWidth: 150,
      headerName: 'QuatationDate',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {moment(row.QuatationDate).format("DD-MM-YYYY")}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'TotalAmount',
      field: 'TotalAmount',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ textTransform: 'capitalize' }}>
            {row.TotalAmount}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 150,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => {
            setDefaultData(row)
            setShowOpenFollowup(!showOpenFollowup)
          }}>
            <Icon icon='mdi:eye-outline' />
          </IconButton>
          {ability?.can('Create', 'Quotation') ? (
            <IconButton onClick={() => {
              router.push({ pathname: "/apps/quotation/addquotation/", query: { row: row.QuatationID } })
            }}>
              <Icon icon='mdi:edit-outline' />
            </IconButton>) : null}
          {ability?.can('Delete', 'Quotation') ? (
            <IconButton onClick={() => {
              setDefaultData(row)
              setDeleteQuotation(!deleteQuotation)
            }}>
              <Icon icon='mdi:delete-outline' />
            </IconButton>) : null}
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Quotation Details</Typography>}
      />
      {/* <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon} />} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='role-select'>Select Quotation Type</InputLabel>
                  <Select
                    fullWidth
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    value={urlParams.quotationType}
                    onChange={(e) => {
                      setUrlParams({ ...urlParams, quotationType: e.target.value })
                      fetchData(currentPage, { ...urlParams, quotationType: e.target.value })
                    }}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Quotation Type</MenuItem>
                    <MenuItem value='tender'>Tender</MenuItem>
                    <MenuItem value='product'>Product</MenuItem>
                    <MenuItem value='labour'>Labour</MenuItem>
                    {/* <MenuItem value='maintainer'>Maintainer</MenuItem> */}
                    {/* <MenuItem value='subscriber'>Subscriber</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <TableHeader urlParams={urlParams} setUrlParams={setUrlParams} fetchData={fetchData} currentPage={currentPage} />
          <DataGrid
            getRowId={row => row.QuatationID}
            hideFooterPagination={true}
            autoHeight
            rows={rows}
            loading={loading}
            columns={columns}
          />
          <TablePagination
            page={currentPage - 1} // Adjust the page number to start from 1
            component='div'
            count={total}
            rowsPerPage={perPage}
            onPageChange={(event, newPage) => {
              console.log(newPage + 1); // Log the correct page number
              gotoPage(newPage + 1); // Increment newPage by 1
            }}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={(event) => {
              gotoPage(1)
              setPerPage(event.target.value)
            }
            }
          />
        </Card>
      </Grid>
      <DeleteQuotation defaultData={defaultData} open={deleteQuotation} setOpen={setDeleteQuotation} />
      <AddFollowupDetails defaultData={defaultData} open={showOpenFollowup} toggle={setShowOpenFollowup} />
      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

Quotation.acl = {
  action: 'Read',
  subject: 'Quotation'
}

export default Quotation
