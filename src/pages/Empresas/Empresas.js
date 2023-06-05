import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
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
  const [statusDialog, setStatusDialog] = useState(false);
  const toast = useRef(null);
  const options = useRef(null);
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
    bairro: ''
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

  const hideStatusDialog = () => {
    setStatusDialog(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setSelectCompany({
      ...selectCompany, [name]: value
    });
    console.log(selectCompany);
  }

  const handleNumeroChange = (e) => {
    const numero = e.target.value;
    setSelectCompany(prevState => ({
      ...prevState,
      endereco: {
        ...prevState.endereco,
        numero: numero
      }
    }));
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

  const confirmStatus = (selectCompany) => {
    setSelectCompany(selectCompany);
    setStatusDialog(true);
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
    await axios.delete("https://localhost:7149/Empresa/Deletar/" + selectCompany.id)
      .then(response => {
        setData(data.filter(empresa => empresa.id !== response.data));
        setUpdateData(true);
        setDeleteDialog(false);
        setSelectCompany();
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      })
  };

  const upStatus = async () => {
    await axios.put("https://localhost:7149/Empresa/alterar_status/" + selectCompany.id)
      .then(response => {
        setData(data.filter(empresa => empresa.id !== response.data));
        setUpdateData(true);
        setStatusDialog(false);
        setSelectCompany();
        toast.current.show({ severity: 'success', summary: 'Ataulizado', detail: 'status Atualizado', life: 3000 });
      })
  };
  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData)}></Tag>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-1" onClick={() => confirmUpdate(rowData)} />
        <Button icon="pi pi-trash" rounded outlined className="mr-1" severity="danger" onClick={() => confirmDelete(rowData)} />
        <Button icon="pi pi-verified" rounded outlined className="mr-1" severity="warn" onClick={() => confirmStatus(rowData)} />


        {/* <Menu model={items} popup ref={options} id="options" />
        <Button  icon="pi pi-ellipsis-h" rounded outlined severity="info" model={items} onClick={(event) => options.current.toggle(event)} aria-controls="options" aria-haspopup/> */}
      </React.Fragment>
    );
  };

  // const items = [
  //   {
  //     label: 'Ataulizar Status',
  //     icon: 'pi pi-verified',
  //     confirmStatus(rowData);
  //   },
  //   {
  //     label: 'Ver todas Pessoas',
  //     icon: 'pi pi-users',
  //     command: () => {

  //     }
  //   }
  // ];

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

  const statusDialogFooter = (
    <React.Fragment>
      <Button label="Não" icon="pi pi-times" outlined onClick={hideStatusDialog} />
      <Button label="Sim" icon="pi pi-check" severity="danger" onClick={upStatus} />
    </React.Fragment>
  );

  const CEP = async (e) => {
    const cep = e.target.value;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.ok) {
        const data = await response.json();
        setSelectCompany({
          ...selectCompany,
          endereco: {
            cep: cep,
            estado: data.uf,
            cidade: data.localidade,
            bairro: data.bairro,
            rua: data.logradouro
          }
        });
        setEndereco({
          ...endereco,
          estado: data.uf,
          cidade: data.localidade,
          bairro: data.bairro,
          rua: data.logradouro
        });
      } else {
        throw new Error('Erro na busca do endereço');
      }
    } catch (error) {
      console.log('Erro na busca do endereço:', error);
    }
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
      </div>

      <Dialog modal className="p-fluid"
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
              <InputMask mask="99/99/9999" name="dataAbertura" onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card flex flex-column md:flex-row gap-3">
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Telefone</label>
              <InputMask mask="(99)99999-9999" unmask name="telefone" onChange={handleChange} />
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
              <InputText name="endereco.estado" value={endereco && endereco.estado} required readOnly />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Cidade</label>
              <InputText name="endereco.cidade" value={endereco && endereco.cidade} required readOnly />
            </div>
          </div>

          <div className="card flex flex-column md:flex-row gap-3">
            <div className=" field">
              <label htmlFor="name" className="font-bold">Rua</label>
              <InputText name="endereco.rua" value={endereco && endereco.rua} required readOnly />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Bairro</label>
              <InputText name="endereco.bairro" value={endereco && endereco.bairro} required readOnly />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Numero</label>
              <InputText name="endereco.numero" onChange={handleNumeroChange} required />
            </div>
          </div>
        </div>

      </Dialog>

      <Dialog modal className="p-fluid"
        header="Editar Empresa"
        footer={updateDialogFooter}
        style={{ width: '50rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        visible={updateDialog}
        onHide={hideUpdateDialog}>

        <div className="card flex flex-column md:flex-row gap-3">

          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Nome Fantasia</label>
              <InputText name="nomeFantasia" value={selectCompany && selectCompany.nomeFantasia}
                onChange={handleChange} required autoFocus />
            </div>
          </div>
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Nome Fantasia</label>
              <InputText name="nomeEmpresarial" value={selectCompany && selectCompany.nomeEmpresarial}
                onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="card flex flex-column md:flex-row gap-3">
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">CNPJ</label>
              <InputMask mask="99.999.999/9999-99" unmask name="cnpj" value={selectCompany && selectCompany.cnpj}
                onChange={handleChange} readOnly />
            </div>
          </div>
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">CNAE</label>
              <InputMask mask="9999-9/99" unmask name="cnae" value={selectCompany && selectCompany.cnae}
                onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="card flex flex-column md:flex-row gap-3">
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Natureza Juridica</label>
              <InputText name="naturezaJuridica" value={selectCompany && selectCompany.naturezaJuridica}
                onChange={handleChange} required />
            </div>
          </div>
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Data de Abertura</label>
              <InputMask mask="99/99/9999" name="dataAbertura" value={selectCompany && selectCompany.dataAbertura}
                onChange={handleChange} readOnly />
            </div>
          </div>
        </div>

        <div className="card flex flex-column md:flex-row gap-3">
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Telefone</label>
              <InputMask mask="(99)99999-9999" unmask name="telefone" value={selectCompany && selectCompany.telefone}
                onChange={handleChange} />
            </div>
          </div>
          <div className="p-fluid flex-1">
            <div className="field">
              <label htmlFor="name" className="font-bold">Capital</label>
              <InputNumber name="capital" value={selectCompany && selectCompany.capital}
                onValueChange={handleChange} mode="currency" currency="BRL" locale="pt-BR" />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Endereço</h3>
          <hr></hr>
          <div className="card flex flex-column md:flex-row gap-3">
            <div className=" field">
              <label htmlFor="name" className="font-bold">cep</label>
              <InputText name="endereco.cep" value={selectCompany.endereco.cep}
                onChange={handleChange} onBlur={CEP} required />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Estado</label>
              <InputText name="endereco.estado" value={selectCompany.endereco.estado} required readOnly />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Cidade</label>
              <InputText name="endereco.cidade" value={selectCompany.endereco.cidade} required readOnly />
            </div>
          </div>

          <div className="card flex flex-column md:flex-row gap-3">
            <div className=" field">
              <label htmlFor="name" className="font-bold">Rua</label>
              <InputText name="endereco.rua" value={selectCompany.endereco.rua} required readOnly />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Bairro</label>
              <InputText name="endereco.bairro" value={selectCompany.endereco.bairro} required readOnly />
            </div>
            <div className="field">
              <label htmlFor="name" className="font-bold">Numero</label>
              <InputText name="endereco.numero" value={selectCompany.endereco.numero}
                onChange={handleNumeroChange} required />
            </div>
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

      <Dialog visible={statusDialog} style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirme"
        modal footer={statusDialogFooter}
        onHide={hideStatusDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {selectCompany && (
            <span>
              Você tem certeza que deseja Aleterar o status de <b>{selectCompany.nomeFantasia}</b>?
            </span>
          )}
        </div>
      </Dialog>

    </div>
  );
};