// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import RolesTable from 'src/views/apps/roles/RolesTable'
import RoleCards from 'src/views/apps/roles/RoleCards'
import { Box, Checkbox, Table, TableBody, DialogActions, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material'

import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import AddRoles from 'src/views/apps/roles/AddRoles'
import ViewRoles from 'src/views/apps/roles/ViewRoles'
import DeleteRoles from 'src/views/apps/roles/DeleteRoles'

const rolesArr = [
  'Quotation',
  'Add User',
  'Order',
  'Complain',
  'Inquiry'
]

const RolesComponent = () => {
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)
  const [defaultData, setDefaultData] = useState()
  const [showRolesDetails, setShowRolesDetails] = useState(false)
  const [deleteRoles, setDeleteRoles] = useState(false)
  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }

  const togglePermission = id => {
    const arr = selectedCheckbox
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push(id)
      setSelectedCheckbox([...arr])
    }
  }

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox) {
      setSelectedCheckbox([])
    } else {
      rolesArr.forEach(row => {
        const id = row.toLowerCase().split(' ').join('-')
        togglePermission(`${id}-read`)
        togglePermission(`${id}-write`)
        togglePermission(`${id}-create`)
      })
    }
  }
  useEffect(() => {
    if (selectedCheckbox.length > 0 && selectedCheckbox.length < rolesArr.length * 3) {
      setIsIndeterminateCheckbox(true)
    } else {
      setIsIndeterminateCheckbox(false)
    }
  }, [selectedCheckbox])

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Roles List</Typography>}
        subtitle={
          <Typography variant='body2'>
            A role provided access to predefined menus and features so that depending on assigned role an administrator
            can have access to what he need
          </Typography>
        }
      />
      {/* <Grid item xs={12} sx={{ mb: 4 }}>
        <RoleCards />
      </Grid> */}
      {/* <PageHeader
        title={<Typography variant='h5'>Total users with their roles</Typography>}
        subtitle={
          <Typography variant='body2'>
            Find all of your company’s administrator accounts and their associate roles.
          </Typography>
        }
      /> */}
      <Grid item xs={12}>
        <RolesTable deleteRoles={deleteRoles} setDeleteRoles={setDeleteRoles} setDefaultData={setDefaultData} show={open} setShow={setOpen} showRolesDetails={showRolesDetails} setShowRolesDetails={setShowRolesDetails} />
      </Grid>
      <DeleteRoles defaultData={defaultData} open={deleteRoles} setOpen={setDeleteRoles} />
      <ViewRoles defaultData={defaultData} show={showRolesDetails} setShow={setShowRolesDetails} />
      <AddRoles defaultData={defaultData} show={open} setShow={setOpen} />
    </Grid>
  )
}

RolesComponent.acl = {
  action: 'Read',
  subject: 'Role'
}

export default RolesComponent
