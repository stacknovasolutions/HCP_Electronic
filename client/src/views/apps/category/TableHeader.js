// ** MUI Imports
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { asyncWrap } from 'src/store/util'

const TableHeader = ({ setShow, setParentCategoryId, companyId, setCompanyId }) => {
  const [companyData, setCompanyData] = useState()
  const ability = useContext(AbilityContext)

  const getCompanyData = async () => {
    const [error, result] = await asyncWrap(axios.get("/company?pageNo=-1"))

    if (error) {
      toast.error(error)
    } else {
      setCompanyData(result?.data?.data)
      setCompanyId(result.data?.data[0]?.CompanyID)
    }
  }

  useEffect(() => {
    getCompanyData()
  }, [])

  useEffect(()=>{},[companyId])

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end', gap: "10px" }}>
      {/* <Typography variant='h5'>Categories Details</Typography> */}
      {JSON.parse(localStorage.getItem("userData"))?.CompanyID === "0" && companyData ? (<Grid item sm={4} >
        <FormControl fullWidth>
          <InputLabel size='small' id='country-select'>Select Company</InputLabel>
          <Select
            fullWidth
            value={companyId}
            onChange={(e) => {
              setCompanyId(e.target.value)
            }}
            placeholder=''
            size="small"
            label='Select Company'
            labelId='country-select'
            defaultValue={companyData[0]?.CompanyID}
          >
            <MenuItem value=''>Select Company</MenuItem>
            {companyData?.map((item, index) => (
              <MenuItem key={index} value={item.CompanyID}>{item.CompanyName}</MenuItem>
            ))}
          </Select>
        </FormControl></Grid>) : null}
      <Box sx={{ display: 'flex', flexDirection: "row", flexWrap: 'wrap', alignItems: 'center' }}>



        {ability?.can('Create', 'Category') ? (
          <Button onClick={() => {
            setParentCategoryId("root")
            setShow(true)
          }} variant='contained'>
            Add Category
          </Button>
        ) : null}
      </Box>
    </Box>
  )
}

export default TableHeader
