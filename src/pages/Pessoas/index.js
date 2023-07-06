import { PersonContextProvider } from "../../Contexts/PersonContext";
import Table from "../Pessoas/Components/Table"

const Pessoas = () => {
    return (
      <section>
        <PersonContextProvider>
          <Table />
        </PersonContextProvider>
      </section>
    )
  }
  
  export default Pessoas;