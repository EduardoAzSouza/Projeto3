import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Tag } from 'primereact/tag';

import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import axios from "axios";

export default function Empresass() {
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const toast = useRef(null);

  const [expandedRows, setExpandedRows] = useState(null);

  const [selectCompany, setSelectCompany] = useState({
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
  })

  const [endereco, setEndereco] = useState({
      cep: '',
      estado: '',
      cidade: '',
      rua: '',
      numero: '',
      bairro: '',
  });

  const Getall = async () => {
    await axios.get("https://localhost:7149/Empresa/BuscarTodasEmpresas")
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

  const onRowExpand = (event) => {
    toast.current.show({ severity: 'info', summary: 'Endereço Expandido', detail: event.data.nomeFantasia, life: 3000 });
  };

  const onRowCollapse = (event) => {
    toast.current.show({ severity: 'success', summary: 'Endereço Colapsado', detail: event.data.nomeFantasia, life: 3000 });
  };

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
    setSelectCompany({
      ...selectCompany, [name]: value
    });
    console.log(selectCompany);
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
    setSelectCompany();
    setEndereco();
    setDialog(true);
  };

  const confirmUpdate = (selectCompany) => {
    setSelectCompany(selectCompany);
    setUpdateDialog(true);
  };

  const confirmDelete = (selectCompany) => {
    setSelectCompany(selectCompany);
    setDeleteDialog(true);
  };

  const register = async () => {
    await axios.post("https://localhost:7149/Empresa/Adicionar", selectCompany)
      .then(() => {
        setUpdateData(true);
        setDialog(false);
        setSelectCompany();
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cadastrado com Sucesso', life: 3000 });
      })
  };

  const update = async () => {
    await axios.put("https://localhost:7149/Empresa/Atualizar", selectCompany)
      .then(response => {
        var _response = response.data;
        var aux = data;
        aux.map(empresa => {
          if (empresa.id === selectCompany.id) {
            empresa.nome = _response.nome;
            empresa.telefone = _response.telefone;
            empresa.usuario = _response.usuario;
          }
        });
        setUpdateData(true);
        setUpdateDialog(false);
      })
  };

  const exclude = async () => {
    await axios.delete("https://localhost:7149/Empresa/Deletar" + selectCompany.id)
      .then(response => {
        setData(data.filter(empresa => empresa.id !== response.data));
        setUpdateData(true);
        setDeleteDialog(false);
        setSelectCompany();
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

  const allowExpansion = (rowData) => {
    return rowData.endereco != null;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>Endereço {data.nomeFantasia}</h5>
        <div class="grid">
          <div class="col-1">{data.endereco.cep}</div>
          <div class="col">{data.endereco.estado}</div>
          <div class="col">{data.endereco.cidade}</div>
          <div class="col">{data.endereco.rua}</div>
          <div class="col">{data.endereco.numero}</div>
          <div class="col">{data.endereco.bairro}</div>

        </div>
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Empresas</h4>
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

  const checkCEP = (e) => {
    const cep = e.target.value;
    fetch(`https://viacep.com.br/ws/${cep}/json/`).then(res => res.json()).then(end => {
      setEndereco(end);
    });
  }

  const CEP = async(e) => {
    const cep = e.target.value;
    await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => {
      setEndereco(response.data);
    });
  }



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
          currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords} Empresas"
          globalFilter={globalFilter}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          onRowExpand={onRowExpand}
          onRowCollapse={onRowCollapse}
          rowExpansionTemplate={rowExpansionTemplate}
          header={header}>

          <Column field="id" header="ID" sortable style={{ minWidth: '4rem', textAlign: 'center' }}></Column>
          <Column field="cnpj" header="CNPJ" sortable style={{ minWidth: '10rem' }}></Column>
          <Column field="dataAbertura" sortable header="Data de Inicio"></Column>
          <Column field="nomeEmpresarial" sortable header="Nome"></Column>
          <Column field="nomeFantasia" sortable header="Nome Fantasia"></Column>
          <Column field="cnae" sortable header="CNAE" style={{ minWidth: '7rem' }}></Column>
          <Column field="naturezaJuridica" sortable header="Natureza"></Column>
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
          <Column header="Endereço" expander={allowExpansion} style={{ width: "5rem" }} />
          <Column field="telefone" sortable header="Telefone"></Column>
          <Column field="capital" sortable header="Capital"></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
        </DataTable>
      </div>
      <Dialog modal className="p-fluid"
        value={endereco}
        header="Cadastrar nova Empresa"
        footer={dialogFooter}
        visible={dialog}
        style={{ width: '50rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        onHide={hideDialog}>
        <div className="card flex flex-column md:flex-row gap-3">
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Nome Fantasia</label>
              <InputText name="nomeFantasia" onChange={handleChange} required autoFocus />
            </div>
          </div>
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Nome Fantasia</label>
              <InputText name="nomeEmpresarial" onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="card flex flex-column md:flex-row gap-3">
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">CNPJ</label>
              <InputMask mask="99.999.999/9999-99" unmask name="cnpj" onChange={handleChange} required />
            </div>
          </div>
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">CNAE</label>
              <InputMask mask="9999-9/99" unmask name="cnae" onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="card flex flex-column md:flex-row gap-3">
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Natureza Juridica</label>
              <InputText name="naturezaJuridica" onChange={handleChange} required />
            </div>
          </div>
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Data de Abertura</label>
              <InputText name="dataAbertura" onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card flex flex-column md:flex-row gap-3">
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Telefone</label>
              <InputMask mask="(99)99999-9999" unmask name="telefone" onChange={handleChange}  />
            </div>
          </div>
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Capital</label>
              <InputNumber name="capital" onValueChange={handleChange} mode="currency" currency="BRL" locale="pt-BR" />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Endereço</h3>
          <hr></hr>
          <div className="card flex flex-column md:flex-row gap-3">
            <div className=" field">
              <label htmlFor="name" className="font-bold">cep</label>
              <InputText name="endereco.cep" onChange={handleChange} onBlur={CEP} required />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Estado</label>
              <InputText name="endereco.estado" value={endereco && endereco.uf} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Cidade</label>
              <InputText name="endereco.cidade" value={endereco && endereco.localidade} onChange={handleChange} required readOnly />
            </div>
          </div>

          <div className="card flex flex-column md:flex-row gap-3">
            <div className=" field">
              <label htmlFor="name" className="font-bold">Rua</label>
              <InputText name="endereco.rua" value={endereco && endereco.logradouro} onChange={handleChange} required readOnly />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Bairro</label>
              <InputText name="endereco.bairro" value={endereco && endereco.bairro} onChange={handleChange} required readOnly />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Numero</label>
              <InputText name="endereco.numero" onChange={handleChange} required />
            </div>
          </div>
        </div>

      </Dialog>

      <Dialog modal className="p-fluid"
        header="Editar Empresa"
        footer={updateDialogFooter}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        visible={updateDialog}
        onHide={hideUpdateDialog}>

        <div className="field">
          <label htmlFor="name" className="font-bold">Nome</label>
          <div className="p-inputgroup">
            <InputText name="nome"
              value={selectCompany && selectCompany.nome} onChange={handleChange} required />
            <span className="p-inputgroup-addon">
              <i className="pi pi-language"></i>
            </span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="name" className="font-bold">CPF</label>
          <div className="p-inputgroup">
            <InputText name="documento"
              value={selectCompany && selectCompany.documento} readOnly />
            <span className="p-inputgroup-addon">
              <i className="pi pi-id-card"></i>
            </span>
          </div>
        </div>


        <div className="field">
          <label htmlFor="name" className="font-bold">Usuario</label>
          <div className="p-inputgroup">
            <InputText name="usuario" value={selectCompany && selectCompany.usuario}
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
          {selectCompany && (
            <span>
              Você tem certeza que deseja deletar <b>{selectCompany.nomeFantasia}</b>?
            </span>
          )}
        </div>
      </Dialog>

    </div>
  );
};