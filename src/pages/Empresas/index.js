import { CompanyContextProvider } from "../../Contexts/CompanyContext";
import Table from "./Components/Table"

const Empresas = () => {
    return (
        <CompanyContextProvider>
          <Table />
        </CompanyContextProvider>
    )
  }
  
  export default Empresas;