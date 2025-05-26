import { AbilityBuilder, Ability } from '@casl/ability'
import { decryptData, getRolesPages } from 'src/store/rolepages'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role, subject) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  console.log(role)

  const userData = localStorage.getItem("userData")
  const roleName = JSON.parse(userData)?.RoleName
  const roleData = localStorage.getItem("roleData")
  const id = JSON.parse(userData)?.RoleID

  if (roleName === "Super Admin") {
    can('manage', "all")
  }

  // console.log(getRolesPages(id))
  can(['Read'], 'dashboard')
  console.log(roleData)

  // const encryptedText = encryptData(plaintext, key);
  // console.log('Encrypted:', encryptedText);

  const decryptedText = decryptData(roleData, 5);
  console.log('Decrypted:', decryptedText);

  JSON.parse(decryptedText).map((item) => {
    can([item.PermissionName.toString()], item.PageName.toString())
  })

  // console.log("First")
  // 
  // getRolesPages("13").then((roleData) => {
  // console.log("Second")
  // roleData.map((item) => {
  // if (item.PageName === "User") {
  // return can(['Read'], 'User')
  // }
  // console.log((item?.PermissionName).toString())
  // can([item.PermissionName.toString()], item.PageName.toString())
  // })
  // }).catch((error) => {
  // console.log(error)
  // })




  // console.log(roleData)

  // console.log(Object.values(roleData))
  // Object.values(roleData).map((item) => {
  //   console.log(item)
  // })

  // try {
  //   // Fetch data from API
  //   const roleData = await getRolesPages(id)
  //   // Dynamically set permissions based on fetched data
  //   roleData.forEach(item => {
  //     can([item.PermissionName], item.PageName)
  //   })
  // } catch (error) {
  //   console.error('Error fetching role pages:', error)
  // }

  // Read Permission
  can(['Read'], 'dashboard')
  console.log(rules)

  // can(['Read'], "GST")
  // can(['Read'], "User")
  // can(['Read'], "Pages")
  // can(['Read'], "Role")
  // can(['Read'], "RoleWise")
  // can(['Read'], "Company")
  // can(['Read'], "Product")
  // can(['Read'], "Category")
  // can(['Read'], "Quotation")
  // can(['Read'], "Complain")
  // can(['Read'], "Inquiry")

  // Create Permission
  // can(['Create'], 'dashboard')
  // can(['Create'], "GST")
  // can(['Create'], "User")
  // can(['Create'], "Pages")
  // can(['Create'], "Role")
  // can(['Create'], "RoleWise")
  // can(['Create'], "Company")
  // can(['Create'], "Product")
  // can(['Create'], "Category")
  // can(['Create'], "Quotation")
  // can(['Create'], "Complain")
  // can(['Create'], "Inquiry")

  // Delete Permission
  // can(['Delete'], 'dashboard')
  // can(['Delete'], "GST")
  // can(['Delete'], "User")
  // can(['Delete'], "Pages")
  // can(['Delete'], "Role")
  // can(['Delete'], "RoleWise")
  // can(['Delete'], "Company")
  // can(['Delete'], "Product")
  // can(['Delete'], "Category")
  // can(['Delete'], "Quotation")
  // can(['Delete'], "Complain")
  // can(['Delete'], "Inquiry")

  // if (Array.isArray(roleData)) {
  // roleData.forEach((item) => {
  // console.log(item)
  // can([item.PermissionName], item.PageName)
  // })
  // }
  // } else if (typeof roleData === 'object' && roleData !== null) {
  // Object.values(roleData).forEach((item) => {
  // console.log("...............")
  // can([item.PermissionName], item.PageName)
  // })
  // } else {
  // console.error("Unexpected roleData type:", typeof roleData);
  // }

  if (roleName === 'Super Admin') {
    // can("manage", "all")

    // can(['read'], 'dashboard')
    // can(['read'], 'role')
    // can(['read'], 'add-role')
  } else {
    can(['read'], 'role')
  }

  // } else if (role === 'client') {
  // can(['read'], 'acl-page')
  // } else {
  // can(['read', 'create', 'update', 'delete'], subject)
  // }
  console.log(rules)

  return rules
}

export const buildAbilityFor = (role, subject) => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
