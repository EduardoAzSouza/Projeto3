import React, { useRef, useContext } from 'react';
import { PersonContext } from '../../../../Contexts/PersonContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const DeleteDialog = () => {

    const { DelPerson } = useAxios();
    const { deleteDialog,
        setDeleteDialog,
        setUpdateData,
        selectPerson,
        setSelectPerson } = useContext(PersonContext);
    const toast = useRef(null);

    const deletePerson = async () => {
        DelPerson(selectPerson.id)
        setUpdateData(true);
        setDeleteDialog(false);
        setSelectPerson();
        toast.current.show({
            severity: 'success', summary: 'Successful',
            detail: 'Empresa Deletada', life: 3000
        });
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
        setSelectPerson();
    };

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletePerson} />
        </React.Fragment>
    );

    return (
        <div>
            <React.Fragment>
                <Toast ref={toast} />

                <Dialog visible={deleteDialog} style={{ width: '32rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header="Confirme"
                    modal footer={deleteDialogFooter}
                    onHide={hideDeleteDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {selectPerson && (
                            <span>
                                Você tem certeza que deseja deletar <b>{selectPerson.nome}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export default DeleteDialog;