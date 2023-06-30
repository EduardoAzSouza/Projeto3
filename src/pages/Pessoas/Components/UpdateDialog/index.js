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

const UpdateDialog = (props) => {
    const { UpdatePerson } = useAxios();
    const {
        setUpdateData,
        updateDialog,
        setUpdateDialog,
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

    const update = async () => {
        setSubmitted(true);
        try {
            if (selectPerson.documento?.length === 11
                && selectPerson.nome?.length >= 5
                && selectPerson.usuario?.length >= 3) {
                UpdatePerson(selectPerson)
                setUpdateDialog(false);
                setSubmitted(false);
                setSelectPerson();
                toast.current.show({
                    severity: 'success', summary: 'Successful',
                    detail: 'Atualizado com Sucesso', life: 3000
                });
                setUpdateData(true);
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Falha ao Atualizar revise os dados",
                    life: 3000,
                });
            }
        } catch (error) {
            console.log('Erro ao apagar', error);
        }
    };

    const hideUpdateDialog = () => {
        setSubmitted(false);
        setUpdateDialog(false);
        toast.current.show({
            severity: "warn",
            summary: "Cancelado",
            detail: "Cadastro não atualizado",
            life: 3000,
        });
    };

    const updateDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideUpdateDialog} />
            <Button label="Atualizar" icon="pi pi-check" onClick={update} />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Toast ref={toast} />
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
                            value={selectPerson && selectPerson.nome} onChange={handleChange} maxlength={80} className={classNames({
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
                        <InputMask mask="999.999.999-99" unmask name="documento"
                            value={selectPerson && selectPerson.documento} disabled />
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
                            onChange={handleChange} required className={classNames({
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

export default UpdateDialog;