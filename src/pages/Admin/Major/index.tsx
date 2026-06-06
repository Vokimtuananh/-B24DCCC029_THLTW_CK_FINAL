import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addMajor, updateMajor, deleteMajor } from '../../../store/slices/majorSlice';
import { Major } from '../../../types';

const MajorManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const majors = useAppSelector((state) => state.major.majors);
  const schools = useAppSelector((state) => state.school.schools);
  const dispatch = useAppDispatch();

  const columns: ColumnsType<Major> = [
    { title: 'Mã ngành', dataIndex: 'code', key: 'code', width: '15%' },
    { title: 'Tên ngành', dataIndex: 'name', key: 'name' },
    { 
      title: 'Trường trực thuộc', 
      key: 'school',
      render: (_, record) => {
        const school = schools.find(s => s.id === record.schoolId);
        return school ? school.name : 'Không xác định';
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa ngành này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Major) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteMajor(id));
    message.success('Đã xóa thành công!');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingId) {
        dispatch(updateMajor({ id: editingId, ...values }));
        message.success('Cập nhật thành công!');
      } else {
        const newMajor: Major = {
          id: Date.now().toString(),
          ...values,
        };
        dispatch(addMajor(newMajor));
        message.success('Thêm mới thành công!');
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>"Quản lý Ngành học"</h2>
        <Button type="primary" onClick={handleAdd}>+ Thêm ngành mới</Button>
      </div>

      <Table columns={columns} dataSource={majors} rowKey="id" bordered />

      <Modal 
        title={editingId ? '"Sửa thông tin ngành"' : '"Thêm ngành mới"'} 
        open={isModalOpen} 
        onOk={handleModalOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="schoolId" 
            label="Trường trực thuộc" 
            rules={[{ required: true, message: 'Vui lòng chọn trường!' }]}
          >
            <Select placeholder="Chọn trường">
              {schools.map(school => (
                <Select.Option key={school.id} value={school.id}>
                  {school.name} ({school.code})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="code" label="Mã ngành" rules={[{ required: true, message: 'Vui lòng nhập mã ngành!' }]}>
            <Input placeholder="VD: 7480201" />
          </Form.Item>
          
          <Form.Item name="name" label="Tên ngành" rules={[{ required: true, message: 'Vui lòng nhập tên ngành!' }]}>
            <Input placeholder="VD: Công nghệ thông tin" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MajorManagement;