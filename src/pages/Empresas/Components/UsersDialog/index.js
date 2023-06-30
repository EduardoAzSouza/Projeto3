import React, { useEffect, useRef, useContext } from 'react';
import { CompanyContext } from '../../../../Contexts/CompanyContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useAxios } from "../../../../hooks/useAxios";

const UsersDialog = () => {
    const { AllCompanyPeople, users } = useAxios();
    const {
        updateUsers,
        setUpdateUsers,
        selectCompany,
        usersDialog,
        setUsersDialog,
    } = useContext(CompanyContext);
    const toast = useRef(null);

    useEffect(() => {
        if (updateUsers) {
        AllCompanyPeople(selectCompany.id);
        setUpdateUsers(false);
    }
    });

    const Header = (
        <div className="table-header">
            {selectCompany?.nomeFantasia}
        </div>
    )

    const hideUsersDialog = () => {
        setUsersDialog(false);
    };

    return (
        <div>
            <React.Fragment>
                <Toast ref={toast} />
                <Dialog visible={usersDialog} style={{ width: '50rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header={Header}
                    onHide={hideUsersDialog}>
                    <div className="card">
                        <DataTable
                            value={users}
                            paginator
                            rows={10}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords} Pessoas">
                            <Column field="nome" header="Nome" sortable></Column>
                            <Column field="documento" sortable header="CPF"></Column>
                            <Column field="telefone" sortable header="Telefone"></Column>
                            <Column field="usuario" sortable header="Usuario"></Column>
                        </DataTable>
                    </div>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export default UsersDialog;