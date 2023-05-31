import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Tag } from 'primereact/tag';

import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import axios from "axios";

export default function Pessoas() {
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const toast = useRef(null);

  const [selectPerson, setSelectPerson] = useState({
    nome: '',
    documento: '',
    telefone: '',
    usuario: ''
  })

  const Getall = async () => {
    await axios.get("https://localhost:7149/Pessoas/BuscarTodasPessoas")
      .then(response => {
        setData(response.data);
      });
  }

  useEffect(() => {
    if (updateData) {
      Getall();
      setUpdateData(false);
    }
  }, [updateData]);

  const hideDialog = () => {
    setDialog(false);
  };

  const hideUpdateDialog = () => {
    setUpdateDialog(false);
  };

  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setSelectPerson({
      ...selectPerson, [name]: value
    });
    console.log(selectPerson);
  }

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Cadastrar" icon="pi pi-plus" severity="success" onClick={openNew} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" />;
  };

  const openNew = () => {
    setSelectPerson();
    setDialog(true);
  };

  const confirmUpdate = (selectPerson) => {
    setSelectPerson(selectPerson);
    setUpdateDialog(true);
  };

  const confirmDelete = (selectPerson) => {
    setSelectPerson(selectPerson);
    setDeleteDialog(true);
  };

  const register = async () => {
    await axios.post("https://localhost:7149/Pessoas/Adicionar", selectPerson)
      .then(() => {
        setUpdateData(true);
        setDialog(false);
        setSelectPerson();
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cadastrado com Sucesso', life: 3000 });
      })
  };

  const update = async () => {
    await axios.put("https://localhost:7149/Pessoas/Atualizar", selectPerson)
      .then(response => {
        var _response = response.data;
        var aux = data;
        aux.map(pessoa => {
          if (pessoa.id === selectPerson.id) {
            pessoa.nome = _response.nome;
            pessoa.telefone = _response.telefone;
            pessoa.usuario = _response.usuario;
          }
        });
        setUpdateData(true);
        setUpdateDialog(false);
      })
  };

  const exclude = async () => {
    await axios.delete("https://localhost:7149/Pessoas/Apagar/" + selectPerson.id)
      .then(response => {
        setData(data.filter(pessoa => pessoa.id !== response.data));
        setUpdateData(true);
        setDeleteDialog(false);
        setSelectPerson();
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      })
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData)}></Tag>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => confirmUpdate(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDelete(rowData)} />
      </React.Fragment>
    );
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
      <h4 className="m-0">Pessoas</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar..." />
      </span>
    </div>
  );

  const dialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Cadastrar" icon="pi pi-check" onClick={register} />
    </React.Fragment>
  );

  const updateDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideUpdateDialog} />
      <Button label="Atualizar" icon="pi pi-check" onClick={update} />
    </React.Fragment>
  );

  const deleteDialogFooter = (
    <React.Fragment>
      <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
      <Button label="Sim" icon="pi pi-check" severity="danger" onClick={exclude} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable
          value={data}
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
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
          <Column field="empresaId" sortable header="Empresa" style={{ textAlign: 'center' }} ></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
        </DataTable>
      </div>
      <Dialog modal className="p-fluid"
        header="Cadastrar nova Pessoa"
        footer={dialogFooter}
        visible={dialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name" className="font-bold">Nome</label>
          <div className="p-inputgroup">
            <InputText name="nome" placeholder="Nome" onChange={handleChange} required autoFocus />
            <span className="p-inputgroup-addon">
              <i className="pi pi-language"></i>
            </span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="name" className="font-bold">CPF</label>
          <div className="p-inputgroup">
            <InputMask mask="999.999.999-99" unmask placeholder="999.999.999-99" name="documento" onChange={handleChange} required />
            <span className="p-inputgroup-addon">
              <i className="pi pi-id-card"></i>
            </span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="name" className="font-bold">Telefone</label>
          <div className="p-inputgroup">
            <InputMask mask="(99)99999-9999" unmask placeholder="(99)99999-9999" name="telefone" onChange={handleChange} />
            <span className="p-inputgroup-addon">
              <i className="pi pi-phone"></i>
            </span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="name" className="font-bold">Usuario</label>
          <div className="p-inputgroup">
            <InputText placeholder="Usuario" name="usuario" onChange={handleChange} required />
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
          </div>
        </div>
      </Dialog>

      <Dialog modal className="p-fluid"
        header="Editar Pessoa"
        footer={updateDialogFooter}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        visible={updateDialog}
        onHide={hideUpdateDialog}>

        <div className="field">
          <label htmlFor="name" className="font-bold">Nome</label>
          <div className="p-inputgroup">
            <InputText name="nome"
              value={selectPerson && selectPerson.nome} onChange={handleChange} required />
            <span className="p-inputgroup-addon">
              <i className="pi pi-language"></i>
            </span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="name" className="font-bold">CPF</label>
          <div className="p-inputgroup">
            <InputMask mask="999.999.999-99" unmask name="documento"
              value={selectPerson && selectPerson.documento} readOnly />
            <span className="p-inputgroup-addon">
              <i className="pi pi-id-card"></i>
            </span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="name" className="font-bold">Telefone</label>
          <div className="p-inputgroup">
            <InputMask mask="(99)99999-9999" unmask name="telefone" onChange={handleChange}
              value={selectPerson && selectPerson.telefone} />
            <span className="p-inputgroup-addon">
              <i className="pi pi-phone"></i>
            </span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="name" className="font-bold">Usuario</label>
          <div className="p-inputgroup">
            <InputText name="usuario" value={selectPerson && selectPerson.usuario}
              onChange={handleChange} required />
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
          </div>
        </div>
      </Dialog>

      <Dialog visible={deleteDialog} style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirme"
        modal footer={deleteDialogFooter}
        onHide={hideDeleteDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {selectPerson && (
            <span>
              Você tem certeza que deseja deletar <b>{selectPerson.nome}</b>?
            </span>
          )}
        </div>
      </Dialog>

    </div>
  );
};