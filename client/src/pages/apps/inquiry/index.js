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
import TableHeader from 'src/views/apps/inquiry/TableHeader'
import PageHeader from 'src/@core/components/page-header'
import AddFollowupDetails from 'src/views/apps/inquiry/AddFollowupDetails'
import { usePagination } from 'src/hooks/usePagination'
import { TablePagination } from '@mui/material'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useRouter } from 'next/router'
import DeleteInquiry from 'src/views/apps/inquiry/DeleteInquiry'
import moment from 'moment'

// ** Vars
const userRoleObj = {
  admin: { icon: 'mdi:laptop', color: 'error.main' },
  author: { icon: 'mdi:cog-outline', color: 'warning.main' },
  editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
  maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column
const renderClient = row => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}



const Inquiry = ({ apiData }) => {
  const { data: rows, total, loading, currentPage, gotoPage, setPerPage, perPage, fetchData } = usePagination('/inquiry');

  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [showOpenFollowup, setShowOpenFollowup] = useState(false)
  const [inquiryDetailsData, setInquiryDetailsData] = useState()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [deleteInquiry, setDeleteInquiry] = useState(false)
  const ability = useContext(AbilityContext)
  const router = useRouter()
  
  const [urlParams, setUrlParams] = useState({
    userName: '',
  })

  useEffect(() => {
    fetchData()
  }, [deleteInquiry])

  const RowOptions = ({ id }) => {

    // ** Hooks
    const dispatch = useDispatch()

    // ** State
    const [anchorEl, setAnchorEl] = useState(null)

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleDelete = () => {
      dispatch(deleteUser(id))
      handleRowOptionsClose()
    }

    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <Icon icon='mdi:dots-vertical' />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          <MenuItem
            component={Link}
            sx={{ '& svg': { mr: 2 } }}
            onClick={handleRowOptionsClose}
            href='/apps/inquiry/view/user_detail/'
          >
            <Icon icon='mdi:eye-outline' fontSize={20} />
            View
          </MenuItem>
          <MenuItem
            sx={{ '& svg': { mr: 2 } }}
            onClick={() => { setShowOpenFollowup(true) }}
          >
            <Icon icon='mdi:eye-outline' fontSize={20} />
            Followup
          </MenuItem>
          <MenuItem component={Link}
            sx={{ '& svg': { mr: 2 } }}
            onClick={handleRowOptionsClose}
            href='/apps/inquiry/editinquiry/'>
            <Icon icon='mdi:pencil-outline' fontSize={20} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:delete-outline' fontSize={20} />
            Delete
          </MenuItem>
        </Menu>
      </>
    )
  }

  const columns = [
    {
      flex: 0.15,
      minWidth: 250,
      field: 'InquriyID',
      headerName: 'Inquiry ID',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.InquriyID}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'FirstName',
      headerName: 'User',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.FirstName + " " + row.LastName}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'AssignToFirstName',
      headerName: 'Assign User',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.AssignToFirstName + " " + row.AssignToLastName}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'ShortDescription',
      minWidth: 150,
      headerName: 'Short Description',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
            {/* <Icon icon={userRoleObj[row.role].icon} fontSize={20} /> */}
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.ShortDescription}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'InquiryDate',
      field: 'Inquiry Date',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ textTransform: 'capitalize' }}>
            {row?.inquiryDate && moment(row?.InquiryDate).format("DD-MM-YYYY")}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'StatusDate',
      field: 'StatusDate',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ textTransform: 'capitalize' }}>
            {moment(row?.StatusDate).format("DD-MM-YYYY")}
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
            setInquiryDetailsData(row)
            setShowOpenFollowup(!showOpenFollowup)
          }}>
            <Icon icon='mdi:eye-outline' />
          </IconButton>
          {ability?.can('Create', 'Inquiry') ? (
            <IconButton onClick={() => {
              router.push({ pathname: "/apps/inquiry/addinquiry/", query: { row: row.InquriyID } })
            }}>
              <Icon icon='mdi:edit-outline' />
            </IconButton>) : null}
          {ability?.can('Delete', 'Inquiry') ? (
            <IconButton onClick={() => {
              setInquiryDetailsData(row)
              setDeleteInquiry(!deleteInquiry)
            }}>
              <Icon icon='mdi:delete-outline' />
            </IconButton>) : null}
        </Box>
      )
    }
  ]

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Inquiry Details</Typography>}
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
          <TableHeader urlParams={urlParams} setUrlParams={setUrlParams} fetchData={fetchData} currentPage={currentPage} />
          <DataGrid
            getRowId={row => row.InquriyID}
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
      <DeleteInquiry defaultData={inquiryDetailsData} open={deleteInquiry} setOpen={setDeleteInquiry} />
      <AddFollowupDetails inquiryData={inquiryDetailsData} open={showOpenFollowup} toggle={setShowOpenFollowup} />
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

Inquiry.acl = {
  action: 'Read',
  subject: 'Inquiry'
}

export default Inquiry
