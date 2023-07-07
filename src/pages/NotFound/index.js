import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import { Title, Main, Buttons } from "../../components/styled";

const NotFound = () => {
    const navigate = useNavigate();

    const header = (
        <Title>Desculpe</Title>
    );
    

    return (
        <Main>
            <Card title="Página não encontrada" subTitle="Tente algumas dessas opções:" 
            header={header} className="w-full h-30rem text-center">

            <div className="flex flex-wrap justify-content-center">
            <Buttons>
                <Button
                    size="large"
                    label="Empresas"
                    icon="pi pi-building"
                    onClick={() => navigate("/empresas")}
                />
                <Button
                    size="large"
                    label="Pessoas"
                    icon="pi pi-users"
                    onClick={() => navigate("/pessoas")}
                />
            </Buttons>
            </div>
            </Card>
        </Main>
    );
};

export default NotFound;