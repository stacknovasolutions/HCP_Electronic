// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Dashboard = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Dashboard 🙌'></CardHeader>
                    <CardContent>
                        <Typography sx={{ mb: 2 }}>This is your Dashboard.</Typography>
                        {/* <Typography> */}
                        {/* Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin. */}
                        {/* Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie */}
                        {/* wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate. */}
                        {/* </Typography> */}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

Dashboard.acl = {
    action: 'Read',
    subject: 'dashboard'
}

export default Dashboard
