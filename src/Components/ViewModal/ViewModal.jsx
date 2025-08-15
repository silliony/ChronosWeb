import { Flex, Modal, Select, Typography } from "antd";
import ConfigProvider from "antd/es/config-provider"
import { useEffect, useState } from "react";
import api from "../../Services/api";
const { Title, Text } = Typography;

// Permite visualizar as info de uma equipe
const ViewModal = ({open, close, teamData}) => {
    const [etapa, setEtapa] = useState(0);
    const [bateria, setBateria] = useState(0);
    const [tentativas, setTentativas] = useState([
        {
            checkpoints: [{num: 0, tempo: "00:00:000"}]
        },
        {
            checkpoints: [{num: 0, tempo: "00:00:000"}]
        }
    ]);

    // Chamar uma busca de dados depois de abrir o modal
    const afterOpen = () => {
        listarAmbasTentativas();
    };

    // Fetch tentativa dependendo do select
    const listarAmbasTentativas = async () => {
        try {
            // Chama a tentativa 1
            const response1 = await api.get(`/tentativa/${teamData.id}`, { params: { etapa, bateria, tentativa: 0 } });
            // Chama a tentativa 2
            const response2 = await api.get(`/tentativa/${teamData.id}`, { params: { etapa, bateria, tentativa: 1 } });

            setTentativas([response1.data, response2.data]);
        } catch (error) {
                console.error("Erro ao listar tentativas:", error);
        }
    }

    useEffect(() => {
        listarAmbasTentativas();
    }, [etapa, bateria]);

    let tentativa1 = tentativas[0]?.checkpoints?.length
        ? tentativas[0].checkpoints.map((value, index) => (
            <Text key={index}>
                Checkpoint {value.num + 1}: {value.tempo}
            </Text>
        ))
        : <Text>Não há tentativa</Text>;

    let tentativa2 = tentativas[1]?.checkpoints?.length
        ? tentativas[1].checkpoints.map((value, index) => (
            <Text key={index}>
                Checkpoint {value.num + 1}: {value.tempo}
            </Text>
        ))
        : <Text>Não há tentativa</Text>;

    const seguidorContent =
            <>
                <Flex gap="middle">
                    <Select 
                        defaultValue={0}
                        onChange={e => {setEtapa(e)}}
                    >
                        <Select.Option value={0}>Classificatória</Select.Option>
                        <Select.Option value={1}>Repescagem</Select.Option>
                        <Select.Option value={2}>Final</Select.Option>
                        <Select.Option value={3}>Arrancada</Select.Option>
                    </Select>
                    <Select
                        defaultValue={0}
                        onChange={e => setBateria(e)}
                    >
                        <Select.Option value={0}>Bateria 1</Select.Option>
                        <Select.Option value={1}>Bateria 2</Select.Option>
                        <Select.Option value={2}>Bateria 3</Select.Option>
                    </Select>
                </Flex>
                {/* Display tries */}
                <Flex gap="large">
                    <Flex vertical={true} gap="small" align="center">
                        <Title level={5}>Tentativa 1</Title>
                        <Flex vertical={true} gap="small">
                            <Flex wrap gap="small" vertical>
                                {tentativa1}
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex vertical={true} gap="small" align="center">
                        <Title level={5}>Tentativa 2</Title>
                        <Flex vertical={true} gap="small">
                            <Flex wrap gap="small" vertical>
                                {tentativa2}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </>;

    const sumoContent = 
            <>
                {/* Display tries */}
                <Flex vertical={true} gap="small">
                    <Flex>
                        <Flex vertical={true} gap="small" align="center">
                            <Title level={5}>Tentativa 1</Title>
                            <Flex vertical={true} gap="small">
                                <Text strong>Tempo total: {}</Text>
                                <Flex wrap gap="small">
                                    
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </>;

    const nomeCategoria = () => {
        switch (Number(teamData.categoria)) {
            case 0:
                return "Avançada";
            case 1:
                return "Mirim";
            case 2:
                return "Sumô";
            default:
                return "Categoria desconhecida";
        }
    };

    return (
        <ConfigProvider>
            <Modal
                afterOpenChange={afterOpen}
                title={"Visualizando: " + teamData.nome}
                open={open}
                onCancel={close}
                footer={null}
                destroyOnClose
            >
                <Flex
                    vertical={true}
                    align="flex-start"
                    justify="flex-start"
                    gap="middle"
                >
                    <Flex gap="small" vertical>
                        <Flex gap="middle">
                            <Text>Categoria: <Text type="secondary">{teamData ? nomeCategoria() : ""}</Text></Text>
                            <Text>Capitão: <Text type="secondary">{teamData?.participantes?.[0] ?? "Desconhecido"}</Text></Text>
                        </Flex>
                            <Text>Membros: <Text type="secondary">{teamData?.participantes?.slice(1).filter(Boolean).length ? teamData.participantes.slice(1).filter(Boolean).join(", ") : "Nenhum membro além do capitão"}</Text></Text>
                    </Flex>
                    {/* Define round and heat Selects */}
                    {teamData.categoria == 2 ? sumoContent : seguidorContent}
                </Flex>
            </Modal>
        </ConfigProvider>
    );
}

export default ViewModal   