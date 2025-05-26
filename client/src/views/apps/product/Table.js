// ** React Imports
import { useEffect, useCallback, useState, useContext } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData } from 'src/store/apps/user'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/product/TableHeader'
import { usePagination } from 'src/hooks/usePagination'
import { TablePagination } from '@mui/material'
import { AbilityContext } from 'src/layouts/components/acl/Can'

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

// ** renders client column
const renderClient = row => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar skin='light' color={row.avatarColor} sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}>
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}



const UserList = ({ show, setShow, setShowProductDetails, showProductDetails, defaultData, setDefaultData, deleteProduct, setDeleteProduct }) => {
  const { data: rows, total, loading, currentPage, gotoPage, setPerPage, perPage, fetchData } = usePagination('/product');

  // ** State
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const ability = useContext(AbilityContext)

  const [urlParams, setUrlParams] = useState({
    productName: '',
    productCode: ''
  })

  useEffect(() => {
    fetchData()
  }, [show, deleteProduct])

  const columns = [
    {
      flex: 0.15,
      field: 'ProductName',
      minWidth: 150,
      headerName: 'Product Name',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
            {/* <Icon icon={userRoleObj[row.role].icon} fontSize={20} /> */}
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.ProductName}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'ProductCode',
      minWidth: 150,
      headerName: 'Product Code',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }} >
            {/* <Icon icon={userRoleObj[row.role].icon} fontSize={20} /> */}
            <Typography Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.ProductCode}
            </Typography>
          </Box >
        )
      }
    },
    {
      flex: 0.15,
      field: 'ProductType',
      minWidth: 150,
      headerName: 'Product Type',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3 } }}>
            {/* <Icon icon={userRoleObj[row.role].icon} fontSize={20} /> */}
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.ProductType}
            </Typography>

          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => {
            setDefaultData(row);
            setShowProductDetails(!showProductDetails)
          }}>
            <Icon icon='mdi:eye-outline' />
          </IconButton>
          {ability?.can('Create', 'Product') ? (
            <IconButton onClick={() => {
              setDefaultData(row);
              setShow(!show)
            }}>
              <Icon icon='mdi:edit-outline' />
            </IconButton>) : null}
          {ability?.can('Delete', 'Product') ? (
            <IconButton onClick={() => {
              setDefaultData(row);
              setDeleteProduct(!deleteProduct)
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

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader setDefaultData={setDefaultData} urlParams={urlParams} setUrlParams={setUrlParams} fetchData={fetchData} currentPage={currentPage} setShow={setShow} />
          <DataGrid
            getRowId={row => row.ProductID}
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
    </Grid>
  )
}

export default UserList
