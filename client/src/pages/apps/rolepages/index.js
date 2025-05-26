// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import PagesTable from 'src/views/apps/pages/PagesTable'
import RoleCards from 'src/views/apps/pages/RoleCards'
import { Box, Checkbox, Table, TableBody, DialogActions, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material'

import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import AddPages from 'src/views/apps/pages/AddPages'
import AddRolePages from 'src/views/apps/rolespages/AddRolePages'
import RolePagesTable from 'src/views/apps/rolespages/RolePagesTable'

const rolesArr = [
  'Quotation',
  'Add User',
  'Order',
  'Complain',
  'Inquiry'
]

const RolePages = () => {
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)
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
        title={<Typography variant='h5'>Role Pages List</Typography>}
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
        <RolePagesTable show={open} setShow={setOpen} />
      </Grid>
      <AddRolePages show={open} setShow={setOpen} />
    </Grid>
  )
}

RolePages.acl = {
  action: 'Read',
  subject: 'RoleWise'
}

export default RolePages
