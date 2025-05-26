// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import { forwardRef, useContext } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import DatePicker from 'react-datepicker'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField size='small' inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const TableHeader = props => {
  // ** Props
  const router = useRouter()
  const { setUrlParams, urlParams, currentPage, fetchData } = props
  const ability = useContext(AbilityContext)

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <DatePickerWrapper sx={{ mr: 4, mb: 2 }}>
          <DatePicker
            selected={urlParams?.quotationDate}
            showYearDropdown
            showMonthDropdown
            onChange={date => {
              setUrlParams({ ...urlParams, quotationDate: date })
              fetchData(currentPage, { ...urlParams, quotationDate: date })
            }}
            placeholderText='MM/DD/YYYY'
            customInput={
              <CustomInput
                value={urlParams?.quotationDate}
                label='Quotation Date'
              />
            }
          />
        </DatePickerWrapper>
        <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          value={urlParams.inquiryId}
          onChange={e => {
            setUrlParams({ ...urlParams, inquiryId: e.target.value })
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(currentPage, { ...urlParams })
            }
          }}
          placeholder='Search Inquiry ID'
        />
        {ability?.can('Create', 'Quotation') ? (
          <Button sx={{ mb: 2 }} onClick={() => router.push('/apps/quotation/addquotation')} variant='contained'>
            Add Quotation
          </Button>) : null}
      </Box>
    </Box>
  )
}

export default TableHeader
