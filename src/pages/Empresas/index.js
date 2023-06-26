import { CompanyContextProvider } from "../../Contexts/CompanyContext";
import Table from "./Components/Table"

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