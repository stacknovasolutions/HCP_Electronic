// ** MUI Imports
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import { alpha, styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import TreeItem from '@mui/lab/TreeItem'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'
import { useContext, useEffect, useState } from 'react'
import { asyncWrap } from 'src/store/util'
import axios from 'axios'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import toast from 'react-hot-toast'

// Styled TreeItem component
const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  '& .MuiTreeItem-iconContainer .close': {
    opacity: 0.3
  },
  '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
    backgroundColor: theme.palette.action.hover
  },
  '& .MuiTreeItem-content': {
    paddingRight: theme.spacing(3),
    borderTopRightRadius: theme.spacing(4),
    borderBottomRightRadius: theme.spacing(4),
    fontWeight: theme.typography.fontWeightMedium
  },
  '& .MuiTreeItem-label': {
    fontWeight: 'inherit',
    paddingRight: theme.spacing(3)
  },
  '& .MuiTreeItem-group': {
    marginLeft: 15,
    paddingLeft: 10,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    '& .MuiTreeItem-content': {
      // paddingLeft: theme.spacing(4),
      fontWeight: theme.typography.fontWeightRegular
    }
  }
}))

const StyledTreeItem = props => {
  // ** Props
  const { categoryData, setParentCategoryId, setParentCategoryData,
    parentCategoryId,
    parentCategoryData, labelText, labelIcon, labelInfo, setShow, setShowProperty, isProperty, ...other } = props
  const hasChildren = categoryData.children && categoryData.children.length > 0;
  const hasProperties = categoryData.properties && categoryData.properties.length > 0;
  console.log(isProperty)
  const ability = useContext(AbilityContext)
  console.log(props)
  
  return (
    <StyledTreeItemRoot
      defaultExpandIcon={isProperty ? <Icon icon='mdi:chevron-down' /> : null}
      defaultCollapseIcon={isProperty ? <Icon ic on='mdi:chevron-up' /> : null}
      defaultEndIcon={isProperty ? <Icon icon='mdi:file-outline' /> : null} // Assuming properties have a different icon
      {...other}
      label={
        <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
          <Icon icon={labelIcon} color='inherit' />
          <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 'inherit' }}>
            {labelText}
          </Typography>
          {/* {labelInfo ? ( */}
          {ability?.can('Create', 'Category') ? (
            <Box sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 }, gap: "10px" }}>
              {!isProperty && (
                <>
                  <div onClick={() => {
                    console.log(categoryData?.CategoryID)
                    setParentCategoryData(categoryData)
                    setParentCategoryId(categoryData?.CategoryID)
                    setShowProperty(true)
                  }} style={{ display: "flex", opacity: "0.8" }}> <Icon icon="mdi:plus-box-outline" color='inherit' />Add Property</div>
                  <div onClick={() => {
                    setParentCategoryData(categoryData)
                    setParentCategoryId(categoryData?.CategoryID)
                    setShow(true)
                  }} style={{ display: "flex", opacity: "0.8" }}> <Icon icon="mdi:plus-box-outline" color='inherit' /> Add Category</div>
                </>)}
            </Box>
          ) : null}
        </Box>
      }
    />
  )
}

const TreeViewCustomized = ({ setParentCategoryId, setParentCategoryData, parentCategoryId, parentCategoryData, direction, setShow, setShowProperty, show,companyId }) => {
  const ExpandIcon = <Icon icon={direction === 'rtl' ? 'mdi:chevron-left' : 'mdi:chevron-right'} />
  const [parentCategory, setParentCategory] = useState([])

  const getParentCategoryData = async () => {
    let url;
    if (JSON.parse(localStorage.getItem("userData"))?.CompanyID === "0") {
      url = `category/parent?companyId=${companyId}`
    } else {
      url = `category/parent`
    }
    const [error, result] = await asyncWrap(axios.get(url));

    if (error) {
      toast.error(error);
    } else {
      setParentCategory(result?.data?.data);
    }
  };

  useEffect(() => {
    console.log(companyId)
    if (JSON.parse(localStorage.getItem("userData"))?.CompanyID === "0") {
      if (companyId) {
        console.log("sadfasdf")
        getParentCategoryData()
      }
    } else {
      console.log("sadfasdfsadsad")
      getParentCategoryData()
    }
  },[show, companyId])

  const getCategoryDataByCategoryId = async (categoryId) => {
    const [catError, catResult] = await asyncWrap(axios.get(`/category/parentId?companyId=1&parentId=${categoryId}`));
    const [propError, propResult] = await asyncWrap(axios.get(`/property/category?companyId=1&categoryId=${categoryId}`));

    if (catError || propError) {
      toast.error(catError || propError);

      return [];
    } else {
      const subcategories = catResult?.data?.data || [];
      const properties = propResult?.data?.data || [];

      // Transform properties into a format similar to categories for consistent rendering
      const transformedProperties = properties.map(prop => ({
        CategoryID: `property-${prop.PropertyID}`, // Ensure unique IDs
        CategoryName: prop.Propertyname,
        isProperty: true, // Flag to identify property nodes
      }));

      // Merge subcategories and transformed properties
      return [...subcategories, ...transformedProperties];
    }
  };


  // const handleCategoryClick = async (categoryId) => {
  //   const subcategories = await getCategoryDataByCategoryId(categoryId);
  //   // Optionally, you can do something with the subcategories here
  //   return subcategories
  //   console.log("Subcategories:", subcategories);
  // };

  const handleCategoryClick = async (categoryId) => {
    try {
      const subcategories = await getCategoryDataByCategoryId(categoryId);
      setParentCategory(prevCategories => {
        const updateCategoryTree = (categories) => {
          return categories.map(category => {
            if (category.CategoryID === categoryId) {
              return { ...category, children: subcategories || [] }; // Assuming 'children' is used for nesting
            } else if (category.children) {
              return { ...category, children: updateCategoryTree(category.children) };
            }

            return category;
          });
        };

        return updateCategoryTree(prevCategories);
      });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Error fetching subcategories");
    }
  };


  const renderTree = (categories) => categories.map((category) => (
    <StyledTreeItem
      key={category.CategoryID}
      nodeId={String(category.CategoryID)}
      labelText={category.CategoryName || category.PropertyName}
      labelIcon={category.isProperty ? "file-outline" : "folder-open"} // Use different icons for categories and properties
      categoryData={category} // Pass the entire category data including children and properties
      isProperty={category.isProperty}
      labelInfo={category.subcategories?.length} // Optionally display subcategory count or other info
      setParentCategoryId={setParentCategoryId}
      setShowProperty={setShowProperty}
      setParentCategoryData={setParentCategoryData}
      parentCategoryId={parentCategoryId}
      parentCategoryData={parentCategoryData}
      setShow={setShow}
      onClick={(event) => {
        event.preventDefault();
        if (!category.isProperty) {
          handleCategoryClick(category.CategoryID);
        }
      }}
    >
      {category.children && renderTree(category.children)}
      {category.properties && renderTree(category.properties.map(property => ({
        ...property,
        isProperty: true,
        CategoryID: `property-${property.PropertyID}` // Ensure unique ID for properties
      })))}
    </StyledTreeItem>
  ));

  useEffect(() => {
    // getParentCategoryData()
  }, [])

  useEffect(() => {
    // Update the tree when parent category data changes
    renderTree(parentCategory);
  }, [parentCategory]);

  return (
    <TreeView
      sx={{ minHeight: 240 }}
      defaultExpanded={['3']}
      defaultExpandIcon={ExpandIcon}
      defaultCollapseIcon={<Icon icon='mdi:chevron-down' />}
    >
      {parentCategory.length > 0 && renderTree(parentCategory)}
    </TreeView>
  )
}

export default TreeViewCustomized
