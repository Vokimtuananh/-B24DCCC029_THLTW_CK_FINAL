import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Layout, Steps } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Content } = Layout;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Step 1: Request Reset Code
  const handleRequestReset = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password-request', { email: values.email });
      setEmail(values.email);
      message.success('Mã xác nhận đã được gửi đến email của bạn!');

      // FOR DEV ONLY: Show the code if it's returned in response
      if (response.data._dev_resetCode) {
        message.info(`Dev Mode: Mã reset của bạn là ${response.data._dev_resetCode}`, 10);
      }

      setCurrentStep(1);
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Không thể gửi yêu cầu đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm Reset
  const handleConfirmReset = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.error('Mật khẩu xác nhận không khớp!');
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password-confirm', {
        email,
        resetCode: values.resetCode,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });

      message.success('Mật khẩu đã được thay đổi thành công!');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Mã xác nhận không đúng hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={2}>Quên Mật Khẩu</Title>
            <Steps size="small" current={currentStep} style={{ marginBottom: 24 }}>
              <Steps.Step title="Gửi yêu cầu" />
              <Steps.Step title="Đặt lại mật khẩu" />
            </Steps>
          </div>

          {currentStep === 0 ? (
            <Form onFinish={handleRequestReset} layout="vertical" size="large">
              <Text type="secondary" style={{ display: 'block', marginBottom: 16, textAlign: 'center' }}>
                Nhập email của bạn để nhận mã xác nhận đặt lại mật khẩu.
              </Text>
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập Email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Gửi mã xác nhận
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form onFinish={handleConfirmReset} layout="vertical" size="large">
              <Form.Item
                name="resetCode"
                label="Mã xác nhận"
                rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận!' }]}
              >
                <Input prefix={<KeyOutlined />} placeholder="Nhập mã 6 chữ số" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 8, message: 'Tối thiểu 8 ký tự' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Đặt lại mật khẩu
                </Button>
              </Form.Item>
              <Button type="link" onClick={() => setCurrentStep(0)} block>
                Quay lại bước trước
              </Button>
            </Form>
          )}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            Quay lại <Link to="/login">Đăng nhập</Link>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ForgotPassword;
