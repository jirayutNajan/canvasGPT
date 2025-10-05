import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import Sidebar from "./Sidebar"
import { useApiStore } from "../../store/hasapistore"
import ApiKey from "../ui/ApiKey"

const Layout = () => {
  const {hasApi, setHasApi} = useApiStore();

  useEffect(() => {
    async function checkAPI() {
      const exists = await window.electronAPI?.hasAPIKey();
      if(!exists) {
        setHasApi(false)
      }
    }
    
    checkAPI();
  }, [])

  return (
    <>
      <Outlet />
      <Sidebar />
      {/* {!hasApi && <ApiKey setHasApiKey={setHasApi}/>} */}
    </>
  )
}

export default Layout