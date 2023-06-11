import React, { useState, useEffect, useRef, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useAxios } from '../../../../hooks/useAxios';
import { CompanyContext } from '../../../../Contexts/CompanyContext';
import DeleteDialog from '../DeleteDialog';
import StatusDialog from '../StatusDialog';
import UsersDialog from '../UsersDialog';
import CreateDialog from '../CreateDialog';
import UpdateDialog from '../UpdateDialog';


export default function Table() {
    const {
        data,
        GetAllCompanies
    } = useAxios();

    const {
        updateData,
        setUpdateData,
        setUpdateUsers,
        createDialog,
        setCreateDialog,
        updateDialog,
        setUpdateDialog,
        deleteDialog,
        setDeleteDialog,
        statusDialog,
        setStatusDialog,
        usersDialog,
        setUsersDialog,
        setSelectCompany,
    } = useContext(CompanyContext);

    const [globalFilter, setGlobalFilter] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);

    const toast = useRef(null);

    // useEffect(() => {
    //     GetAllCompanies();
    // }, [data]);

    useEffect(() => {
        if (updateData) {
            GetAllCompanies();
            setUpdateData(false);
        }
    }, [updateData]);

    const openNew = () => {
        setSelectCompany();
        setCreateDialog(true);
    };

    const confirmUpdate = (selectCompany) => {
        setSelectCompany(selectCompany);
        setUpdateDialog(true);
    };

    const confirmDelete = (selectCompany) => {
        setSelectCompany(selectCompany);
        setDeleteDialog(true);
    };

    const confirmStatus = (selectCompany) => {
        setSelectCompany(selectCompany);
        setStatusDialog(true);
    };

    const confirmUsers = (selectCompany) => {
        setSelectCompany(selectCompany);
        setUsersDialog(true);
        setUpdateUsers(true);
    };

    const actionBodyTemplate = (rowData) => {
        // const items = [
        //     {
        //         label: 'Ataulizar Status',
        //         icon: 'pi pi-verified',
        //         command: () => confirmStatus(rowData)
        //     },
        //     {
        //         label: 'Ver todas Pessoas',
        //         icon: 'pi pi-users',
        //         command: () => confirmUsers(rowData)
        //     }
        // ];

        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-1" onClick={() => confirmUpdate(rowData)}/>
                <Button icon="pi pi-trash" rounded outlined className="mr-1" severity="danger" onClick={() => confirmDelete(rowData)} />
                <Button icon="pi pi-verified" rounded outlined className="mr-1" severity="warn" onClick={() => confirmStatus(rowData)} />
                <Button icon="pi pi-users" rounded outlined className="mr-1" severity="warn" onClick={() => confirmUsers(rowData)} />

                {/* <Menu model={items} popup ref={options} id="options" />
                <Button icon="pi pi-ellipsis-h" rounded outlined severity="info" model={items}
                    onClick={(rowData) => options.current.toggle(rowData)} aria-controls="options" aria-haspopup /> */}
            </React.Fragment>
        );
    };

    const getSeverity = (empresas) => {
        switch (empresas.status) {
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

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData)}></Tag>;
    };

    const allowExpansion = (rowData) => {
        return rowData.endereco != null;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Endereço {data.nomeFantasia}</h5>
                <div class="card flex flex-column md:flex-row gap-3">
                    <div class="field">{data.endereco.cep}</div>
                    <div class="field">{data.endereco.rua}, {data.endereco.numero}, {data.endereco.bairro}</div>
                    <div class="field">{data.endereco.cidade} - {data.endereco.estado}</div>
                </div>
                <div class="card flex flex-column md:flex-row gap-8">
                    <div class="p-fluid">
                        <h5>Natureza Juridica</h5>
                        <div class="field">{data.naturezaJuridica}</div>
                    </div>
                    <div class="p-fluid">
                        <h5>CNAE</h5>
                        <div class="field">{data.cnae}</div>
                    </div>
                    <div class="p-fluid">
                        <h5>Telefone</h5>
                        <div class="field">{data.telefone}</div>
                    </div>
                    <div class="p-fluid">
                        <h5>Nome Empresarial</h5>
                        <div class="field">{data.nomeEmpresarial}</div>
                    </div>
                </div>

            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="flex flex-wrap gap-2">
                <Button label="Cadastrar" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
            <h1 className="m-0">Empresas</h1>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar..." />
            </span>
        </div>
    );

    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Endereço Expandido', detail: event.data.nomeFantasia, life: 3000 });
    };

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Endereço Colapsado', detail: event.data.nomeFantasia, life: 3000 });
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">

                <DataTable
                    value={data}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 30]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords} Empresas"
                    globalFilter={globalFilter}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpand}
                    onRowCollapse={onRowCollapse}
                    rowExpansionTemplate={rowExpansionTemplate}
                    header={header}>

                    <Column expander={allowExpansion} style={{ width: "4rem" }} />
                    <Column field="id" header="ID" sortable style={{ minWidth: '4rem' }}></Column>
                    <Column field="nomeFantasia" sortable header="Nome Fantasia"></Column>
                    <Column field="cnpj" header="CNPJ" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="dataAbertura" sortable header="Data de Inicio"></Column>
                    <Column field="capital" sortable header="Capital"></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <CreateDialog visible={createDialog} />

                <UpdateDialog visible={updateDialog} />

                <StatusDialog visible={statusDialog} />

                <DeleteDialog visible={deleteDialog} />

                <UsersDialog visible={usersDialog} />

            </div>
        </div>
    )
}
