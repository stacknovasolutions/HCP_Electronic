// ** MUI Imports
import { Autocomplete } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useContext } from 'react'

// ** Data
import { top100Films } from 'src/@fake-db/autocomplete'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const TableHeader = props => {
  // ** Props
  const { toggle, setUrlParams, urlParams, currentPage, fetchData, setDefaultData } = props
  const ability = useContext(AbilityContext)

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* <Button
        sx={{ mr: 4, mb: 2 }}
        color='secondary'
        variant='outlined'
        startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
      >
        Export
      </Button> */}
      <div></div>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          value={urlParams.email}
          onChange={e => {
            setUrlParams({ ...urlParams, email: e.target.value })
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(currentPage, { ...urlParams })
            }
          }}
          placeholder='Search Email'
        />
        <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          value={urlParams.mobile}
          onChange={e => {
            setUrlParams({ ...urlParams, mobile: e.target.value })
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(currentPage, { ...urlParams })
            }
          }}
          placeholder='Search Mobile'
        />
        <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          value={urlParams.fullname}
          onChange={e => {
            setUrlParams({ ...urlParams, fullname: e.target.value })
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(currentPage, { ...urlParams })
            }
          }}
          placeholder='Search Fullname'
        />
        {ability?.can('Create', 'User') ? (
          <Button onClick={() => {
            setDefaultData([])
            toggle()
          }} variant='contained'>
            Add User
          </Button>) : null}
      </Box>
    </Box>
  )
}

export default TableHeader
