import React, { useRef, useContext, useState, useEffect } from 'react';
import { PersonContext } from '../../../../Contexts/PersonContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';

import { Data, View, } from '../../../../components/styled';

const UpdateDialog = ({ companyValue, personValue }) => {
    const { data, comp, GetAllCompanies, LinkCompany, GetCompany } = useAxios();
    const {
        setUpdateData,
        linkDialog,
        setLinkDialog,
        selectPerson,
        setSelectPerson,
        updatecompanies,
        setupdatecompanies
    } = useContext(PersonContext);
    const toast = useRef(null);

    const [confirmLinkDialog, setConfirmLinkDialog] = useState(false);
    const [confirmUnlinkDialog, setConfirmUnlinkDialog] = useState(false);
    const [selectCompany, setselectCompany] = useState([]);
    console.log(comp)
    useEffect(() => {
        if (updatecompanies) {
            GetAllCompanies();
            if (selectPerson.empresaId !== null) {
                GetCompany(selectPerson.empresaId)
            }
            setupdatecompanies(false);
        }
    });


    const Link = async () => {
        try {
            LinkCompany(selectPerson.id, selectCompany.id)
            setLinkDialog(false);
            setConfirmLinkDialog(false);
            toast.current.show({
                severity: 'success', summary: 'Successful',
                detail: 'Atualizado com Sucesso', life: 3000
            });
            await setUpdateData(true);
        } catch (error) {
            console.log('Erro ao vincular', error);
        }
    };

    const unLink = async () => {
        try {
            LinkCompany(selectPerson.id, 0)
            setLinkDialog(false);
            setConfirmUnlinkDialog(false);
            toast.current.show({
                severity: 'success', summary: 'Successful',
                detail: 'Desvinculado com Sucesso', life: 3000
            });
            await setUpdateData(true);
        } catch (error) {
            console.log('Erro ao desvincular', error);
        }
    };

    const hideLinkDialog = () => {
        setLinkDialog(false);
    };

    const hideConfirmLinkDialog = () => {
        setConfirmLinkDialog(false);
    };

    const hideConfirmUnlinkDialog = () => {
        setConfirmUnlinkDialog(false);
    };

    const cnpjformat = (rowData) => {
        return rowData.cnpj?.replace(/\D/g, '')
            .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5");
    };

    const cnpjformatD = (rowData) => {
        if(rowData){
            return rowData.toString().replace(/\D/g, '')
            .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5");
        }
    };

    const capitalformat = (rowData) => {
        if(rowData){
            return rowData.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } 
    };

    const cnaeformat = (rowData) => {
        if(rowData){
            return rowData.toString().replace(/\D/g, '').replace(/(\d{4})(\d{1})(\d{2})/, "$1-$2/$3");
        }
    };

    const telformat = (rowData) => {
        if(rowData){
            return rowData.toString().replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");
        }
    };

    const confirmLink = (selectCompany) => {
        setselectCompany(selectCompany)
        setConfirmLinkDialog(true);
    };

    const confirmUnlink = () => {
        setConfirmUnlinkDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-plus"
                    size="large"
                    className="p-button-rounded"
                    disabled={rowData.status !== "Ativo"}
                    onClick={() => (confirmLink(rowData))}
                ></Button>
            </React.Fragment>
        );
    };

    const confirmLinkFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideConfirmLinkDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={() => Link()} />
        </React.Fragment>
    );

    const confirmUnlinkFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideConfirmUnlinkDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={() => unLink()} />
        </React.Fragment>
    );

    return (
        <div>
            <React.Fragment>
                <Toast ref={toast} />
                {selectPerson?.empresaId != null ? (
                    <Dialog modal
                        header="empresa vinculada"
                        style={{ width: '50rem' }}
                        visible={linkDialog}
                        onHide={hideLinkDialog}>
                        <div className="flex flex-wrap justify-content-end">
                            <Button label="desvincular empresa" icon="pi pi-times" 
                            severity="danger" onClick={() => confirmUnlink()} />
                        </div>
                        <Data>
                            <View>
                                <div >
                                    <label className="font-bold">Nome Fantasia</label>
                                    <span>{comp.nomeFantasia}</span>
                                </div>
                                <div >
                                    <label className="font-bold">Nome Empresarial</label>
                                    <span>{comp.nomeEmpresarial}</span>
                                </div>
                                <div >
                                    <label className="font-bold">CNPJ</label>
                                    <span>{cnpjformatD(comp.cnpj)}</span>
                                </div>
                                <div >
                                    <label className="font-bold">CNAE</label>
                                    <span>{cnaeformat(comp.cnae)}</span>
                                </div>
                                <div >
                                    <label className="font-bold">Natureza Juridica</label>
                                    <span>{comp.naturezaJuridica}</span>
                                </div>
                                <div >
                                    <label className="font-bold">Telefone</label>
                                    <span>{telformat(comp.telefone)}</span>
                                </div>
                                <div >
                                    <label className="font-bold">Data de Abertura</label>
                                    <span>{comp.dataAbertura}</span>
                                </div>
                                <div >
                                    <label className="font-bold">Capital</label>
                                    <span>{capitalformat(comp.capital)}</span>
                                </div>
                                <div >
                                    <label className="font-bold">Endereço</label>
                                    <span>{comp?.endereco?.rua} {comp?.endereco?.numero}, {comp?.endereco?.bairro} </span>
                                </div>
                                <div >
                                    <label className="font-bold">Cidade</label>
                                    <span>{comp?.endereco?.cidade} - {comp?.endereco?.estado} {comp?.endereco?.cep} </span>
                                </div>
                            </View>
                        </Data>
                        {/* <div className="card flex flex-column md:flex-row gap-3">
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Nome Fantasia</label>
                                    <InputText name="nomeFantasia" value={comp && comp.nomeFantasia} disabled />
                                </div>
                            </div>
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Nome Fantasia</label>
                                    <InputText name="nomeEmpresarial" value={comp && comp.nomeEmpresarial} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="card flex flex-column md:flex-row gap-3">
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">CNPJ</label>
                                    <InputMask mask="99.999.999/9999-99" unmask name="cnpj" value={comp && comp.cnpj} disabled />
                                </div>
                            </div>
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">CNAE</label>
                                    <InputMask mask="9999-9/99" unmask name="cnae" value={comp && comp.cnae} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="card flex flex-column md:flex-row gap-3">
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Natureza Juridica</label>
                                    <InputText name="naturezaJuridica" value={comp && comp.naturezaJuridica} disabled />
                                </div>
                            </div>
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Data de Abertura</label>
                                    <InputMask mask="99/99/9999" name="dataAbertura" value={comp && comp.dataAbertura} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="card flex flex-column md:flex-row gap-3">
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Telefone</label>
                                    <InputMask mask="(99)99999-9999" unmask name="telefone" value={comp && comp.telefone} disabled />
                                </div>
                            </div>
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Capital</label>
                                    <InputNumber name="capital" value={comp && comp.capital} mode="currency" currency="BRL" locale="pt-BR" disabled />
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <h3>Endereço</h3>
                            <hr></hr>
                            <div className="card flex flex-column md:flex-row gap-3">
                                <div className=" field">
                                    <label htmlFor="name" className="font-bold">cep</label>
                                    <InputMask mask="99.999-999" name="endereco.cep" value={comp?.endereco && comp?.endereco.cep} disabled />
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Estado</label>
                                    <InputText name="endereco.estado" value={comp?.endereco && comp?.endereco.estado} disabled />
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Cidade</label>
                                    <InputText name="endereco.cidade" value={comp?.endereco && comp?.endereco.cidade} disabled />
                                </div>
                            </div>

                            <div className="card flex flex-column md:flex-row gap-3">
                                <div className=" field">
                                    <label htmlFor="name" className="font-bold">Rua</label>
                                    <InputText name="endereco.rua" value={comp?.endereco && comp?.endereco.rua} disabled />
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Bairro</label>
                                    <InputText name="endereco.bairro" value={comp?.endereco && comp?.endereco.bairro} disabled />
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Numero</label>
                                    <InputText name="endereco.numero" value={comp?.endereco && comp?.endereco.numero} disabled />
                                </div>
                            </div>
                        </div> */}
                    </Dialog>
                ) : (
                    <Dialog visible={linkDialog} style={{ width: '50rem' }}
                        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                        header="Selecione a Empresa que deseja vincular"
                        onHide={hideLinkDialog}>
                        <div className="card">
                            <DataTable value={data}>
                                <Column field="nomeFantasia" header="nomeFantasia" sortable></Column>
                                <Column field="cnpj" sortable body={cnpjformat} header="cnpj"></Column>
                                <Column body={actionBodyTemplate} exportable={false} style={{ maxWidth: '3rem' }}></Column>
                            </DataTable>
                        </div>
                    </Dialog>
                )}

                <Dialog visible={confirmLinkDialog} style={{ width: '32rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header="Confirme"
                    modal footer={confirmLinkFooter}
                    onHide={hideConfirmLinkDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {selectPerson && (
                            <span>
                                Você tem certeza que deseja vincular<br></br>
                                <b>{selectPerson.nome}</b> à <b>{selectCompany.nomeFantasia}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={confirmUnlinkDialog} style={{ width: '32rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header="Confirme"
                    modal footer={confirmUnlinkFooter}
                    onHide={hideConfirmUnlinkDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {selectPerson && (
                            <span>
                                Você tem certeza que deseja desvincular<br></br>
                                <b>{selectPerson.nome}</b> à <b>{comp?.nomeFantasia}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

            </React.Fragment>
        </div>
    );
};

export default UpdateDialog;