import React, { useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchSchools } from '../../../store/slices/schoolSlice';
import { fetchApplications } from '../../../store/slices/applicationSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  const { schools, loading: schoolLoading } = useAppSelector(state => state.school);
  const { majors } = useAppSelector(state => state.major);
  const { applications, loading: applicationLoading } = useAppSelector(state => state.application);

  const loading = schoolLoading || applicationLoading;

  useEffect(() => {
    dispatch(fetchSchools());
    dispatch(fetchApplications({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const schoolNames = schools.map(s => s.code || s.name || s.id || s._id);
  const applicationRecords = Array.isArray(applications) ? applications : [];

  const normalizeId = (value: any) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return value._id || value.id || value.toString();
    return String(value);
  };

  const applicationSchoolId = (app: any) => normalizeId(app.schoolId);
  const schoolKey = (school: any) => normalizeId(school.id || school._id);

  const applicationCountsBySchool = schools.map(school => {
    const schoolId = schoolKey(school);
    return applicationRecords.filter(app => applicationSchoolId(app) === schoolId).length;
  });

  const barChartOption = {
    title: { text: 'Hồ sơ theo Trường' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: schoolNames.length > 0 ? schoolNames : ['Chưa có dữ liệu']
    },
    yAxis: { type: 'value' },
    series: [{
      name: 'Số lượng hồ sơ',
      type: 'bar',
      data: applicationCountsBySchool,
      itemStyle: { color: '#1890ff' }
    }]
  };

  const pendingCount = applicationRecords.filter(app => app.admissionResult?.status === 'pending').length;
  const approvedCount = applicationRecords.filter(app => app.admissionResult?.status === 'accepted').length;
  const rejectedCount = applicationRecords.filter(app => app.admissionResult?.status === 'rejected').length;

  const pieChartOption = {
    title: { text: 'Trạng thái Hồ sơ', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%' },
    series: [
      {
        name: 'Trạng thái',
        type: 'pie',
        radius: '50%',
        data: [
          { value: pendingCount, name: 'Chờ duyệt', itemStyle: { color: '#faad14' } },
          { value: approvedCount, name: 'Đã duyệt', itemStyle: { color: '#52c41a' } },
          { value: rejectedCount, name: 'Từ chối', itemStyle: { color: '#ff4d4f' } }
        ],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }
    ]
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card><Statistic title="Tổng số trường" value={schools.length} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Tổng số ngành" value={majors.length} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Tổng hồ sơ nhận" value={applicationRecords.length} /></Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={14}>
          <Card>
            <ReactECharts option={barChartOption} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col span={10}>
          <Card>
            <ReactECharts option={pieChartOption} style={{ height: 400 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;