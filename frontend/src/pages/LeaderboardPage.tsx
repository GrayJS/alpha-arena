import { Table, Tag, Button, Space, Spin, Alert } from 'antd';
import { TrophyOutlined, LineChartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/leaderboardService';
import type { LeaderboardItem } from '../services/leaderboardService';

interface LeaderboardData {
  key: string;
  rank: number;
  modelId: number;
  modelName: string;
  algorithm: string;
  totalReturn: string;
  sharpeRatio: string;
  maxDrawdown: string;
  winRate: string;
  totalTrades: number;
}

function LeaderboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LeaderboardData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getLeaderboard({ sortBy: 'return', sortOrder: 'desc' });
        const leaderboardData: LeaderboardItem[] = response.data || [];
        
        const tableData = leaderboardData.map((item, index) => ({
          key: item.modelId.toString(),
          rank: index + 1,
          modelId: item.modelId,
          modelName: item.modelName,
          algorithm: item.algorithm,
          totalReturn: item.totalReturn,
          sharpeRatio: item.sharpeRatio,
          maxDrawdown: item.maxDrawdown,
          winRate: item.winRate,
          totalTrades: item.totalTrades
        }));
        
        setData(tableData);
      } catch (err) {
        console.error('加载排行榜失败:', err);
        setError('加载排行榜失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 模拟数据（如果API失败时显示）
  const mockData: LeaderboardData[] = [
    {
      key: '1',
      rank: 1,
      modelName: 'GPT-4 量化策略',
      algorithm: 'GPT-4',
      totalReturn: 45.2,
      sharpeRatio: 2.5,
      maxDrawdown: -8.5,
      winRate: 68.5,
      status: 'active'
    },
    {
      key: '2',
      rank: 2,
      modelName: 'XGBoost 预测模型',
      algorithm: 'XGBoost',
      totalReturn: 38.7,
      sharpeRatio: 2.1,
      maxDrawdown: -10.2,
      winRate: 65.2,
      status: 'active'
    },
    {
      key: '3',
      rank: 3,
      modelName: 'LSTM 时序预测',
      algorithm: 'LSTM',
      totalReturn: 32.8,
      sharpeRatio: 1.8,
      maxDrawdown: -12.5,
      winRate: 62.3,
      status: 'active'
    }
  ];

  const columns: ColumnsType<LeaderboardData> = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank) => (
        <span>
          {rank === 1 && <TrophyOutlined style={{ color: '#faad14' }} />}
          {rank}
        </span>
      )
    },
    {
      title: '模型名称',
      dataIndex: 'modelName',
      key: 'modelName',
      render: (text, record) => (
        <a onClick={() => navigate(`/model/${record.modelId}`)}>{text}</a>
      )
    },
    {
      title: '算法类型',
      dataIndex: 'algorithm',
      key: 'algorithm',
      width: 120
    },
    {
      title: '累计收益率',
      dataIndex: 'totalReturn',
      key: 'totalReturn',
      width: 120,
      render: (value) => (
        <span style={{ color: parseFloat(value) > 0 ? '#f5222d' : '#52c41a' }}>
          {parseFloat(value) > 0 ? '+' : ''}{value}%
        </span>
      ),
      sorter: (a, b) => parseFloat(a.totalReturn) - parseFloat(b.totalReturn)
    },
    {
      title: '夏普比率',
      dataIndex: 'sharpeRatio',
      key: 'sharpeRatio',
      width: 120,
      sorter: (a, b) => parseFloat(a.sharpeRatio) - parseFloat(b.sharpeRatio)
    },
    {
      title: '最大回撤',
      dataIndex: 'maxDrawdown',
      key: 'maxDrawdown',
      width: 120,
      render: (value) => (
        <span style={{ color: '#ff4d4f' }}>{value}%</span>
      )
    },
    {
      title: '胜率',
      dataIndex: 'winRate',
      key: 'winRate',
      width: 100,
      render: (value) => value
    },
    {
      title: '交易次数',
      dataIndex: 'totalTrades',
      key: 'totalTrades',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<LineChartOutlined />}
            onClick={() => navigate(`/model/${record.key}`)}
          >
            查看详情
          </Button>
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Alert message={error} type="error" showIcon style={{ margin: '24px' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>模型排行榜</h2>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default LeaderboardPage;

