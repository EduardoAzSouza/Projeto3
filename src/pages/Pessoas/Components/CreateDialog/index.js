import React, { useRef, useContext, useState } from 'react';
import { PersonContext } from '../../../../Contexts/PersonContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { classNames } from "primereact/utils";
import { Toast } from 'primereact/toast';

const CreateDialog = (props) => {
    const { CreatePerson } = useAxios();
    const {
        setUpdateData,
        createDialog,
        setCreateDialog,
        selectPerson,
        setSelectPerson
    } = useContext(PersonContext);
    const toast = useRef(null);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setSelectPerson({
            ...selectPerson, [name]: value
        });
        console.log(selectPerson);
    }

    const register = async () => {
        setSubmitted(true);
        try {
            console.log(selectPerson);
            if (selectPerson.documento?.length === 11
                && selectPerson.nome?.length >= 5
                && selectPerson.usuario?.length >= 3
                && selectPerson.telefone?.length === 11) {
                CreatePerson(selectPerson)
                setCreateDialog(false);
                setSubmitted(false);
                setSelectPerson();
                toast.current.show({
                    severity: 'success', summary: 'Successful',
                    detail: 'Cadastrado com Sucesso', life: 3000
                });
                setUpdateData(true);
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Falha ao Cadastras revise os dados",
                    life: 3000,
                });
            }
        } catch (error) {
            console.log('Erro ao apagar', error);
        }

    };

    const hideDialog = () => {
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

    return (
        <React.Fragment>
            <Toast ref={toast} />
            <Dialog modal className="p-fluid"
                header="Cadastrar nova Pessoa"
                footer={dialogFooter}
                visible={createDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Nome</label>
                    <div className="p-inputgroup">
                        <InputText name="nome" placeholder="Nome" onChange={handleChange} required autoFocus maxlength={80} className={classNames({
                            "p-invalid":
                                (submitted && !selectPerson.nome)
                        })} />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-language"></i>
                        </span>
                    </div>
                    {submitted && !selectPerson.nome && (
                        <Message
                            style={{
                                background: "none",
                                justifyContent: "start",
                                padding: "5px",
                            }}
                            severity="error"
                            text="nome é obrigatorio"
                        />
                    )}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">CPF</label>
                    <div className="p-inputgroup">
                        <InputMask mask="999.999.999-99" unmask placeholder="999.999.999-99"
                            autoClear={false} name="documento" onChange={handleChange} required className={classNames({
                                "p-invalid":
                                    (submitted && !selectPerson.documento) ||
                                    (submitted && selectPerson.documento?.length < 11)
                            })} />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-id-card"></i>
                        </span>
                    </div>
                    {submitted && !selectPerson.documento && (
                        <Message
                            style={{
                                background: "none",
                                justifyContent: "start",
                                padding: "5px",
                            }}
                            severity="error"
                            text="CPF é obrigatorio"
                        />
                    )}
                    {submitted && selectPerson.documento?.length < 11 && (
                        <Message
                            style={{
                                background: "none",
                                justifyContent: "start",
                                padding: "5px",
                            }}
                            severity="error"
                            text="CPF precisa de 11 numeros."
                        />
                    )}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Telefone</label>
                    <div className="p-inputgroup">
                        <InputMask mask="(99)99999-9999" unmask placeholder="(99)99999-9999"
                            autoClear={false} name="telefone" onChange={handleChange} className={classNames({
                                "p-invalid":
                                    (submitted && !selectPerson.telefone) ||
                                    (submitted && selectPerson.telefone?.length < 11)
                            })} />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-phone"></i>
                        </span>
                    </div>
                    {submitted && !selectPerson.telefone && (
                        <Message
                            style={{
                                background: "none",
                                justifyContent: "start",
                                padding: "5px",
                            }}
                            severity="error"
                            text="Telefone é obrigatorio"
                        />
                    )}
                    {submitted && selectPerson.telefone?.length < 11 && (
                        <Message
                            style={{
                                background: "none",
                                justifyContent: "start",
                                padding: "5px",
                            }}
                            severity="error"
                            text="Telefone precisa de 11 numeros."
                        />
                    )}
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Usuario</label>
                    <div className="p-inputgroup">
                        <InputText placeholder="Usuario" name="usuario" onChange={handleChange} required className={classNames({
                            "p-invalid":
                                (submitted && !selectPerson.usuario)
                        })} />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                    </div>
                    {submitted && !selectPerson.usuario && (
                        <Message
                            style={{
                                background: "none",
                                justifyContent: "start",
                                padding: "5px",
                            }}
                            severity="error"
                            text="usuario é obrigatorio"
                        />
                    )}
                </div>
            </Dialog>
        </React.Fragment>
    );
};

export default CreateDialog;