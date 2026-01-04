import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import ApiKeyPopup from "../ui/ApiKeyPopup";
import { useQuery } from "@tanstack/react-query";

const Layout = () => {

  const { data: hasApiKey, isPending } = useQuery<boolean>({
    queryKey: ['hasApiKey'],
    queryFn: async () => {
      const hasApiKey = await window.apiKey.hasAPIKey();
      return hasApiKey
    }
  })

  return (
    <>
      <Sidebar />
      <Outlet />
      {(!hasApiKey && !isPending) && <ApiKeyPopup/>}
    </>
  )
}

export default Layout