import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  BookOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

// Import các trang (Chúng ta sẽ tạo ở bước sau)
import Dashboard from './pages/Admin/Dashboard';
import SchoolManagement from './pages/Admin/School';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/">"Dashboard"</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<BankOutlined />}>
              <Link to="/schools">"Quản lý Trường"</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<BookOutlined />}>
              <Link to="/majors">"Quản lý Ngành"</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<AppstoreOutlined />}>
              <Link to="/admission-blocks">"Quản lý Tổ hợp"</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: '#fff', textAlign: 'center' }}>
            <Title level={3} style={{ margin: '14px 0' }}>Hệ thống Quản lý Tuyển sinh</Title>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360, marginTop: 16, background: '#fff' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/schools" element={<SchoolManagement />} />
                <Route path="/majors" element={<div>Đang phát triển "Quản lý Ngành"...</div>} />
                <Route path="/admission-blocks" element={<div>Đang phát triển "Quản lý Tổ hợp"...</div>} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;