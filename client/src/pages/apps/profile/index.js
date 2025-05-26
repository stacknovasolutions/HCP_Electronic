// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import axios from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const Profile = () => {
  const designationIcon = 'mdi:briefcase-outline'
  
  return (
    <>
      <Card>
        <CardMedia
          component='img'
          alt='profile-header'
          image="https://demos.themeselection.com/sneat-mui-react-nextjs-admin-template/demo-1/images/pages/profile-banner.png"
          sx={{
            height: { xs: 150, md: 250 }
          }}
        />
        <CardContent
          sx={{
            pt: 0,
            mt: -8,
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}
        >
          <ProfilePicture src="https://demos.themeselection.com/sneat-mui-react-nextjs-admin-template/demo-1/images/avatars/1.png" alt='profile-picture' />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              ml: { xs: 0, md: 6 },
              alignItems: 'flex-end',
              flexWrap: ['wrap', 'nowrap'],
              justifyContent: ['center', 'space-between']
            }}
          >
            <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
              <Typography variant='h5' sx={{ mb: 4 }}>
              {JSON.parse(localStorage.getItem("userData"))?.FirstName + " " + JSON.parse(localStorage.getItem("userData"))?.LastName}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: ['center', 'flex-start']
                }}
              >
                <Box sx={{ mr: 5, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                  <Icon icon={designationIcon} />
                  <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{JSON.parse(localStorage.getItem("userData"))?.RoleName}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Grid sx={{marginTop:"10px"}} container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 6 }}>
                <Typography variant='caption' sx={{ mb: 5, display: 'block', textTransform: 'uppercase' }}>
                  About
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     Full Name:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.FirstName + " " + JSON.parse(localStorage.getItem("userData"))?.LastName}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     Role Name:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.RoleName}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     Gender:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.Gender === "M" ? "Male" : "Female"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     Company Name:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.CompanyID === "0" ? "SUPER ADMIN" :  JSON.parse(localStorage.getItem("userData"))?.CompanyName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography variant='caption' sx={{ mb: 5, display: 'block', textTransform: 'uppercase' }}>
                  Contacts
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     Contacts:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.MobileNumber}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     Email:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.Email}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 6 }}>
                <Typography variant='caption' sx={{ mb: 5, display: 'block', textTransform: 'uppercase' }}>
                  Address
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     Address:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.Address}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     City:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.City}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     State:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.StateName}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     PinCode:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.Pincode}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     Latitude:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.Lattitude}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    '&:not(:last-of-type)': { mb: 4 },
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  {/* <Box sx={{ display: 'flex', mr: 2 }}>
                    <Icon icon="mdi:email-outline" />
                  </Box> */}

                  <Box sx={{ columnGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                     Longitude:
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                     {JSON.parse(localStorage.getItem("userData"))?.Longiitude}
                    </Typography>
                  </Box>
                </Box>
                
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Profile
