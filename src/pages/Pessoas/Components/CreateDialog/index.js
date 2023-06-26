import React, { useRef, useContext } from 'react';
import { PersonContext } from '../../../../Contexts/PersonContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
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

    const handleChange = e => {
        const { name, value } = e.target;
        setSelectPerson({
            ...selectPerson, [name]: value
        });
        console.log(selectPerson);
    }

    const register = async () => {
        console.log(selectPerson);
        if (selectPerson.documento?.length === 11) {
            CreatePerson(selectPerson)
            setUpdateData(true);
            setCreateDialog(false);
            setSelectPerson();
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
        }

    };

    const hideDialog = () => {
        setCreateDialog(false);
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
                        <InputText name="nome" placeholder="Nome" onChange={handleChange} required autoFocus />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-language"></i>
                        </span>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">CPF</label>
                    <div className="p-inputgroup">
                        <InputMask mask="999.999.999-99" unmask placeholder="999.999.999-99"
                        autoClear={false} name="documento" onChange={handleChange} required />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-id-card"></i>
                        </span>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="name" className="font-bold">Telefone</label>
                    <div className="p-inputgroup">
                        <InputMask mask="(99)99999-9999" unmask placeholder="(99)99999-9999"
                        autoClear={false} name="telefone" onChange={handleChange} />
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
        </React.Fragment>
    );
};

export default CreateDialog;