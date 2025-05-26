// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

// ** React Imports
import { useState } from 'react'

import TreeViewCustomized from 'src/views/apps/category/TreeViewCustomized'

import TableHeader from 'src/views/apps/category/TableHeader'
import AddProperty from 'src/views/apps/category/AddProperty'
import AddCategory from 'src/views/apps/category/AddCategory'

const Category = () => {
  // ** States
  const [showCategory, setShowCategory] = useState(false)
  const [showProperty, setShowProperty] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState('root')
  const [parentCategoryData, setParentCategoryData] = useState()
  const [companyId, setCompanyId] = useState()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card style={{ padding: "20px" }}>

          <TableHeader companyId={companyId} setCompanyId={setCompanyId} parentCategoryId={parentCategoryId} setParentCategoryId={setParentCategoryId} setShow={setShowCategory} />

          <TreeViewCustomized companyId={companyId} setCompanyId={setCompanyId} show={showCategory} setParentCategoryId={setParentCategoryId} setParentCategoryData={setParentCategoryData} parentCategoryId={parentCategoryId} parentCategoryData={parentCategoryData} setShow={setShowCategory} setShowProperty={setShowProperty} />

          <AddProperty parentCategoryId={parentCategoryId} parentCategoryData={parentCategoryData} show={showProperty} setShow={setShowProperty} />

          <AddCategory parentCategoryId={parentCategoryId} parentCategoryData={parentCategoryData} show={showCategory} setShow={setShowCategory} />
        </Card>
      </Grid >
    </Grid>
  )
}

Category.acl = {
  action: 'Read',
  subject: 'Category'
}

export default Category
