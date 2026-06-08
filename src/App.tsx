import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, Typography, Button, Space, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  BookOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';

// Import các trang
import Dashboard from './pages/Admin/Dashboard';
import SchoolManagement from './pages/Admin/School';
import Applications from './pages/Admin/Applications';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/login';
  };

  const menuItems = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const sidebarItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '2',
      icon: <BankOutlined />,
      label: <Link to="/schools">Quản lý Trường</Link>,
    },
    {
      key: '3',
      icon: <BookOutlined />,
      label: <Link to="/majors">Quản lý Ngành</Link>,
    },
    {
      key: '4',
      icon: <AppstoreOutlined />,
      label: <Link to="/admission-blocks">Quản lý Tổ hợp</Link>,
    },
    {
      key: '5',
      icon: <FileTextOutlined />,
      label: <Link to="/applications">Duyệt Hồ sơ</Link>,
    },
  ];

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!collapsed && <span style={{ color: 'white', fontWeight: 'bold' }}>ADMISSION CMS</span>}
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={sidebarItems} />
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,.08)', zIndex: 1 }}>
            <Title level={4} style={{ margin: 0 }}>Hệ thống Quản lý Tuyển sinh</Title>

            <Space size="large">
              <Text strong>{user?.fullName}</Text>
              <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                <Avatar style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} icon={<UserOutlined />} />
              </Dropdown>
            </Space>
          </Header>
          <Content style={{ margin: '16px' }}>
            <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/schools" element={<SchoolManagement />} />
                <Route path="/majors" element={<div>Đang phát triển Quản lý Ngành...</div>} />
                <Route path="/admission-blocks" element={<div>Đang phát triển Quản lý Tổ hợp...</div>} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
