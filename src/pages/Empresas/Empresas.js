import { CompanyContextProvider } from "../../Contexts/CompanyContext";
import Table from "../Empresas/Components/Table"

const Empresas = () => {
    return (
      <section>
        <CompanyContextProvider>
          <Table />
        </CompanyContextProvider>
      </section>
    )
  }
  
  export default Empresas;