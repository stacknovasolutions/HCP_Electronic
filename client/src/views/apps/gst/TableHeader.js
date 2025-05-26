// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const TableHeader = props => {
  // ** Props
  const { plan, handlePlanChange, handleFilter, value, setShow, setDefaultData } = props
  const ability = useContext(AbilityContext)

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search GST'
          onChange={e => handleFilter(e.target.value)}
        /> */}

        {ability?.can('Create', 'GST') ? (
          <Button sx={{ mb: 2 }} onClick={() => {
            setDefaultData([])
            setShow(true)
          }} variant='contained'>
            Add GST
          </Button>) : null}
      </Box>
    </Box>
  )
}

export default TableHeader
