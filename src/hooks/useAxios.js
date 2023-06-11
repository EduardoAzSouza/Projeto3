import { useState } from "react";
import axios from "axios";

export const useAxios = () => {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);

    const GetAllCompanies = async () => {
        await axios.get("https://localhost:7149/Empresa/BuscarTodasEmpresas")
            .then(response => {
                setData(response.data);
            });
    };

    const DelCompany = async (id) => {
        await axios.delete("https://localhost:7149/Empresa/Deletar/" + id);
    };

    const StatusUpdateC = async (id) => {
        await axios.put("https://localhost:7149/Empresa/alterar_status/" + id);
    };

    const AllCompanyPeople = async (id) => {
        await axios.get("https://localhost:7149/Empresa/TodasPessoasEmpresa/" + id)
        .then(response => {
            setUsers(response.data);
        });
        console.log(users)
    };

    const CreateCompany = async (selectCompany) => {
        await axios.post("https://localhost:7149/Empresa/Adicionar", selectCompany)
    }

    const UpdateCompany = async (selectCompany) => {
        await axios.put("https://localhost:7149/Empresa/Atualizar", selectCompany)
    }

    return {
        data,
        users,
        GetAllCompanies,
        CreateCompany,
        UpdateCompany,
        DelCompany,
        StatusUpdateC,
        AllCompanyPeople,
    };
};