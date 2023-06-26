import React, { useRef, useContext, useState } from 'react';
import { CompanyContext } from '../../../../Contexts/CompanyContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { classNames } from "primereact/utils";
import { Toast } from 'primereact/toast';

const CreateDialog = (props) => {
    const { CreateCompany } = useAxios();
    const {
        setUpdateData,
        createDialog,
        setCreateDialog,
        selectCompany,
        setSelectCompany
    } = useContext(CompanyContext);
    const toast = useRef(null);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setSelectCompany({
            ...selectCompany, [name]: value
        });
    }

    const handleNumberChange = (e) => {
        const numero = e.target.value;
        setSelectCompany(prevState => ({
            ...prevState,
            endereco: {
                ...prevState.endereco,
                numero: numero
            }
        }));
    };

    const register = async () => {
        // console.log(selectCompany);
        if (selectCompany.cnpj?.length === 14 && selectCompany.cnae?.length === 7 && selectCompany.endereco?.cep !== undefined) {
            CreateCompany(selectCompany)
            setUpdateData(true);
            setCreateDialog(false);
            setSelectCompany();
            toast.current.show({
                severity: 'success', summary: 'Successful',
                detail: 'Cadastrado com Sucesso', life: 3000
            });
        } else {
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Falha ao Cadastras revise os dados",
                life: 3000,
            });
            if(selectCompany.cnpj?.length !== 14 && selectCompany.cnpj !== undefined && selectCompany.cnpj !== ""){
                toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "CNPJ invalido",
                    life: 3000,
                });
            }
            if(selectCompany.cnae?.length !== 7 && selectCompany.cnae !== undefined && selectCompany.cnae !== ""){
                toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "CNAE invalido",
                    life: 3000,
                });
            }
            if(selectCompany.endereco?.cep === undefined &&
                 ((selectCompany.cnae !== undefined && selectCompany.cnpj !== "") 
                 || (selectCompany.cnpj !== undefined && selectCompany.cnae !== ""))){
                toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Endereço invalido",
                    life: 3000,
                });
            }
        }
    };

    const hideDialog = () => {
        setCreateDialog(false);
        toast.current.show({
            severity: "warn",
            summary: "Cancelado",
            detail: "O cadastro nâo foi finalizado",
            life: 3000,
        });
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Cadastrar" icon="pi pi-check" onClick={register} />
        </React.Fragment>
    );

    const CEP = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.ok) {
                const data = await response.json();
                const keys = Object.keys(data);
                if (keys.length > 1) {
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
                }else{
                    setSelectCompany({
                        ...selectCompany,
                        endereco: undefined
                    });
                    toast.current.show({
                        severity: "error",
                        summary: "Erro",
                        detail: "Cep não encontrado",
                        life: 3000,
                    });
                }
            } else {
                throw new Error('Erro na busca do endereço');
            }
        } catch (error) {
            console.log('Erro na busca do endereço:', error);
        }
    };

    return (
        <React.Fragment>
            <Toast ref={toast} />
            <Dialog modal className="p-fluid"
                header="Cadastrar nova Empresa"
                footer={dialogFooter}
                visible={createDialog}
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
                            <label htmlFor="name" className="font-bold">Nome Empresarial</label>
                            <InputText name="nomeEmpresarial" onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="name" className="font-bold">CNPJ</label>
                            <InputMask mask="99.999.999/9999-99" unmask name="cnpj" autoClear={false} onChange={handleChange} required className={classNames({
                                "p-invalid":
                                    (submitted && !selectCompany.cnpj) ||
                                    (submitted && selectCompany.cnpj.length < 14),
                            })} />
                            {submitted && !selectCompany.cnpj && (
                                <Message
                                    style={{
                                        background: "none",
                                        justifyContent: "start",
                                        padding: "5px",
                                    }}
                                    severity="error"
                                    text="CNPJ é obrigatorio"
                                />
                            )}
                            {submitted && selectCompany.cnpj.length < 14 && (
                                <Message
                                    style={{
                                        background: "none",
                                        justifyContent: "start",
                                        padding: "5px",
                                    }}
                                    severity="error"
                                    text="CNPJ tem 14 numeros."
                                />
                            )}
                        </div>
                    </div>
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="name" className="font-bold">CNAE</label>
                            <InputMask mask="9999-9/99" unmask name="cnae" autoClear={false} onChange={handleChange} required />
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
                            <InputMask mask="99/99/9999" name="dataAbertura" autoClear={false} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Telefone</label>
                            <InputMask mask="(99)99999-9999" unmask name="telefone" autoClear={false} onChange={handleChange} />
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
                            <InputMask mask="99.999-999" name="endereco.cep" onBlur={CEP} autoClear={false} required />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Estado</label>
                            <InputText name="endereco.estado" value={selectCompany?.endereco && selectCompany?.endereco.estado} disabled readOnly />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Cidade</label>
                            <InputText name="endereco.cidade" value={selectCompany?.endereco && selectCompany?.endereco.cidade} disabled readOnly />
                        </div>
                    </div>

                    <div className="card flex flex-column md:flex-row gap-3">
                        <div className=" field">
                            <label htmlFor="name" className="font-bold">Rua</label>
                            <InputText name="endereco.rua" value={selectCompany?.endereco && selectCompany?.endereco.rua} disabled readOnly />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Bairro</label>
                            <InputText name="endereco.bairro" value={selectCompany?.endereco && selectCompany?.endereco.bairro} disabled readOnly />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Numero</label>
                            <InputText name="endereco.numero" onChange={handleNumberChange} required />
                        </div>
                    </div>
                </div>

            </Dialog>
        </React.Fragment>
    );
};

export default CreateDialog;