import axios from "axios"
import { asyncWrap } from "./util"
import { AbilityBuilder } from "@casl/ability"


export const getRolesPages = async(id) => {
    const [err, res] = await asyncWrap(axios.get(`page/roleWise?roleId=${id}&pageNo=-1`))
    console.log(res.data.data)

    // const data = [
    //     {
    //         "RoleWisePageID": "11",
    //         "RoleID": "1",
    //         "RoleName": "Super Admin",
    //         "PageID": "5",
    //         "PageName": "GST",
    //         "PagePath": "GST",
    //         "Permission": "1",
    //         "PermissionName": "Read",
    //         "ComapanyID": "1"
    //     },
    //     {
    //         "RoleWisePageID": "12",
    //         "RoleID": "1",
    //         "RoleName": "Super Admin",
    //         "PageID": "4",
    //         "PageName": "GST",
    //         "PagePath": "GST",
    //         "Permission": "1",
    //         "PermissionName": "Create",
    //         "ComapanyID": "1"
    //     },
    //     {
    //         "RoleWisePageID": "13",
    //         "RoleID": "1",
    //         "RoleName": "Super Admin",
    //         "PageID": "3",
    //         "PageName": "GST",
    //         "PagePath": "GST",
    //         "Permission": "1",
    //         "PermissionName": "Delete",
    //         "ComapanyID": "1"
    //     },
    //     {
    //         "RoleWisePageID": "14",
    //         "RoleID": "1",
    //         "RoleName": "Super Admin",
    //         "PageID": "2",
    //         "PageName": "Category",
    //         "PagePath": "Category",
    //         "Permission": "1",
    //         "PermissionName": "Read",
    //         "ComapanyID": "1"
    //     },
    //     {
    //         "RoleWisePageID": "15",
    //         "RoleID": "1",
    //         "RoleName": "Super Admin",
    //         "PageID": "1",
    //         "PageName": "user",
    //         "PagePath": "User",
    //         "Permission": "1",
    //         "PermissionName": "Read",
    //         "ComapanyID": "1"
    //     }

    // ]

    return res.data.data
}

export function updateAbility(ability) {
    const { can, rules } = new AbilityBuilder();

    // if (user.role === 'Super Admin') {
  can('manage', 'all');
  
    // } else {
    //   can('read', 'all');
    // }
  
    ability.update(rules);
}
  
// Encryption function
export function encryptData(data, key) {
  let encryptedData = '';
  for (let i = 0; i < data.length; i++) {
      let charCode = data.charCodeAt(i);
      let encryptedCharCode = charCode + key; // Shift the character code by the key
      encryptedData += String.fromCharCode(encryptedCharCode);
  }

  return encryptedData;
}

// Decryption function
export function decryptData(data, key) {
  let decryptedData = '';
  for (let i = 0; i < data.length; i++) {
      let charCode = data.charCodeAt(i);
      let decryptedCharCode = charCode - key; // Reverse the shift by subtracting the key
      decryptedData += String.fromCharCode(decryptedCharCode);
  }

  return decryptedData;
}
