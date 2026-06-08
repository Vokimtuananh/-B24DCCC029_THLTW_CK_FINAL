import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Content } = Layout;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      return message.error('Mật khẩu xác nhận không khớp!');
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName
      });

      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        // Chuyển đối tượng lỗi thành mảng để hiển thị
        const errorMessages = Object.values(error.response.data.errors);
        errorMessages.forEach((err: any) => message.error(err));
      } else {
        const errorMsg = error.response?.data?.error || 'Đăng ký thất bại. Vui lòng kiểm tra lại kết nối server.';
        const details = error.response?.data?.details ? `: ${error.response.data.details}` : '';
        message.error(errorMsg + details);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
        <Card style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2}>Đăng Ký</Title>
            <Text type="secondary">Tạo tài khoản mới</Text>
          </div>

          <Form
            name="register_form"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="fullName"
              label="Họ và Tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="username123" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập Email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải ít nhất 8 ký tự!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Đăng Ký
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Register;
