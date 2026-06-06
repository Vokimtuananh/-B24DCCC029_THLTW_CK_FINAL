import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchSchools, createSchool, updateSchoolAsync, deleteSchoolAsync } from '../../../store/slices/schoolSlice';
import type { School } from '../../../types';

const SchoolManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { schools, loading } = useAppSelector((state) => state.school);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  const columns: ColumnsType<School> = [
    { title: 'Mã trường', dataIndex: 'code', key: 'code', width: '20%' },
    { title: 'Tên trường', dataIndex: 'name', key: 'name' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa trường này?" onConfirm={() => handleDelete(record.id)}>
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

  const handleEdit = (record: School) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteSchoolAsync(id))
      .unwrap()
      .then(() => {
        message.success('Đã xóa thành công!');
      })
      .catch((error) => {
        message.error(`Xóa thất bại: ${error}`);
      });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingId) {
        dispatch(updateSchoolAsync({ id: editingId, ...values }))
          .unwrap()
          .then(() => {
            message.success('Cập nhật thành công!');
            setIsModalOpen(false);
          })
          .catch((err) => message.error(err));
      } else {
        dispatch(createSchool(values))
          .unwrap()
          .then(() => {
            message.success('Thêm mới thành công!');
            setIsModalOpen(false);
          })
          .catch((err) => message.error(err));
      }
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>"Quản lý Trường học"</h2>
        <Button type="primary" onClick={handleAdd}>+ Thêm trường mới</Button>
      </div>

      {/* Truyền loading vào Table để hiển thị spinner xoay xoay khi chờ API */}
      <Table columns={columns} dataSource={schools} rowKey="id" bordered loading={loading} />

      <Modal 
        title={editingId ? '"Sửa thông tin trường"' : '"Thêm trường mới"'} 
        open={isModalOpen} 
        onOk={handleModalOk} 
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Mã trường" rules={[{ required: true, message: 'Vui lòng nhập mã trường!' }]}>
            <Input placeholder="VD: PTIT" />
          </Form.Item>
          <Form.Item name="name" label="Tên trường" rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}>
            <Input placeholder="VD: Học viện Công nghệ Bưu chính Viễn thông" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SchoolManagement;