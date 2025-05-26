// ** MUI Imports
import Pagination from '@mui/material/Pagination'

const PaginationSimple = () => {
  return (
    <div className='demo-space-y' style={{ marginTop: "20px", marginBottom: "20px" }}>
      {/* <Pagination count={10} /> */}
      <Pagination style={{ display: "flex", justifyContent: "end" }} count={10} color='primary' />
      {/* <Pagination count={10} color='secondary' /> */}
    </div>
  )
}

export default PaginationSimple
