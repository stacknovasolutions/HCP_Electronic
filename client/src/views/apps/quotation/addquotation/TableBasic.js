// ** MUI Imports
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** Data Import
import { rows } from 'src/@fake-db/table/static-data'

const columns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: 'ID'
  },
  {
    flex: 0.25,
    minWidth: 200,
    field: 'Terms & Condition Details',
    headerName: 'Terms & Condition Details'
  },
  {
    flex: 0.15,
    type: 'date',
    minWidth: 130,
    headerName: 'Date',
    field: 'start_date',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 0.125,
    minWidth: 140,
    field: 'actions',
    headerName: 'Actions',
    renderCell: params => {
      return (
        <Button size='small' variant='outlined' color='secondary' >
          Delete
        </Button>
      )
    }
  },

]

const TableBasic = () => {
  return (
    <Card>
      <CardHeader title='Terms & Conditions' />
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={rows.slice(0, 10)} />
      </Box>
    </Card>
  )
}

export default TableBasic
