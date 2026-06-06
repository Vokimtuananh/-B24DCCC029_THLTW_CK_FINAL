import React, { useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchSchools } from '../../../store/slices/schoolSlice';
// Import thêm fetchMajors, fetchApplications sau khi bạn tạo xong slice cho chúng

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Lấy dữ liệu từ Store
  const { schools, loading: schoolLoading } = useAppSelector(state => state.school);
  // Giả lập state majors và applications (Bạn sẽ thay bằng useAppSelector thực tế)
  const majors = []; 
  const applications = [
    { id: '1', schoolId: '1', status: 'pending' },
    { id: '2', schoolId: '1', status: 'approved' },
    { id: '3', schoolId: '2', status: 'rejected' },
  ];
  const loading = schoolLoading; // Kết hợp nhiều loading state nếu cần

  useEffect(() => {
    dispatch(fetchSchools());
    // dispatch(fetchMajors());
    // dispatch(fetchApplications());
  }, [dispatch]);

  // --- XỬ LÝ DỮ LIỆU CHO BIỂU ĐỒ ---

  // 1. Dữ liệu biểu đồ cột: Đếm số lượng hồ sơ theo từng trường
  const schoolNames = schools.map(s => s.code);
  const applicationCountsBySchool = schools.map(school => {
    return applications.filter(app => app.schoolId === school.id).length;
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

  // 2. Dữ liệu biểu đồ tròn: Đếm số lượng hồ sơ theo trạng thái
  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

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
          <Card><Statistic title="Tổng số ngành" value={majors.length || 124} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Tổng hồ sơ nhận" value={applications.length} /></Card>
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