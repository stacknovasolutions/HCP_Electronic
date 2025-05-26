// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { asyncWrap } from 'src/store/util'
import toast from 'react-hot-toast'
import axios from 'axios'

const DeleteInquiry = props => {
  // ** Props
  const { open, setOpen, defaultData } = props

  // ** States
  const [userInput, setUserInput] = useState('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = value => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }
    
  const deleteDataById = async (id) => {
    try {
        // Make a DELETE request to the server with the specified ID
        const [error, result] = await asyncWrap(axios.delete(`/inquiry/${id}`));

        // Check if the request was successful
        if (result.data.statusCode === 200) {
            // Data successfully deleted
            toast.success("Data deleted successfully");
            setOpen(false)
            
            // Optionally, perform any additional actions after deletion
            // For example, update the UI or reload data
        } else {
            // Handle other status codes if needed
            toast.error("Failed to delete data");
            setOpen(false)
        }
    } catch (error) {
        // Handle any errors that occur during the request
        console.error("Error deleting data:", error);
        toast.error("An error occurred while deleting data");
    }
}


  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 8, color: 'warning.main' }
            }}
          >
            <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
              Are you sure?
            </Typography>
            <Typography>You won't be able to revert Inquiry!</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => deleteDataById(defaultData?.InquriyID)}>
            Yes, Delete Inquiry!
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteInquiry
