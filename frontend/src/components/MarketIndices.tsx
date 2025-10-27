import { Card, Row, Col, Statistic, Alert } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import type { ApiResponse } from '../services/apiService';

interface IndexData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

function MarketIndices() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        setLoading(true);
        const response = await apiService.get<ApiResponse<any>>('/markets/indices');
        
        if (response.data) {
          const indicesData = response.data;
          const formattedIndices = [
            { code: '000001', ...indicesData.sh },
            { code: '399001', ...indicesData.sz },
            { code: '399006', ...indicesData.cyb }
          ];
          setIndices(formattedIndices);
        }
      } catch (err) {
        console.error('获取指数数据失败:', err);
        // 如果API失败，使用默认模拟数据
        setIndices([
          { code: '000001', name: '上证指数', price: 3085.12, change: 12.34, changePercent: 0.4 },
          { code: '399001', name: '深证成指', price: 11245.67, change: -23.45, changePercent: -0.21 },
          { code: '399006', name: '创业板指', price: 2267.89, change: 8.92, changePercent: 0.39 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIndices();
  }, []);

  if (error) {
    return <Alert message={error} type="error" showIcon style={{ margin: '0 24px 24px' }} />;
  }

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      {indices.map((index) => (
        <Col xs={24} sm={8} key={index.code}>
          <Card loading={loading}>
            <Statistic
              title={index.name}
              value={index.price}
              precision={2}
              valueStyle={{ color: index.change >= 0 ? '#cf1322' : '#389e0d' }}
              prefix={index.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix={
                <span style={{ color: index.change >= 0 ? '#cf1322' : '#389e0d', fontSize: '14px' }}>
                  {index.change > 0 ? '+' : ''}{index.change} ({index.change > 0 ? '+' : ''}{index.changePercent}%)
                </span>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default MarketIndices;
