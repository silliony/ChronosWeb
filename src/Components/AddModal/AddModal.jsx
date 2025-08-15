import { Alert, Button, Flex, Form, Input, Modal, Select, Typography } from "antd";
import ConfigProvider from "antd/es/config-provider";
import { useState } from "react";
import api from "../../Services/api";
const { Title, Text } = Typography;

const AddModal = ({open, close, message}) => {
    const [nome, setNome] = useState("");
    const [membros, setMembros] = useState(["", "", "", "", ""]); // [capitão, membro1, ..., membro4]
    const [categoria, setCategoria] = useState(0);

    const handleMembroChange = (index, value) => {
        setMembros(prev => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    }

    const handleOk = async () => {
        console.log(membros);
        try {
            await api.post('/equipe', {
                nome: nome,
                categoria: categoria,
                participantes: membros
            });

            setNome("");
            setMembros(["", "", "", "", ""]);
            setCategoria(0);
            
            close();

            message("success", "Equipe adicionada");
        } catch (error) {
            message("error", "Erro ao enviar dados");
        }
    }

    return(
        <ConfigProvider>
            <Modal
                open={open}
                onCancel={close}
                onOk={handleOk}
                title={"Adicionar Equipe"}
                okText="Salvar"
                cancelText="Cancelar"
                destroyOnClose
            >
                <Flex vertical={true} gap={"middle"}>
                    <Input
                        addonBefore={<Text>Nome: </Text>} 
                        onChange={e => setNome(e.target.value)}
                    />
                    <Select
                        defaultValue={0}
                        onChange={e => setCategoria(e)}
                    >
                        <Select.Option value={0}>Categoria Avançada</Select.Option>
                        <Select.Option value={1}>Categoria Mirim</Select.Option>
                        <Select.Option value={2}>Sumô</Select.Option>
                    </Select>

                    {/* Capitão */}
                    <Input
                        addonBefore={<Text>Capitão (ã): </Text>}
                        value={membros[0]}
                        onChange={e => handleMembroChange(0, e.target.value)}
                    />

                    {/* Membros */}
                    {[1,2,3,4].map(i => (
                        <Input
                            key={i}
                            addonBefore={<Text>Membro {i+1}: </Text>}
                            value={membros[i]}
                            onChange={e => handleMembroChange(i, e.target.value)}
                        />
                    ))}
                </Flex>
            </Modal>
        </ConfigProvider>
    );
}

export default AddModal;