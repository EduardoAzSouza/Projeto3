import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';

import { Title, Text, Main, Buttons, SubTitle, Info, List, Horizon } from "../../components/styled";


const Home = () => {
    const navigate = useNavigate();

    return (
        <Main>
            <Horizon>
            
            <Card>
            <Title>3° Projeto (front-end)</Title>

            <Text>
                O 3° projeto (front-end) foi criado para consumir a API
                do 2° projeto criada em C# com intuido de ser um sistema
                de gestão de Pessoas e Empresas(CRUD).
            </Text>
            </Card>

            <Divider layout="vertical" />

            <Card>
            <SubTitle>Técnologias Utilizadas</SubTitle>

            <Info>
                <div>
                    <h2>Back-end</h2>
                    <List>
                        <li>C#</li>
                        <li>.NET</li>
                        <li>Entity Framework Core 6</li>
                        <li>AspNetCore</li>
                    </List>
                </div>
                <div>
                    <h2>Front-end</h2>
                    <List>
                        <li>Node.js</li>
                        <li>React</li>
                        <li>PrimeReact</li>
                        <li>Axios</li>
                        <li>React-Router-Dom</li>
                        <li>Stitches</li>
                    </List>
                </div>
            </Info>
            </Card>
            </Horizon>

            <Buttons >
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
        </Main>
    );
};

export default Home;