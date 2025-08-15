import React from "react";
import { Button, List, Flex, Select, ConfigProvider, message, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Container, Frame, Info, Title, Text, Description, Selection, SelectContainer} from './style';
import { useState, useEffect } from 'react';
import api from '../../Services/api';

import {default as CustomButton} from "../../Components/Button";
import NavBar from '../../Components/NavBar';
import ViewModal from '../../Components/ViewModal';
import EditModal from "../../Components/EditModal";
import AddModal from "../../Components/AddModal/AddModal";

function Equipes() {
    const [fetchedTeams, setFetchedTeams] = useState([]);
    const [equipes, setEquipes] = useState([]);
    const [filtroEquipes, setfiltroEquipes] = useState(0);
    const [displayViewModal, setDisplayViewModal] = useState(false);
    const [displayAddModal, setDisplayAddModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState(false);
    const [equipeSelecionada, setEquipeSelecionada] = useState([]);
    const [abrirConfirmacaoId, setAbrirConfirmacaoId] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const displayMessage = (type, content) => {
        messageApi.open({
            type: type,
            content: content,
        });
    };

    // Fetch das equipes
    const listarEquipes = async (e) => {
        let response;
        try {
            if (e == -1) {
                response = await api.get("/equipe");
            } else {
                response = await api.get("/equipe", { params: {categoria: e} });
            }
            console.log(e);
            setEquipes(response.data);
        } catch (error) {
            
        }
    }

    useEffect(() => {
        listarEquipes();
    }, []);
    
    useEffect(() => {
        listarEquipes(filtroEquipes - 1);
    }, [filtroEquipes]);

    // Handle modal close functions
    const closeViewModal = () => {
        setDisplayViewModal(false);
    }

    const closeEditModal = () => {
        setDisplayEditModal(false);
        listarEquipes(filtroEquipes - 1);
    }

    const closeAddModal = () => {
        listarEquipes(filtroEquipes - 1)
        setDisplayAddModal(false);
    }

     const confirmarDelete = async () => {
        setConfirmLoading(true);
        try {
        await api.delete(`/equipe/${equipeSelecionada.id}`);
        message.success('Equipe deletada com sucesso!');
        setAbrirConfirmacaoId(null);
        listarEquipes(filtroEquipes - 1);
        } catch (error) {
        message.error('Erro ao deletar equipe.');
        } finally {
        setConfirmLoading(false);
        }
    };

    const cancelarDelete = () => {
        setAbrirConfirmacaoId(null);
    };

    // Theme configurations for antd components
    const antdTheme = {
    componets: {
        List: {
        colorText: "rgba(1,1,1,1)"
        },
    },
    };

    return (
    <ConfigProvider theme={antdTheme}>
        {contextHolder}
        <Container>
        <NavBar/>
        <Frame>
            <Title>
            <Text>Equipes</Text>  
            <CustomButton type={"Add"} text={"Adicionar"} onClick={() => {setDisplayAddModal(!displayAddModal)}}/>
            </Title>

            <SelectContainer>
            <Text>Categoria:</Text>
            <Selection
                placeholder="Selecionar"
                onChange={value => setfiltroEquipes(value)}
                defaultValue={0}
            >
                <Select.Option value={0}>Todas</Select.Option>
                <Select.Option value={1}>Avançada</Select.Option>
                <Select.Option value={2}>Mirim</Select.Option>
                <Select.Option value={3}>Sumô</Select.Option>
            </Selection>
            </SelectContainer>

            <List
                itemLayout="horizontal"
                dataSource={equipes}
                renderItem={(item, index) => (
                <List.Item actions={[
                    <Button type='text' onClick={() => {setDisplayViewModal(!displayViewModal); setEquipeSelecionada(item);}} icon={
                    <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.66 22.1141L19.7915 17.2464C19.5717 17.0267 19.2739 16.9046 18.9613 16.9046H18.1654C19.5131 15.1812 20.314 13.0134 20.314 10.6553C20.314 5.04545 15.7678 0.5 10.157 0.5C4.54623 0.5 0 5.04545 0 10.6553C0 16.2651 4.54623 20.8105 10.157 20.8105C12.5156 20.8105 14.6837 20.0098 16.4074 18.6623V19.4581C16.4074 19.7706 16.5295 20.0684 16.7493 20.2881L21.6178 25.1558C22.0768 25.6147 22.8191 25.6147 23.2732 25.1558L24.6551 23.7741C25.1141 23.3152 25.1141 22.573 24.66 22.1141ZM10.157 16.9046C6.70459 16.9046 3.90654 14.112 3.90654 10.6553C3.90654 7.20345 6.69971 4.40587 10.157 4.40587C13.6094 4.40587 16.4074 7.19856 16.4074 10.6553C16.4074 14.1071 13.6143 16.9046 10.157 16.9046Z" fill="#EDA500"/></svg>
                    }>
                    </Button>,
                    <Button type='text' onClick={() => {setDisplayEditModal(!displayEditModal); setEquipeSelecionada(item);}} icon={             
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.4706 4.76669L21.2727 9.17185C21.4329 9.35743 21.4329 9.66023 21.2727 9.84581L12.0666 20.512L8.15488 21.015C7.63219 21.0834 7.18959 20.5706 7.2486 19.965L7.68277 15.4328L16.8889 4.76669C17.049 4.58111 17.3104 4.58111 17.4706 4.76669ZM24.2993 3.64831L22.2422 1.26503C21.6015 0.522699 20.5603 0.522699 19.9154 1.26503L18.4232 2.99389C18.263 3.17947 18.263 3.48226 18.4232 3.66785L22.2254 8.073C22.3855 8.25858 22.6469 8.25858 22.8071 8.073L24.2993 6.34415C24.94 5.59693 24.94 4.39064 24.2993 3.64831ZM16.6865 17.611V22.5827H3.19775V6.95462H12.8844C13.0193 6.95462 13.1457 6.89113 13.2427 6.78369L14.9288 4.83018C15.2491 4.45902 15.0215 3.82901 14.5705 3.82901H2.52332C1.40628 3.82901 0.5 4.87902 0.5 6.17322V23.3641C0.5 24.6583 1.40628 25.7083 2.52332 25.7083H17.361C18.478 25.7083 19.3843 24.6583 19.3843 23.3641V15.6575C19.3843 15.1349 18.8405 14.8761 18.5202 15.2424L16.8341 17.1959C16.7413 17.3082 16.6865 17.4547 16.6865 17.611Z" fill="#EDA500"/></svg>
                    }>
                    </Button>,
                    <Popconfirm title="Deletar equipe" description="Realmente deseja deletar a equipe?" okText="Sim" cancelText="Não" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} open={abrirConfirmacaoId === item.id} onConfirm={confirmarDelete} okButtonProps={{ loading: confirmLoading }} onCancel={cancelarDelete}>
                        <Button type='text' onClick={() => { setEquipeSelecionada(item); setAbrirConfirmacaoId(item.id); }} icon={             
                            <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.0347 1.56251H15.1917L14.734 0.649422C14.637 0.454214 14.4877 0.29001 14.3028 0.175281C14.1178 0.0605526 13.9046 -0.00014785 13.6871 8.56089e-06H8.12172C7.90474 -0.000827891 7.69191 0.0596462 7.50762 0.174502C7.32334 0.289359 7.17504 0.453951 7.07972 0.649422L6.62202 1.56251H0.779062C0.572442 1.56251 0.374284 1.64482 0.228182 1.79133C0.0820795 1.93784 0 2.13656 0 2.34376L0 3.90626C0 4.11346 0.0820795 4.31217 0.228182 4.45868C0.374284 4.6052 0.572442 4.68751 0.779062 4.68751H21.0347C21.2413 4.68751 21.4394 4.6052 21.5855 4.45868C21.7316 4.31217 21.8137 4.11346 21.8137 3.90626V2.34376C21.8137 2.13656 21.7316 1.93784 21.5855 1.79133C21.4394 1.64482 21.2413 1.56251 21.0347 1.56251ZM2.59038 22.8027C2.62754 23.3978 2.88942 23.9562 3.32273 24.3644C3.75603 24.7726 4.32817 24.9999 4.9227 25H16.891C17.4856 24.9999 18.0577 24.7726 18.491 24.3644C18.9243 23.9562 19.1862 23.3978 19.2233 22.8027L20.2556 6.25001H1.55812L2.59038 22.8027Z" fill="#EDA500"/></svg>
                        }>
                        </Button>
                    </Popconfirm>
                ]} style = {{  
                    padding: 0,
                    marginTop: 0, 
                    borderBottom: index !== fetchedTeams.length - 1 ? '1px solid #eda500' : 'none'  
                }} >
                    < Description
                    title={<Info>{item.nome}</Info>} 
                    />
                    
                </List.Item >
                
                )}
            />
        </Frame>
        <ViewModal open={displayViewModal} close={closeViewModal} teamData={equipeSelecionada}/>
        <EditModal open={displayEditModal} close={closeEditModal} equipe={equipeSelecionada} message={displayMessage}/>
        <AddModal open={displayAddModal} close={closeAddModal} message={displayMessage}/>
        </Container>
    </ConfigProvider>
    );
}

export default Equipes;