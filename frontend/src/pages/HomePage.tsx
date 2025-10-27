import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Typography } from 'antd';
import { BarChartOutlined, TrophyOutlined, RiseOutlined } from '@ant-design/icons';
import NavChart from '../components/NavChart';
import MarketIndices from '../components/MarketIndices';
import { getLeaderboard } from '../services/leaderboardService';
import type { LeaderboardItem } from '../services/leaderboardService';
import './HomePage.css';

const { Title } = Typography;

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboard({ sortBy: 'return', sortOrder: 'desc' });
        setLeaderboardData(data.data || []);
      } catch (error) {
        console.error('加载排行榜数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* 市场指数 */}
          <MarketIndices />

          {/* 收益曲线对比 */}
          <Card
            className="chart-card"
            title={
              <>
                <BarChartOutlined /> 模型收益对比
              </>
            }
            extra="单位净值（基准1.0）"
          >
            <NavChart />
          </Card>

          {/* 排行榜预览 */}
          <Row gutter={16}>
            <Col xs={24} lg={8}>
              <Card
                className="stat-card"
                hoverable
                onClick={() => window.location.href = '/leaderboard'}
              >
                <TrophyOutlined className="stat-icon" />
                <Title level={4}>收益冠军</Title>
                <div className="stat-value">
                  {leaderboardData[0]?.totalReturn || '0'}%
                </div>
                <div className="stat-label">{leaderboardData[0]?.modelName || '暂无数据'}</div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="stat-card" hoverable>
                <RiseOutlined className="stat-icon" />
                <Title level={4}>稳健之星</Title>
                <div className="stat-value">
                  {leaderboardData[1]?.totalReturn || '0'}%
                </div>
                <div className="stat-label">
                  夏普比率 {leaderboardData[1]?.sharpeRatio || '0'}
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="stat-card" hoverable>
                <BarChartOutlined className="stat-icon" />
                <Title level={4}>活跃交易</Title>
                <div className="stat-value">
                  {leaderboardData[0]?.totalTrades || '0'}
                </div>
                <div className="stat-label">累计交易次数</div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default HomePage;

