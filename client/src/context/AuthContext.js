// ** React Imports
import { createContext, useContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { setToken } from 'src/store/axiosdefaults'
import { encryptData, getRolesPages } from 'src/store/rolepages'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from 'src/configs/acl'
import { useAbility } from '@casl/react'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // const ability = new Ability([])
  // const ability = useAbility(AbilityContext)

  function defineRulesFor(user) {
    const { can, rules } = AbilityBuilder.extract()

    can('manage', "all")

    // can(['read'], 'foo', { username: user.name })

    return rules
  }

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          .then(async response => {
            setToken(storedToken)
            const roleData = await getRolesPages(response?.data?.userData?.RoleID)
            console.log(JSON.stringify(roleData))
            const encryptedText = encryptData(JSON.stringify(roleData), 5);
            console.log('Encrypted:', encryptedText);

            // const decryptedText = decryptData(encryptedText, key);
            // console.log('Decrypted:', decryptedText);
            localStorage.setItem("roleData", encryptedText)

            // updateAbility(roleData)
            // ability.update(defineRulesFor(response.data.userData))
            setLoading(false)
            setUser({ ...response.data.userData })

            // const {pathname} = router
            console.log(router)
            console.log(router.pathname === "/")
            const redirectURL = router.pathname !== '/' ? router.pathname : '/apps/dashboard'
            console.log(redirectURL)
            router.replace(redirectURL)
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('roleData')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            router.replace('/login')

            // if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            //   router.replace('/login')
            // }
          })
      } else {
        localStorage.removeItem('userData')
        localStorage.removeItem('roleData')
        localStorage.removeItem('accessToken')
        setUser(null)
        setLoading(false)
        if (!router.pathname.includes('/reset-password') &&
          !router.pathname.includes('/forgot-password') &&
          !router.pathname.includes('/thankyou')) {
          router.replace('/login');
        }

        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {

    console.log(params)

    axios
      .post(authConfig.loginEndpoint, { ...params, companyId: "1" })
      .then(async response => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token)
        setToken(response.data.token)
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.userData })
        window.localStorage.setItem('userData', JSON.stringify(response.data.userData))
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        const roleData = await getRolesPages(response?.data?.userData?.RoleID)
        console.log(JSON.stringify(roleData))
        const encryptedText = encryptData(JSON.stringify(roleData), 5);
        console.log('Encrypted:', encryptedText);

        // const decryptedText = decryptData(encryptedText, key);
        // console.log('Decrypted:', decryptedText);
        localStorage.setItem("roleData", encryptedText)

        // updateAbility(roleData)
        // ability.update(defineRulesFor(response.data.userData))
        // const roleData = getRolesPages("13")
        // updateAbility(roleData)
        // ability.update(defineRulesFor(response.data.userData))
        router.replace("/apps/dashboard")
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('roleData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }


  // const fetchRoleData = async () => {
  // try {
  // const response = await axios.get('your-role-data-endpoint')
  // return response.data.roleData
  // } catch (error) {
  // console.error('Error fetching role data:', error)
  // return null
  // }
  // }

  const updateAbility = (roleData) => {
    const { can, rules } = new AbilityBuilder(AppAbility)
    can(['Read'], 'dashboard')
    roleData.forEach(item => {
      can([item.PermissionName], item.PageName)
    })
    console.log(rules)
    ability.updateAbility(rules)
    console.log("....")
  }


  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
