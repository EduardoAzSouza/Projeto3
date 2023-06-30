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

const UpdateDialog = (props) => {
    const { UpdateCompany } = useAxios();
    const {
        setUpdateData,
        updateDialog,
        setUpdateDialog,
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

    const update = async () => {
        setSubmitted(true);
        try {
            if (selectCompany.cnpj?.length === 14
                && selectCompany.cnae?.length === 7
                && selectCompany.nomeEmpresarial?.length >= 8
                && selectCompany.nomeFantasia?.length >= 8
                && selectCompany.endereco?.numero !== undefined
                && selectCompany.endereco?.cep !== undefined) {
                UpdateCompany(selectCompany)
                setUpdateDialog(false);
                setSubmitted(false);
                setSelectCompany();
                usetoast("success", "Sucesso", "Atualizado com Sucesso")
                setUpdateData(true);
            }else {
                usetoast("error", "Erro", "Falha ao Atualizar revise os dados")

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
            console.log('Erro ao atualizar dados', error);
        }

    };

    const usetoast = (severity, summary, detail) => {
        toast.current.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 3000,
        });
    };

    const hideUpdateDialog = () => {
        setUpdateDialog(false);
        toast.current.show({
            severity: 'warn', summary: 'Aviso',
            detail: 'Atualização não salva', life: 3000
        });
    };

    const updateDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideUpdateDialog} />
            <Button label="Atualizar" icon="pi pi-check" onClick={update} />
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
                                onChange={handleChange} required autoFocus maxlength={120} className={classNames({
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
                            <label htmlFor="name" className="font-bold">Nome Fantasia</label>
                            <InputText name="nomeEmpresarial" value={selectCompany && selectCompany.nomeEmpresarial}
                                onChange={handleChange} required maxlength={120} className={classNames({
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
                            <label htmlFor="name" className="font-bold">CNPJ</label>
                            <InputMask mask="99.999.999/9999-99" unmask name="cnpj" value={selectCompany && selectCompany.cnpj} disabled />
                        </div>
                    </div>
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="name" className="font-bold">CNAE</label>
                            <InputMask mask="9999-9/99" unmask name="cnae" value={selectCompany && selectCompany.cnae}
                                autoClear={false} onChange={handleChange} required className={classNames({
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
                            <label htmlFor="name" className="font-bold">Natureza Juridica</label>
                            <InputText name="naturezaJuridica" value={selectCompany && selectCompany.naturezaJuridica}
                                onChange={handleChange} required maxlength={50} className={classNames({
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
                            <label htmlFor="name" className="font-bold">Data de Abertura</label>
                            <InputMask mask="99/99/9999" name="dataAbertura" value={selectCompany && selectCompany.dataAbertura} />
                        </div>
                    </div>
                </div>

                <div className="card flex flex-column md:flex-row gap-3">
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Telefone</label>
                            <InputMask mask="(99)99999-9999" unmask name="telefone" value={selectCompany && selectCompany.telefone}
                                autoClear={false} onChange={handleChange} />
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
                            <InputMask mask="99.999-999" name="endereco.cep" value={selectCompany?.endereco && selectCompany?.endereco.cep}
                                onBlur={CEP} autoClear={false} required className={classNames({
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
                            <label htmlFor="name" className="font-bold">Estado</label>
                            <InputText name="endereco.estado" value={selectCompany?.endereco && selectCompany?.endereco.estado} required disabled />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Cidade</label>
                            <InputText name="endereco.cidade" value={selectCompany?.endereco && selectCompany?.endereco.cidade} required disabled />
                        </div>
                    </div>

                    <div className="card flex flex-column md:flex-row gap-3">
                        <div className=" field">
                            <label htmlFor="name" className="font-bold">Rua</label>
                            <InputText name="endereco.rua" value={selectCompany?.endereco && selectCompany?.endereco.rua} required disabled />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Bairro</label>
                            <InputText name="endereco.bairro" value={selectCompany?.endereco && selectCompany?.endereco.bairro} required disabled />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Numero</label>
                            <InputText name="endereco.numero" value={selectCompany?.endereco && selectCompany?.endereco.numero} onChange={handleNumberChange} required className={classNames({
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

export default UpdateDialog;