import { createContext, useState } from "react";

export const PersonContext = createContext();

export const PersonContextProvider = ({ children }) => {
    let empty = {
        nome: '',
        documento: '',
        telefone: '',
        usuario: ''
    };

    const [updateData, setUpdateData] = useState(true);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectPerson, setSelectPerson] = useState(empty);
    const [updateDialog, setUpdateDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [statusDialog, setStatusDialog] = useState(false);
    const [linkDialog, setLinkDialog] = useState(false);
    const [updatecompanies, setupdatecompanies] = useState(false)
    const [companiesDialog, setCompanyDialog] = useState(false);


    const vars = {
        empty,
        updateData,
        setUpdateData,
        createDialog,
        setCreateDialog,
        selectPerson,
        setSelectPerson,
        deleteDialog,
        setDeleteDialog,
        updateDialog,
        setUpdateDialog,
        statusDialog,
        setStatusDialog,
        linkDialog,
        setLinkDialog,
        companiesDialog,
        setCompanyDialog,
        updatecompanies, 
        setupdatecompanies
    };

    return (
        <PersonContext.Provider value={vars}>
            {children}
        </PersonContext.Provider>
    );
};