import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Popconfirm, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addAdmissionBlock, updateAdmissionBlock, deleteAdmissionBlock } from '../../../store/slices/admissionBlockSlice';
import { AdmissionBlock } from '../../../types';

const AdmissionBlockManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const admissionBlocks = useAppSelector((state) => state.admissionBlock.admissionBlocks);
  const majors = useAppSelector((state) => state.major.majors);
  const schools = useAppSelector((state) => state.school.schools);
  const dispatch = useAppDispatch();

  const columns: ColumnsType<AdmissionBlock> = [
    { title: 'Mã tổ hợp', dataIndex: 'code', key: 'code', width: '15%' },
    { 
      title: 'Các môn xét tuyển', 
      key: 'subjects',
      render: (_, record) => (
        <>
          {record.subjects.map(subject => (
            <Tag color="blue" key={subject}>{subject}</Tag>
          ))}
        </>
      )
    },
    { 
      title: 'Ngành trực thuộc', 
      key: 'major',
      render: (_, record) => {
        const major = majors.find(m => m.id === record.majorId);
        if (!major) return 'Không xác định';
        
        const school = schools.find(s => s.id === major.schoolId);
        return `${major.name} - ${school ? school.code : ''}`;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa tổ hợp này?" onConfirm={() => handleDelete(record.id)}>
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

  const handleEdit = (record: AdmissionBlock) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteAdmissionBlock(id));
    message.success('Đã xóa thành công!');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingId) {
        dispatch(updateAdmissionBlock({ id: editingId, ...values }));
        message.success('Cập nhật thành công!');
      } else {
        const newBlock: AdmissionBlock = {
          id: Date.now().toString(),
          ...values,
        };
        dispatch(addAdmissionBlock(newBlock));
        message.success('Thêm mới thành công!');
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>"Quản lý Tổ hợp xét tuyển"</h2>
        <Button type="primary" onClick={handleAdd}>+ Thêm tổ hợp</Button>
      </div>

      <Table columns={columns} dataSource={admissionBlocks} rowKey="id" bordered />

      <Modal 
        title={editingId ? '"Sửa tổ hợp"' : '"Thêm tổ hợp mới"'} 
        open={isModalOpen} 
        onOk={handleModalOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="majorId" 
            label="Ngành trực thuộc" 
            rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}
          >
            <Select placeholder="Chọn ngành">
              {majors.map(major => {
                const school = schools.find(s => s.id === major.schoolId);
                return (
                  <Select.Option key={major.id} value={major.id}>
                    {major.name} {school ? `(${school.code})` : ''}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="code" 
            label="Mã tổ hợp" 
            rules={[{ required: true, message: 'Vui lòng nhập mã tổ hợp!' }]}
          >
            <Input placeholder="VD: A00" />
          </Form.Item>
          
          <Form.Item 
            name="subjects" 
            label="Danh sách môn học" 
            rules={[{ required: true, message: 'Vui lòng nhập ít nhất 1 môn!' }]}
          >
            <Select 
              mode="tags" 
              style={{ width: '100%' }} 
              placeholder="Gõ tên môn và nhấn Enter" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdmissionBlockManagement;