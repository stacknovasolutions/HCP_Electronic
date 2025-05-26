// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import { useContext } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const TableHeader = props => {
  const { urlParams, setUrlParams, fetchData, currentPage } = props

  const router = useRouter()
  const ability = useContext(AbilityContext)

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          value={urlParams.userName}
          onChange={e => {
            setUrlParams({ ...urlParams, userName: e.target.value })
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(currentPage, { ...urlParams })
            }
          }}
          placeholder='Search UserName'
        />
        <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          value={urlParams.technicianName}
          onChange={e => {
            setUrlParams({ ...urlParams, technicianName: e.target.value })
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(currentPage, { ...urlParams })
            }
          }}
          placeholder='Search Technician'
        />
        <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          value={urlParams.assignedtoUserName}
          onChange={e => {
            setUrlParams({ ...urlParams, assignedtoUserName: e.target.value })
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(currentPage, { ...urlParams })
            }
          }}
          placeholder='Search Assign User'
        />

        {ability?.can('Create', 'Complain') ? (
          <Button sx={{ mb: 2 }} onClick={() => router.push('/apps/complain/addcomplain')} variant='contained'>
            Add Complain
          </Button>) : null}
      </Box>
    </Box>
  )
}

export default TableHeader
