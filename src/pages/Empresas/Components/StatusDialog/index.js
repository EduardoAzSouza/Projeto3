import React, { useRef, useContext } from 'react';
import { CompanyContext } from '../../../../Contexts/CompanyContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const StatusDialog = () => {

    const { StatusUpdateC } = useAxios();
    const { statusDialog,
        setStatusDialog,
        setUpdateData,
        selectCompany,
        setSelectCompany } = useContext(CompanyContext);
    const toast = useRef(null);

    const updateStatus = async () => {
        StatusUpdateC(selectCompany.id)
        setStatusDialog(false);
        setSelectCompany();
        toast.current.show({
            severity: 'success', summary: 'Ataulizado',
            detail: 'status Atualizado', life: 3000
        });
        setUpdateData(true);
    };

    const hideStatusDialog = () => {
        setStatusDialog(false);
        setSelectCompany();
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
                        {selectCompany && (
                            <span>
                                Você tem certeza que deseja Aleterar o status de <b>{selectCompany.nomeFantasia}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export default StatusDialog;