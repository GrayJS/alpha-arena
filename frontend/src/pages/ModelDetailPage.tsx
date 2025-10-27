import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Tabs, Descriptions, Tag, Spin, Alert, Table } from 'antd';
import NavChart from '../components/NavChart';
import { getModelById } from '../services/modelService';
import { getTrades } from '../services/apiService';
import type { Model } from '../services/modelService';

interface ModelDetail {
  id: number;
  name: string;
  algorithm: string;
  description?: string;
  riskProfile: string;
  isActive: boolean;
}

function ModelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<Model | null>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // 获取模型详情
        const modelResponse = await getModelById(Number(id));
        setModel(modelResponse.data);

        // 获取交易记录
        try {
          const tradesResponse = await getTrades({ modelId: Number(id), pageSize: 100 });
          setTrades(tradesResponse.data?.list || []);
        } catch (err) {
          console.warn('获取交易记录失败:', err);
          setTrades([]);
        }

      } catch (err) {
        console.error('加载模型详情失败:', err);
        setError('加载模型详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !model) {
    return (
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Alert message={error || '模型不存在'} type="error" showIcon />
      </div>
    );
  }

  const tradeColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120
    },
    {
      title: '股票代码',
      dataIndex: 'stockCode',
      key: 'stockCode',
      width: 100
    },
    {
      title: '股票名称',
      dataIndex: 'stockName',
      key: 'stockName',
      width: 100
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 80,
      render: (value: string) => (
        <Tag color={value === 'buy' ? 'green' : 'red'}>
          {value === 'buy' ? '买入' : '卖出'}
        </Tag>
      )
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (value: number) => `¥${value.toFixed(2)}`
    },
    {
      title: '数量',
      dataIndex: 'volume',
      key: 'volume',
      width: 100
    },
    {
      title: '盈亏',
      dataIndex: 'pnl',
      key: 'pnl',
      width: 100,
      render: (value?: number) => {
        if (value === undefined) return '-';
        return (
          <span style={{ color: value > 0 ? '#f5222d' : '#52c41a' }}>
            {value > 0 ? '+' : ''}{value.toFixed(2)}
          </span>
        );
      }
    },
    {
      title: '持仓天数',
      dataIndex: 'holdingDays',
      key: 'holdingDays',
      width: 100,
      render: (value?: number) => value || '-'
    }
  ];

  const riskColor = {
    conservative: 'green',
    moderate: 'orange',
    aggressive: 'red'
  };

  const riskName = {
    conservative: '保守型',
    moderate: '平衡型',
    aggressive: '激进型'
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="模型详情" bordered column={2}>
          <Descriptions.Item label="模型名称">{model.name}</Descriptions.Item>
          <Descriptions.Item label="算法类型">{model.algorithm}</Descriptions.Item>
          <Descriptions.Item label="风险偏好">
            <Tag color={riskColor[model.riskProfile as keyof typeof riskColor]}>
              {riskName[model.riskProfile as keyof typeof riskName]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={model.isActive ? 'green' : 'red'}>
              {model.isActive ? '运行中' : '已停止'}
            </Tag>
          </Descriptions.Item>
          {model.description && (
            <Descriptions.Item label="描述" span={2}>
              {model.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card>
        <Tabs
          items={[
            {
              key: 'nav',
              label: '净值曲线',
              children: <NavChart modelIds={[Number(id)]} />
            },
            {
              key: 'trades',
              label: '交易明细',
              children: (
                <Table
                  columns={tradeColumns}
                  dataSource={trades}
                  pagination={{ pageSize: 20 }}
                  rowKey="id"
                />
              )
            },
            {
              key: 'stats',
              label: '统计信息',
              children: (
                <div>
                  <p>交易次数: {trades.length}</p>
                  <p>买入次数: {trades.filter(t => t.action === 'buy').length}</p>
                  <p>卖出次数: {trades.filter(t => t.action === 'sell').length}</p>
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
}

export default ModelDetailPage;
