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

    const usetoast = (severity, summary, detail) => {
        toast.current.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 3000,
        });
    };

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
        setSubmitted(true);

        try {
            const CNPJVerify = await fetch(`https://localhost:7149/Empresa/BuscarPorCnpj/${selectCompany.cnpj}`)
            if (selectCompany.cnpj?.length === 14
                && selectCompany.cnae?.length === 7
                && selectCompany.nomeEmpresarial?.length >= 8
                && selectCompany.nomeFantasia?.length >= 8
                && selectCompany.endereco?.numero !== undefined
                && selectCompany.endereco?.cep !== undefined
                && CNPJVerify.status === 404) {
                CreateCompany(selectCompany)
                setCreateDialog(false);
                setSubmitted(false);
                setSelectCompany();
                usetoast("success", "Sucesso", "Cadastrado com Sucesso")
                setUpdateData(true);
            } else {
                usetoast("error", "Erro", "Falha ao Cadastras revise os dados")

                if (selectCompany.cnpj?.length !== 14 && selectCompany.cnpj !== undefined && selectCompany.cnpj !== "") {
                    usetoast("error", "Erro", "CNPJ invalido")
                }
                if (selectCompany.cnae?.length !== 7 && selectCompany.cnae !== undefined && selectCompany.cnae !== "") {
                    usetoast("error", "Erro", "CNAE invalido")
                }
                if (selectCompany.endereco?.cep === undefined &&
                    ((selectCompany.cnae !== undefined && selectCompany.cnpj !== "")
                        || (selectCompany.cnpj !== undefined && selectCompany.cnae !== ""))) {
                    usetoast("error", "Erro", "Endereço invalido")
                }
            }
        } catch (error) {
            console.log('Erro ao cadastrar empresa', error);
        }

    };

    const hideDialog = () => {
        setSelectCompany();
        setSubmitted(false);
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
                    usetoast("success", "Sucesso", "Cep encontrado")
                } else {
                    setSelectCompany({
                        ...selectCompany,
                        endereco: undefined
                    });
                    usetoast("error", "Erro", "Cep não encontrado")
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
                            <label htmlFor="nomeFantasia" className="font-bold">Nome Fantasia</label>
                            <InputText name="nomeFantasia" onChange={handleChange} autoFocus required maxlength={120} className={classNames({
                                "p-invalid":
                                    (submitted && !selectCompany.nomeFantasia)
                            })} />
                            {submitted && !selectCompany.nomeFantasia && (
                                <Message
                                    style={{
                                        background: "none",
                                        justifyContent: "start",
                                        padding: "5px",
                                    }}
                                    severity="error"
                                    text="Nome Fantasia é obrigatorio"
                                />
                            )}
                        </div>
                    </div>
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="nomeEmpresarial" className="font-bold">Nome Empresarial</label>
                            <InputText name="nomeEmpresarial" onChange={handleChange} required maxlength={120} className={classNames({
                                "p-invalid":
                                    (submitted && !selectCompany.nomeEmpresarial)
                            })} />
                            {submitted && !selectCompany.nomeEmpresarial && (
                                <Message
                                    style={{
                                        background: "none",
                                        justifyContent: "start",
                                        padding: "5px",
                                    }}
                                    severity="error"
                                    text="Nome Empresarial é obrigatorio"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="cnpj" className="font-bold">CNPJ</label>
                            <InputMask mask="99.999.999/9999-99" unmask name="cnpj" autoClear={false} onChange={handleChange} required className={classNames({
                                "p-invalid":
                                    (submitted && !selectCompany.cnpj) ||
                                    (submitted && selectCompany.cnpj?.length < 14)
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
                            {submitted && selectCompany.cnpj?.length < 14 && (
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
                            <label htmlFor="cnae" className="font-bold">CNAE</label>
                            <InputMask mask="9999-9/99" unmask name="cnae" autoClear={false} onChange={handleChange} required className={classNames({
                                "p-invalid":
                                    (submitted && !selectCompany.cnae) ||
                                    (submitted && selectCompany.cnae?.length < 7)
                            })} />
                            {submitted && !selectCompany.cnae && (
                                <Message
                                    style={{
                                        background: "none",
                                        justifyContent: "start",
                                        padding: "5px",
                                    }}
                                    severity="error"
                                    text="CNAE é obrigatorio"
                                />
                            )}
                            {submitted && selectCompany.cnae?.length < 7 && (
                                <Message
                                    style={{
                                        background: "none",
                                        justifyContent: "start",
                                        padding: "5px",
                                    }}
                                    severity="error"
                                    text="CNAE tem 7 numeros."
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="naturezaJuridica" className="font-bold">Natureza Juridica</label>
                            <InputText name="naturezaJuridica" onChange={handleChange} required maxlength={50} className={classNames({
                                "p-invalid":
                                    (submitted && !selectCompany.naturezaJuridica)
                            })} />
                            {submitted && !selectCompany.naturezaJuridica && (
                                <Message
                                    style={{
                                        background: "none",
                                        justifyContent: "start",
                                        padding: "5px",
                                    }}
                                    severity="error"
                                    text="Natureza Juridica é obrigatorio"
                                />
                            )}
                        </div>
                    </div>
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="dataAbertura" className="font-bold">Data de Abertura</label>
                            <InputMask mask="99/99/9999" name="dataAbertura" autoClear={false} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="telefone" className="font-bold">Telefone</label>
                            <InputMask mask="(99)99999-9999" unmask name="telefone" autoClear={false} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="capital" className="font-bold">Capital</label>
                            <InputNumber name="capital" onValueChange={handleChange} mode="currency" currency="BRL" locale="pt-BR" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3>Endereço</h3>
                    <hr></hr>
                    <div className="card flex flex-column md:flex-row gap-3">
                        <div className=" field">
                            <label htmlFor="cep" className="font-bold">cep</label>
                            <InputMask mask="99.999-999" name="endereco.cep" onBlur={CEP} autoClear={false} required className={classNames({
                                "p-invalid":
                                    (submitted && selectCompany.endereco?.cep === undefined)
                            })} />
                            {submitted && !selectCompany.endereco && (
                                <Message
                                    style={{
                                        background: "none",
                                        justifyContent: "start",
                                        padding: "5px",
                                    }}
                                    severity="error"
                                    text="CEP não encontrado"
                                />
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="estado" className="font-bold">Estado</label>
                            <InputText name="endereco.estado" value={selectCompany?.endereco && selectCompany?.endereco.estado} disabled readOnly />
                        </div>
                        <div className="field">
                            <label htmlFor="cidade" className="font-bold">Cidade</label>
                            <InputText name="endereco.cidade" value={selectCompany?.endereco && selectCompany?.endereco.cidade} disabled readOnly />
                        </div>
                    </div>

                    <div className="card flex flex-column md:flex-row gap-3">
                        <div className=" field">
                            <label htmlFor="rua" className="font-bold">Rua</label>
                            <InputText name="endereco.rua" value={selectCompany?.endereco && selectCompany?.endereco.rua} disabled readOnly />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Bairro</label>
                            <InputText name="endereco.bairro" value={selectCompany?.endereco && selectCompany?.endereco.bairro} disabled readOnly />
                        </div>
                        <div className="field">
                            <label htmlFor="numero" className="font-bold">Numero</label>
                            <InputText name="endereco.numero" onChange={handleNumberChange} required className={classNames({
                                "p-invalid": submitted && !selectCompany.endereco?.numero
                            })} />
                            {submitted && !selectCompany.endereco?.numero && (
                                <Message
                                    style={{
                                        background: "none",
                                        justifyContent: "start",
                                        padding: "5px",
                                    }}
                                    severity="error"
                                    text="Numero é obrigatório."
                                />
                            )}
                        </div>
                    </div>
                </div>

            </Dialog>
        </React.Fragment>
    );
};

export default CreateDialog;