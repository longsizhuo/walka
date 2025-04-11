'use client';
import {
    Layout,
    Menu,
    Typography,
    Row,
    Col,
    Card,
    Image,
    Input,
    Button,
    Space,
    Modal,
    Checkbox
} from 'antd';
import 'antd/dist/reset.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const menuItems = [
    { key: '1', label: <a href="#about">About</a> },
    { key: '2', label: <a href="#tours">Tours</a> },
    { key: '3', label: <a href="#support">Support</a> },
    { key: '4', label: <a href="#contact">Contact</a> },
];

export default function AboriginalTourismHomePage() {
    const [query, setQuery] = useState('');
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const [isRegisterVisible, setIsRegisterVisible] = useState(false);
    const basePath = process.env.NODE_ENV === 'production' ? "/walka" : '';
    const router = useRouter();

    const showLogin = () => setIsLoginVisible(true);
    const showRegister = () => setIsRegisterVisible(true);
    const handleCancel = () => {
        setIsLoginVisible(false);
        setIsRegisterVisible(false);
    };

    async function handleSubmit() {
        if (!query.trim()) {
            alert('Say something... Tell me more');
            return;
        }
        router.push(`/chat?query=${encodeURIComponent(query)}`);
    }

    return (
        <Layout
            style={{
                minHeight: '100vh',
                backgroundImage: `url(${basePath}/assets/aboriginal/background.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <Header
                style={{
                    background: 'rgba(61, 38, 20, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 100
                }}
            >
                <Image src={`${basePath}/assets/aboriginal/logo.png`} alt="Walka Logo" style={{ height: 40, marginRight: 24 }} />
                <Menu
                    mode="horizontal"
                    theme="dark"
                    style={{ background: 'transparent', flex: 1 }}
                    defaultSelectedKeys={['1']}
                >
                    {menuItems.map(item => (
                        <Menu.Item key={item.key}>{item.label}</Menu.Item>
                    ))}
                </Menu>
                <Space>
                    <Button onClick={showLogin}>Login</Button>
                    <Button type="primary" onClick={showRegister}>Register</Button>
                </Space>
            </Header>

            <Content style={{ padding: '48px 24px', paddingTop: '60px', paddingBottom: '60px' }}>
                <div style={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: 48,
                    borderRadius: 12,
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <Title level={1} style={{ color: '#FFD666' }}>Explore Culture. Empower Communities.</Title>
                    <Paragraph style={{ color: '#FFF1B8', fontSize: '1.2rem', maxWidth: 800, margin: '0 auto' }}>
                        Experience authentic Aboriginal and Yizu culture through guided tours, art, and storytelling.
                        Your journey supports Indigenous communities.
                    </Paragraph>
                </div>

                <div id="ai-tour" style={{ marginTop: 64, background: 'rgba(0, 0, 0, 0.85)', padding: 24 }}>
                    <Title level={2} style={{ color: '#FFD666' }}>Smart Tour Planner 🤖</Title>
                    <Paragraph style={{ color: '#FFF1B8' }}>
                        Enter your travel idea and let Gemini generate a plan for you.
                    </Paragraph>

                    <Input
                        placeholder="e.g. 杭州一日游"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            backgroundColor: '#3E2A18',
                            color: '#FFF1B8',
                            borderColor: '#FFD666'
                        }}
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            background: '#FFD666',
                            color: '#3E2A18',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            marginTop: 12
                        }}
                    >
                        {loading ? 'Generating...' : 'Generate Plan'}
                    </Button>

                    {plan && plan.plan && (
                        <div style={{ marginTop: 24 }}>
                            <Title level={3} style={{ color: '#FFF1B8' }}>🗓 {plan.date}</Title>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {plan.plan.map((item: any, idx: number) => (
                                    <li key={idx} style={{
                                        marginBottom: 16,
                                        padding: 12,
                                        background: '#3E2A18',
                                        color: '#FFF1B8',
                                        borderRadius: 8
                                    }}>
                                        <p><strong>🕒 Time:</strong> {item.time}</p>
                                        <p><strong>📍 Location:</strong> {item.name}</p>
                                        <p><strong>🔍 Query:</strong> {item.query}</p>
                                        <p><strong>🏷️ Type:</strong> {item.type}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div id="about" style={{ marginTop: 64, background: 'rgba(0, 0, 0, 0.8)', padding: 24 }}>
                    <Title level={2} style={{ color: '#FFD666' }}>Our Mission</Title>
                    <Paragraph style={{ color: '#FFF1B8', fontSize: '1.2rem', maxWidth: 800 }}>
                        &apos;Walka&apos; means pattern, story, or journey. We are a platform that promotes sustainable tourism
                        while preserving and supporting Aboriginal and Yizu traditions. We partner with local guides,
                        artists, and historians to offer immersive cultural experiences.
                    </Paragraph>
                </div>

                <div id="tours" style={{ marginTop: 64, background: 'rgba(0, 0, 0, 0.8)', padding: 24 }}>
                    <Title level={2} style={{ color: '#FFD666' }}>Featured Cultural Journeys</Title>
                    <Row gutter={[24, 24]} justify="center" style={{ marginTop: 24, display: 'flex' }}>
                        <Col xs={24} md={8} style={{ display: 'flex' }}>
                            <Card
                                style={{ backgroundColor: '#3E2A18', color: '#FFF1B8', width: '100%' }}
                                title={<span style={{ color: '#FFD666' }}>Dreamtime Walk</span>}
                                hoverable
                            >
                                A guided hike through sacred Aboriginal lands, with storytelling around fire under the stars.
                            </Card>
                        </Col>
                        <Col xs={24} md={8} style={{ display: 'flex' }}>
                            <Card
                                style={{ backgroundColor: '#3E2A18', color: '#FFF1B8', width: '100%' }}
                                title={<span style={{ color: '#FFD666' }}>Yizu Textile Workshop</span>}
                                hoverable
                            >
                                Hands-on experience with traditional Yizu weaving, dyeing, and embroidery.
                            </Card>
                        </Col>
                        <Col xs={24} md={8} style={{ display: 'flex' }}>
                            <Card
                                style={{ backgroundColor: '#3E2A18', color: '#FFF1B8', width: '100%' }}
                                title={<span style={{ color: '#FFD666' }}>Indigenous Art Tour</span>}
                                hoverable
                            >
                                Visit local art centers, meet artists, and learn the meanings behind Aboriginal and Yizu patterns.
                            </Card>
                        </Col>
                    </Row>
                </div>

                <div id="support" style={{ marginTop: 64, background: 'rgba(0, 0, 0, 0.8)', padding: 24 }}>
                    <Title level={2} style={{ color: '#FFD666' }}>Tourism That Gives Back</Title>
                    <Paragraph style={{ color: '#FFF1B8', maxWidth: 800, fontSize: '1.2rem' }}>
                        Every booking funds education, community health, and cultural preservation programs. We ensure a
                        fair share goes back to local creators and guides.
                    </Paragraph>
                </div>
            </Content>

            <Footer style={{
                textAlign: 'center',
                background: 'rgba(61, 38, 20, 0.9)',
                color: '#FFF1B8',
                position: 'fixed',
                bottom: 0,
                width: '100%',
                zIndex: 100
            }}>
                © 2025 Walka Cultural Journeys. All rights reserved.
            </Footer>

            {/* Login Modal */}
            <Modal
                title="Login"
                open={isLoginVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Input placeholder="Email" />
                    <Input.Password placeholder="Password" />
                    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Checkbox>Remember me</Checkbox>
                        <a>Forgot password?</a>
                    </Space>
                    <Button type="primary" block>Login</Button>
                    <a style={{ textAlign: 'center' }} onClick={() => {
                        setIsLoginVisible(false);
                        setIsRegisterVisible(true);
                    }}>No account? Register now</a>
                </Space>
            </Modal>

            {/* Register Modal */}
            <Modal
                title="Register"
                open={isRegisterVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Input placeholder="Email" />
                    <Input.Password placeholder="Password" />
                    <Input.Password placeholder="Confirm Password" />
                    <Button type="primary" block>Register</Button>
                    <a style={{ textAlign: 'center' }} onClick={() => {
                        setIsRegisterVisible(false);
                        setIsLoginVisible(true);
                    }}>Already have an account? Login</a>
                </Space>
            </Modal>
        </Layout>
    );
}
