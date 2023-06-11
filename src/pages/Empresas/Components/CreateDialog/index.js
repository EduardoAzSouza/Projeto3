import React, { useRef, useContext } from 'react';
import { CompanyContext } from '../../../../Contexts/CompanyContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
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

    const handleChange = e => {
        const { name, value } = e.target;
        setSelectCompany({
            ...selectCompany, [name]: value
        });
        console.log(selectCompany);
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
        CreateCompany(selectCompany)
        setUpdateData(true);
        setCreateDialog(false);
        setSelectCompany();
        toast.current.show({
            severity: 'success', summary: 'Successful',
            detail: 'Cadastrado com Sucesso', life: 3000
        }); 
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
                            <InputText name="endereco.cep" onBlur={CEP} required />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Estado</label>
                            <InputText name="endereco.estado" value={selectCompany?.endereco && selectCompany?.endereco.estado} required readOnly />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Cidade</label>
                            <InputText name="endereco.cidade" value={selectCompany?.endereco && selectCompany?.endereco.cidade} required readOnly />
                        </div>
                    </div>

                    <div className="card flex flex-column md:flex-row gap-3">
                        <div className=" field">
                            <label htmlFor="name" className="font-bold">Rua</label>
                            <InputText name="endereco.rua" value={selectCompany?.endereco && selectCompany?.endereco.rua} required readOnly />
                        </div>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">Bairro</label>
                            <InputText name="endereco.bairro" value={selectCompany?.endereco && selectCompany?.endereco.bairro} required readOnly />
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