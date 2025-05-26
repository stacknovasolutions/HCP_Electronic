// ** React Imports
import { useState, useEffect, useCallback, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
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
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** MUI Imports
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'
import AddUser from 'src/views/apps/user/list/AddUser'
import { usePagination } from 'src/hooks/usePagination'
import { TablePagination } from '@mui/material'
import ViewUser from 'src/views/apps/user/list/ViewUser'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { asyncWrap } from 'src/store/util'
import PageHeader from 'src/@core/components/page-header'
import DeleteUser from 'src/views/apps/user/DeleteUser'

// ** Vars
const userRoleObj = {
  admin: { icon: 'mdi:laptop', color: 'error.main' },
  author: { icon: 'mdi:cog-outline', color: 'warning.main' },
  editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
  maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
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

const RowOptions = ({ id, setShow }) => {
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
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={() => setShow(true)} sx={{ '& svg': { mr: 2 } }}>
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


const UserList = ({ apiData }) => {

  const { data: rows, total, loading, currentPage, gotoPage, setPerPage, perPage, fetchData } = usePagination('/user');

  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [urlParams, setUrlParams] = useState({
    roleId: '',
    email: '',
    mobile: '',
    fullname: ''
  })

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const [show, setShow] = useState(false)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [defaultData, setDefaultData] = useState()
  const [addressType, setAddressType] = useState('home')
  const [roleData, setRoleData] = useState([])
  const [showDeleteUser, setShowDeleteUser] = useState(false)

  const ability = useContext(AbilityContext)

  const getRolesData = async () => {
    const [error, result] = await asyncWrap(axios.get("/user/roles"))

    if (error) {
      toast.error(error)
    } else {
      setRoleData(result?.data?.data)
    }
  }

  useEffect(() => {
    getRolesData()
  }, [])

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'Email',
      headerName: 'Email',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.Email}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'FirstName',
      headerName: 'First Name',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.FirstName}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'LastName',
      headerName: 'Last Name',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.LastName}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Mobile Number',
      field: 'MobileNumber',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ textTransform: 'capitalize' }}>
            {row.MobileNumber}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'RoleName',
      minWidth: 150,
      headerName: 'Role',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
            {/* <Icon icon={userRoleObj[row.role].icon} fontSize={20} /> */}
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.RoleName}
            </Typography>
          </Box>
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
            setShowUserDetails(!showUserDetails)
          }}>
            <Icon icon='mdi:eye-outline' />
          </IconButton>
          {ability?.can('Create', 'User') ? (
            <IconButton onClick={() => {
              setDefaultData(row)
              setShow(!show)
            }}>
              <Icon icon='mdi:edit-outline' />
            </IconButton>) : null}
          {ability?.can('Delete', 'User') ? (
            <IconButton onClick={() => {
              setDefaultData(row)
              setShowDeleteUser(!showDeleteUser)
            }}>
              <Icon icon='mdi:delete-outline' />
            </IconButton>) : null}
        </Box>
      )
    }
  ]

  const bgColors = useBgColor()
  useEffect(() => {
    fetchData()
  }, [show, showDeleteUser])

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
  const toggleAddUserDrawer = () => setShow(!show)
  const [date, setDate] = useState(null)

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>User Details</Typography>}
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
                  <InputLabel id='country-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={urlParams.roleId}
                    onChange={(e) => {
                      setUrlParams({ ...urlParams, roleId: e.target.value })
                      fetchData(currentPage, { ...urlParams, roleId: e.target.value })
                    }}
                    placeholder=''
                    label='Select Role'
                    labelId='country-select'
                    defaultValue='Select Role'
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    {roleData?.map((item, index) => (
                      <MenuItem key={index} value={item.RoleID}>{item.RoleName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <TableHeader setDefaultData={setDefaultData} urlParams={urlParams} setUrlParams={setUrlParams} currentPage={currentPage} fetchData={fetchData} toggle={toggleAddUserDrawer} />
          <DataGrid
            getRowId={row => row.UserID}
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
            } />
        </Card>
      </Grid>

      <DeleteUser defaultData={defaultData} open={showDeleteUser} setOpen={setShowDeleteUser} />
      <ViewUser setDefaultData={setDefaultData} show={showUserDetails} setShow={setShowUserDetails} defaultData={defaultData} />
      <AddUser setDefaultData={setDefaultData} show={show} setShow={setShow} defaultData={defaultData} />
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

UserList.acl = {
  action: 'Read',
  subject: 'User'
}

export default UserList
