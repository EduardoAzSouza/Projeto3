import React, { useRef, useContext } from 'react';
import { CompanyContext } from '../../../../Contexts/CompanyContext';
import { useAxios } from "../../../../hooks/useAxios";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const DeleteDialog = () => {

    const { DelCompany } = useAxios();
    const { deleteDialog,
        setDeleteDialog,
        setUpdateData,
        selectCompany,
        setSelectCompany } = useContext(CompanyContext);
    const toast = useRef(null);

    const deleteCompany = async () => {
        try {
            const peopleListVerify = await fetch(`https://localhost:7149/Empresa/TodasPessoasEmpresa/${selectCompany.id}`)
            const data = await peopleListVerify.json();
            const keys = Object.keys(data);
            
            if (keys.length === 0) {
                DelCompany(selectCompany.id)
                setDeleteDialog(false);
                setSelectCompany();
                toast.current.show({
                    severity: 'success', summary: 'Successful',
                    detail: 'Empresa Deletada', life: 3000
                });
                await setUpdateData(true);
            }
            else {
                setDeleteDialog(false);
                toast.current.show({
                    severity: 'error', summary: 'Error',
                    detail: 'Falha ao deletar empresa, deve haver pessoas cadastradas na empresa', life: 3000
                });
            }
        } catch (error) {
            console.log('Erro ao apagar empresa', error);
        }
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
        setSelectCompany();
    };

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteCompany} />
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
                        {selectCompany && (
                            <span>
                                Você tem certeza que deseja deletar <b>{selectCompany.nomeFantasia}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export default DeleteDialog;