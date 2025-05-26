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
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useContext } from 'react'

const TableHeader = props => {
  // ** Props
  const { plan, handlePlanChange, handleFilter, value, show, setShow, setDefaultData} = props
  const ability = useContext(AbilityContext)

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }}>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* <TextField
          size='small'
          value={value}
          placeholder='Search Pages'
          sx={{ mr: 4, mb: 2 }}
          onChange={e => handleFilter(e.target.value)}
        /> */}
        {ability?.can('Create', 'Pages') ? (
          <Button sx={{ mb: 2 }} onClick={() => {
            setDefaultData({})
            setShow(!show)
          }} variant='contained'>
            Add Pages
          </Button>) : null}
      </Box>
    </Box>
  )
}

export default TableHeader
