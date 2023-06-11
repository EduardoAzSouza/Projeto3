import { createContext, useState } from "react";

export const CompanyContext = createContext();

export const CompanyContextProvider = ({ children }) => {
    let empty = {
        cnpj: '',
        dataAbertura: '',
        nomeEmpresarial: '',
        nomeFantasia: '',
        cnae: '',
        naturezaJuridica: '',
        endereco: {
            cep: '',
            estado: '',
            cidade: '',
            rua: '',
            numero: '',
            bairro: ''
        },
        telefone: '',
        capital: ''
    };
    
    const [updateData, setUpdateData] = useState(true);
    const [updateUsers, setUpdateUsers] = useState(false);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectCompany, setSelectCompany] = useState(empty);
    const [updateDialog, setUpdateDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [statusDialog, setStatusDialog] = useState(false);
    const [usersDialog, setUsersDialog] = useState(false);
    

    const vars = {
        empty,
        updateData, 
        setUpdateData,
        updateUsers,
        setUpdateUsers,
        selectCompany,
        setSelectCompany,
        createDialog,
        setCreateDialog,
        deleteDialog,
        setDeleteDialog,
        updateDialog,
        setUpdateDialog,
        statusDialog,
        setStatusDialog,
        usersDialog,
        setUsersDialog
    };

    return (
        <CompanyContext.Provider value={vars}>
            {children}
        </CompanyContext.Provider>
    );
};