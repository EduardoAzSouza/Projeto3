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

const UpdateDialog = ({ companyValue, personValue }) => {
    const { data, GetAllCompanies, LinkCompany } = useAxios();
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
    const [linkedCompany, setlinkedCompany] = useState([]);

    useEffect(() => {
        if (updatecompanies) {
            GetAllCompanies();
            setupdatecompanies(false);
            company();
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

    const company = () => {
        const empresa = data.find(item => item.id === selectPerson.empresaId);
        setlinkedCompany(empresa)
    };

    const hideLinkDialog = () => {
        setLinkDialog(false);
        setSelectPerson();
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
                    <Dialog modal className="p-fluid"
                        header="empresa vinculada"
                        style={{ width: '50rem' }}
                        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                        visible={linkDialog}
                        onHide={hideLinkDialog}>
                        <div className="field">
                            <Button label="desvincular empresa" icon="pi pi-check" severity="danger" onClick={() => confirmUnlink()} />
                        </div>
                        <div className="card flex flex-column md:flex-row gap-3">
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Nome Fantasia</label>
                                    <InputText name="nomeFantasia" value={linkedCompany && linkedCompany.nomeFantasia} disabled />
                                </div>
                            </div>
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Nome Fantasia</label>
                                    <InputText name="nomeEmpresarial" value={linkedCompany && linkedCompany.nomeEmpresarial} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="card flex flex-column md:flex-row gap-3">
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">CNPJ</label>
                                    <InputMask mask="99.999.999/9999-99" unmask name="cnpj" value={linkedCompany && linkedCompany.cnpj} disabled />
                                </div>
                            </div>
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">CNAE</label>
                                    <InputMask mask="9999-9/99" unmask name="cnae" value={linkedCompany && linkedCompany.cnae} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="card flex flex-column md:flex-row gap-3">
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Natureza Juridica</label>
                                    <InputText name="naturezaJuridica" value={linkedCompany && linkedCompany.naturezaJuridica} disabled />
                                </div>
                            </div>
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Data de Abertura</label>
                                    <InputMask mask="99/99/9999" name="dataAbertura" value={linkedCompany && linkedCompany.dataAbertura} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="card flex flex-column md:flex-row gap-3">
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Telefone</label>
                                    <InputMask mask="(99)99999-9999" unmask name="telefone" value={linkedCompany && linkedCompany.telefone} disabled />
                                </div>
                            </div>
                            <div className="p-fluid flex-1">
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Capital</label>
                                    <InputNumber name="capital" value={linkedCompany && linkedCompany.capital} mode="currency" currency="BRL" locale="pt-BR" disabled />
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <h3>Endereço</h3>
                            <hr></hr>
                            <div className="card flex flex-column md:flex-row gap-3">
                                <div className=" field">
                                    <label htmlFor="name" className="font-bold">cep</label>
                                    <InputMask mask="99.999-999" name="endereco.cep" value={linkedCompany?.endereco && linkedCompany?.endereco.cep} disabled />
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Estado</label>
                                    <InputText name="endereco.estado" value={linkedCompany?.endereco && linkedCompany?.endereco.estado} disabled />
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Cidade</label>
                                    <InputText name="endereco.cidade" value={linkedCompany?.endereco && linkedCompany?.endereco.cidade} disabled />
                                </div>
                            </div>

                            <div className="card flex flex-column md:flex-row gap-3">
                                <div className=" field">
                                    <label htmlFor="name" className="font-bold">Rua</label>
                                    <InputText name="endereco.rua" value={linkedCompany?.endereco && linkedCompany?.endereco.rua} disabled />
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Bairro</label>
                                    <InputText name="endereco.bairro" value={linkedCompany?.endereco && linkedCompany?.endereco.bairro} disabled />
                                </div>
                                <div className="field">
                                    <label htmlFor="name" className="font-bold">Numero</label>
                                    <InputText name="endereco.numero" value={linkedCompany?.endereco && linkedCompany?.endereco.numero} disabled />
                                </div>
                            </div>
                        </div>
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
                                <b>{selectPerson.nome}</b> à <b>{linkedCompany?.nomeFantasia}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

            </React.Fragment>
        </div>
    );
};

export default UpdateDialog;