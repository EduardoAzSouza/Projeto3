import React, { useRef, useContext } from 'react';
import { CompanyContext } from '../../../../Contexts/CompanyContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
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
        UpdateCompany(selectCompany)
        setUpdateData(true);
        setUpdateDialog(false);
        toast.current.show({
            severity: 'success', summary: 'Successful',
            detail: 'Atualizado com Sucesso', life: 3000
        });
    };

    const hideUpdateDialog = () => {
        setUpdateDialog(false);
        toast.current.show({
            severity: 'warn', summary: 'Aviso',
            detail: 'Atualizado não salva', life: 3000
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
                    setSelectCompany(prevState => ({
                        ...prevState,
                        endereco: {
                            ...prevState.endereco,
                            cep: cep,
                            estado: data.uf,
                            cidade: data.localidade,
                            bairro: data.bairro,
                            rua: data.logradouro
                        }
                    }));
                }else{
                    toast.current.show({
                        severity: "error",
                        summary: "Erro",
                        detail: ("Cep não encontradoo, O Cep não será atualizado"),
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
                            <InputMask mask="99.999.999/9999-99" unmask name="cnpj" value={selectCompany && selectCompany.cnpj} readOnly />
                        </div>
                    </div>
                    <div className="p-fluid flex-1">
                        <div className="field">
                            <label htmlFor="name" className="font-bold">CNAE</label>
                            <InputMask mask="9999-9/99" unmask name="cnae" value={selectCompany && selectCompany.cnae}
                            autoClear={false} onChange={handleChange} required />
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
                            <InputMask mask="99/99/9999" name="dataAbertura" value={selectCompany && selectCompany.dataAbertura} readOnly />
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
                            onBlur={CEP} autoClear={false} required />
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
                            <InputText name="endereco.numero" value={selectCompany?.endereco && selectCompany?.endereco.numero} onChange={handleNumberChange} required />
                        </div>
                    </div>
                </div>
            </Dialog>

        </React.Fragment>
    );

};

export default UpdateDialog;