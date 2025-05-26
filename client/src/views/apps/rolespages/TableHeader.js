// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const TableHeader = props => {
  // ** Props
  const { plan, handlePlanChange, handleFilter, value, show, setShow } = props
  const ability = useContext(AbilityContext)

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }}>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* <TextField
          size='small'
          value={value}
          placeholder='Search Role pages'
          sx={{ mr: 4, mb: 2 }}
          onChange={e => handleFilter(e.target.value)}
        /> */}
        {ability?.can('Create', 'RoleWise') ? (
          <Button sx={{ mb: 2 }} onClick={() => setShow(!show)} variant='contained'>
            Add Role Pages
          </Button>) : null}
      </Box>
    </Box>
  )
}

export default TableHeader
