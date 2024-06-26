import React, { useState, useEffect, useRef, useContext } from 'react';
import { Title, Header } from "../../../../components/styled";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useAxios } from '../../../../hooks/useAxios';
import { PersonContext } from '../../../../Contexts/PersonContext';
import DeleteDialog from '../DeleteDialog';
import StatusDialog from '../StatusDialog';
import CreateDialog from '../CreateDialog';
import UpdateDialog from '../UpdateDialog';
import LinkDialog from '../LinkDialog';

export default function Table() {
    const {
        data,
        dataP,
        GetAllPeople,
        GetAllCompanies
    } = useAxios();

    const {
        updateData,
        setUpdateData,
        createDialog,
        setCreateDialog,
        setSelectPerson,
        deleteDialog,
        setDeleteDialog,
        updateDialog,
        setUpdateDialog,
        statusDialog,
        setStatusDialog,
        linkDialog,
        setLinkDialog,
        setupdatecompanies
    } = useContext(PersonContext);

    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    console.log(updateData)

    useEffect(() => {
        if (updateData) {
            GetAllPeople();
            GetAllCompanies();
            setUpdateData(false);
        }
    }, [GetAllPeople,
        updateData,
        setUpdateData,
        GetAllCompanies,
    ]);

    // useEffect(() => {
    //     if (updateData) {
    //         GetAllPeople();
    //         setUpdateData(false);
    //     }
    // }, [updateData]);


    const openNew = () => {
        setSelectPerson();
        setCreateDialog(true);
    };

    const confirmUpdate = (selectPerson) => {
        setSelectPerson(selectPerson);
        setUpdateDialog(true);
    };

    const confirmDelete = (selectPerson) => {
        setSelectPerson(selectPerson);
        setDeleteDialog(true);
    };

    const confirmStatus = (selectPerson) => {
        setSelectPerson(selectPerson);
        setStatusDialog(true);
    };

    const confirmLink = (selectPerson) => {
        setSelectPerson(selectPerson);
        setupdatecompanies(true);
        setLinkDialog(true);
    }

    const companyId = (rowData) => {
        const empresa = data.find(item => item.id === rowData.empresaId);
        return empresa ? empresa.nomeFantasia : '';
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-1" onClick={() => confirmUpdate(rowData)} />
                <Button icon="pi pi-trash" rounded outlined className="mr-1" severity="danger" onClick={() => confirmDelete(rowData)} />
                <Button icon="pi pi-check-circle" rounded outlined className="mr-1" severity="warning" onClick={() => confirmStatus(rowData)} />
                <Button icon="pi pi-paperclip" rounded outlined className="mr-1" severity="success" onClick={() => confirmLink(rowData)} />
            </React.Fragment>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData)}></Tag>;
    };

    const getSeverity = (pessoas) => {
        switch (pessoas.status) {
            case 'Ativo':
                return 'success';

            case 'Pendente':
                return 'warning';

            case 'Inativo':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <Header>
            <div className="flex flex-wrap gap-2">
                <Button label="Cadastrar" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
            <Title>Pessoas</Title>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar..." />
            </span>
        </Header>
    );

    const cpfFormat = (rowData) => {
        return rowData.documento?.replace(/\D/g, '')
            .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})?/, "$1.$2.$3-$4");
    };

    const telFormat = (rowData) => {
        return rowData.telefone?.replace(/\D/g, '')
            .replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable
                    value={dataP}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 30]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords} Pessoas"
                    globalFilter={globalFilter}
                    header={header}>
                    <Column field="id" header="ID" sortable style={{ minWidth: '4rem', textAlign: 'center' }}></Column>
                    <Column field="nome" header="Nome" sortable style={{ minWidth: '18rem' }}></Column>
                    <Column field="documento" sortable body={cpfFormat} header="CPF"></Column>
                    <Column field="telefone" sortable body={telFormat} header="Telefone"></Column>
                    <Column field="usuario" sortable header="Usuario"></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} style={{ textAlign: 'center' }}></Column>
                    <Column field="empresaId" sortable body={companyId} header="Empresa" ></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ maxWidth: '12rem' }}></Column>
                </DataTable>

                <DeleteDialog visible={deleteDialog} />

                <StatusDialog visible={statusDialog} />

                <CreateDialog visible={createDialog} />

                <UpdateDialog visible={updateDialog} />

                <LinkDialog visible={linkDialog} />

            </div>
        </div>
    );
};