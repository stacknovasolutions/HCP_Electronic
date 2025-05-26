// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const TableHeader = props => {
  // ** Props
  const ability = useContext(AbilityContext)
  const { plan, handlePlanChange, handleFilter, value, setShow, setDefaultData } = props

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search User'
          onChange={e => handleFilter(e.target.value)}
        /> */}

        {ability?.can('Create', 'Company') ?
          (<Button sx={{ mb: 2 }} onClick={() => {
            setDefaultData([])
            setShow(true)
          }} variant='contained'>
            Add Company
          </Button>)
          : null}


      </Box>
    </Box>
  )
}

export default TableHeader
