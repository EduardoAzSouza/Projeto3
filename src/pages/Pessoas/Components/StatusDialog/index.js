import React, { useRef, useContext } from 'react';
import { PersonContext } from '../../../../Contexts/PersonContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const StatusDialog = () => {

    const { StatusUpdateP } = useAxios();
    const { statusDialog,
        setStatusDialog,
        setUpdateData,
        selectPerson,
        setSelectPerson } = useContext(PersonContext);
    const toast = useRef(null);

    const updateStatus = async () => {
        StatusUpdateP(selectPerson.id)
        setStatusDialog(false);
        setSelectPerson();
        toast.current.show({
            severity: 'success', summary: 'Ataulizado',
            detail: 'status Atualizado', life: 3000
        });
        setUpdateData(true);
    };

    const hideStatusDialog = () => {
        setStatusDialog(false);
        setSelectPerson();
    };

    const statusDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideStatusDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={updateStatus} />
        </React.Fragment>
    );

    return (
        <div>
            <React.Fragment>
                <Toast ref={toast} />
                <Dialog visible={statusDialog} style={{ width: '32rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header="Confirme"
                    modal footer={statusDialogFooter}
                    onHide={hideStatusDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {setSelectPerson && (
                            <span>
                                Você tem certeza que deseja Aleterar o status de <b>{setSelectPerson.nome}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export default StatusDialog;