import React, { useState, useEffect, useRef, useContext } from 'react';
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
import axios from "axios";

export default function Table() {
    const {
        dataP,
        GetAllPeople
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
        setLinkDialog
    } = useContext(PersonContext);

    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);

    // const [dataP, setDataP] = useState([]);

    // const GetAllPeople = async () => {
    //     await axios.get("https://localhost:7149/Pessoas/BuscarTodasPessoas")
    //         .then(response => {
    //             setDataP(response.data);
    //         });
    // }

    useEffect(() => {
        if (updateData) {
            GetAllPeople();
            setUpdateData(false);
        }
    }, [GetAllPeople, updateData, setUpdateData,]);

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
        setLinkDialog(true);
    }

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
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="flex flex-wrap gap-2">
                <Button label="Cadastrar" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
            <h1 className="m-0">Pessoas</h1>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar..." />
            </span>
        </div>
    );

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
                    <Column field="documento" sortable header="CPF"></Column>
                    <Column field="telefone" sortable header="Telefone"></Column>
                    <Column field="usuario" sortable header="Usuario"></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ textAlign: 'center' }}></Column>
                    <Column field="empresaId" sortable header="Empresa" style={{ textAlign: 'center' }} ></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
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