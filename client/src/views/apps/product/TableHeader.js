// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'

const TableHeader = props => {
  // ** Props
  const { urlParams, setUrlParams, fetchData, currentPage, setShow, setDefaultData } = props
  const ability = useContext(AbilityContext)

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          value={urlParams.productName}
          onChange={e => {
            setUrlParams({ ...urlParams, productName: e.target.value })
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(currentPage, { ...urlParams })
            }
          }}
          placeholder='Search Product Name'
        />
        <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          value={urlParams.productCode}
          onChange={e => {
            setUrlParams({ ...urlParams, productCode: e.target.value })
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(currentPage, { ...urlParams })
            }
          }}
          placeholder='Search Product Code'
        />
        {ability?.can('Create', 'Product') ? (
          <Button sx={{ mb: 2 }} onClick={() => {
            setDefaultData()
            setShow(true)
          }} variant='contained'>
            Add Product
          </Button>) : null}

      </Box>
    </Box>
  )
}

export default TableHeader
