import React, { useRef, useContext, useState } from 'react';
import { PersonContext } from '../../../../Contexts/PersonContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';

const UpdateDialog = (props) => {
    const { LinkCompany } = useAxios();
    const {
        setUpdateData,
        linkDialog,
        setLinkDialog,
        selectPerson,
        setSelectPerson
    } = useContext(PersonContext);
    const toast = useRef(null);
    const [companyId, setcompanyId] = useState(0);

    const Link = async () => {
        try {
            LinkCompany(selectPerson.id, companyId)
            setLinkDialog(false);
            toast.current.show({
                severity: 'success', summary: 'Successful',
                detail: 'Atualizado com Sucesso', life: 3000
            });
            await setUpdateData(true);
        } catch (error) {
            console.log('Erro ao vincular', error);
        }
    };

    const hideLinkDialog = () => {
        setLinkDialog(false);
        setSelectPerson();
    };

    const linkDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideLinkDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={Link} />
        </React.Fragment>
    );

    return (
        <div>
            <React.Fragment>
                <Toast ref={toast} />

                <Dialog visible={linkDialog} style={{ width: '32rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header="Confirme"
                    modal footer={linkDialogFooter}
                    onHide={hideLinkDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {selectPerson && (
                            <span>
                                Digite o ID da empresa que deseja vincular a <b>{selectPerson.nome}</b>?
                            </span>
                        )}
                    </div>
                    <h1> </h1>
                    <div className="field">
                        <label htmlFor="name" className="font-bold">ID da empresa</label>
                        <div className="p-inputgroup">
                            <InputNumber name="IdEmpresa" onValueChange={(e) => setcompanyId(e.value)} required />
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export default UpdateDialog;