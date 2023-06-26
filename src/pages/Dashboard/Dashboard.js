import { PersonContextProvider } from "../../Contexts/PersonContext";
import Table from "../Pessoas/Components/Table"

const Dashboard = () => {
    return (
      <section>
        <PersonContextProvider>
          <Table />
        </PersonContextProvider>
      </section>
    )
  }
  
  export default Dashboard;