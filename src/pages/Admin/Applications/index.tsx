import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Descriptions, message } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchApplications, updateApplicationStatus } from '../../../store/slices/applicationSlice';

const Applications: React.FC = () => {
    const dispatch = useAppDispatch();
    const { applications, loading, total, page, limit } = useAppSelector((state: any) => state.application);
    const [viewing, setViewing] = useState<any | null>(null);

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch (e) {
            return null;
        }
    })();

    useEffect(() => {
        dispatch(fetchApplications({ page: 1, limit: 20 }));
    }, [dispatch]);

    const handleTableChange = (pagination: any) => {
        const p = pagination.current || 1;
        const l = pagination.pageSize || limit || 20;
        dispatch(fetchApplications({ page: p, limit: l }));
    };

    const onUpdateStatus = async (id: string, status: string) => {
        try {
            await dispatch(updateApplicationStatus({ id, status })).unwrap();
            message.success('Cập nhật trạng thái thành công');
            dispatch(fetchApplications({ page, limit }));
        } catch (err: any) {
            message.error(err?.message || 'Lỗi khi cập nhật trạng thái');
        }
    };

    const canReview = user?.permissions?.canReviewApplications || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'staff' || user?.role === 'viewer';

    const columns = [
        { title: 'Số hồ sơ', dataIndex: 'applicationNumber', key: 'applicationNumber' },
        {
            title: 'Họ và tên',
            key: 'fullName',
            render: (text: any, record: any) => record.personalInfo?.fullName || '-',
        },
        {
            title: 'Ngành',
            key: 'major',
            render: (text: any, record: any) => record.majorId?.name || record.majorId || '-'
        },
        {
            title: 'Trường',
            key: 'school',
            render: (text: any, record: any) => record.schoolId?.name || record.schoolId || '-'
        },
        { title: 'Trạng thái', dataIndex: ['admissionResult', 'status'], key: 'status' },
        {
            title: 'Hành động',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space>
                    <Button onClick={() => setViewing(record)}>Xem</Button>
                    {canReview && <Button type="primary" onClick={() => onUpdateStatus(record._id, 'accepted')}>Duyệt</Button>}
                    {canReview && <Button danger onClick={() => onUpdateStatus(record._id, 'rejected')}>Từ chối</Button>}
                </Space>
            )
        }
    ];

    return (
        <div>
            <h2>Quản lý Hồ sơ</h2>
            <Table
                rowKey={(r, index) => `${r._id || index}-${index}`}
                dataSource={applications}
                loading={loading}
                columns={columns}
                pagination={{ current: page, pageSize: limit, total }}
                onChange={handleTableChange}
            />

            <Modal
                open={!!viewing}
                title={`Hồ sơ: ${viewing?.applicationNumber || ''}`}
                onCancel={() => setViewing(null)}
                footer={null}
                width={800}
            >
                {viewing && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Họ và tên">{viewing.personalInfo?.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Số hồ sơ">{viewing.applicationNumber}</Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">{viewing.personalInfo?.dateOfBirth ? new Date(viewing.personalInfo?.dateOfBirth).toLocaleDateString() : '-'}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewing.personalInfo?.email}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{viewing.personalInfo?.phoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="Ngành">{viewing.majorId?.name || viewing.majorId}</Descriptions.Item>
                        <Descriptions.Item label="Trường">{viewing.schoolId?.name || viewing.schoolId}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">{viewing.admissionResult?.status}</Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">{viewing.admissionResult?.note || '-'}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default Applications;
