import { useState } from "react";
import axios from "axios";

export const useAxios = () => {
    const [data, setData] = useState([]);
    const [dataP, setDataP] = useState([]);
    const [users, setUsers] = useState([]);

    const GetAllCompanies = async () => {
        await axios.get("https://localhost:7149/Empresa/BuscarTodasEmpresas")
            .then(response => {
                setData(response.data);
            });
    };

    const GetAllPeople = async () => {
        await axios.get("https://localhost:7149/Pessoas/BuscarTodasPessoas")
            .then(response => {
                setDataP(response.data);
            });
    }

    const DelCompany = async (id) => {
        await axios.delete("https://localhost:7149/Empresa/Deletar/" + id);
    };

    const DelPerson = async (id) => {
        await axios.delete("https://localhost:7149/Pessoas/Apagar/" + id)
      };

    const StatusUpdateC = async (id) => {
        await axios.put("https://localhost:7149/Empresa/alterar_status/" + id);
    };

    const StatusUpdateP = async (id) => {
        await axios.put("https://localhost:7149/Pessoas/alterar_status/" + id);
    };

    const AllCompanyPeople = async (id) => {
        await axios.get("https://localhost:7149/Empresa/TodasPessoasEmpresa/" + id)
            .then(response => {
                setUsers(response.data);
            });
    };

    const CreateCompany = async (selectCompany) => {
        await axios.post("https://localhost:7149/Empresa/Adicionar", selectCompany)
    }

    const CreatePerson = async (selectPerson) => {
        await axios.post("https://localhost:7149/Pessoas/Adicionar", selectPerson)
    }

    const UpdateCompany = async (selectCompany) => {
        await axios.put("https://localhost:7149/Empresa/Atualizar", selectCompany)
    }

    const UpdatePerson = async (selectPerson) => {
        await axios.put("https://localhost:7149/Pessoas/Atualizar", selectPerson)
    }

    const LinkCompany = async (id, idc) => {
        await axios.put("https://localhost:7149/Pessoas/vincular_empresa/",id,"/",idc)
    }

    return {
        data,
        dataP,
        users,
        GetAllCompanies,
        GetAllPeople,
        CreateCompany,
        CreatePerson,
        UpdateCompany,
        UpdatePerson,
        DelCompany,
        DelPerson,
        StatusUpdateC,
        StatusUpdateP,
        AllCompanyPeople,
        LinkCompany
    };
};