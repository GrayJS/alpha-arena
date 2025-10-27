import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { getNavData, compareModels } from '../services/accountService';
import { Spin, Alert } from 'antd';

interface NavChartProps {
  modelIds?: number[];
}

function NavChart({ modelIds = [1, 2, 3] }: NavChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (modelIds.length > 1) {
          // 获取多模型对比数据
          const compareData = await compareModels({ 
            modelIds: modelIds.join(','),
            startDate: undefined, // 可以添加日期筛选
            endDate: undefined
          });
          
          // 转换数据结构
          const chartData: any[] = [];
          const allDates = new Set<string>();
          
          // 获取所有日期
          Object.values(compareData.data as any).forEach((modelData: any) => {
            modelData.forEach((item: any) => {
              allDates.add(item.date);
            });
          });
          
          const sortedDates = Array.from(allDates).sort();
          
          sortedDates.forEach((date, index) => {
            const point: any = { date };
            
            modelIds.forEach((modelId, idx) => {
              const modelData = compareData.data[modelId];
              if (modelData) {
                const item = modelData.find((d: any) => d.date === date);
                if (item) {
                  point[`model${idx + 1}`] = parseFloat(item.nav.toFixed(4));
                }
              }
            });
            
            chartData.push(point);
          });
          
          setData(chartData);
        } else {
          // 获取单模型数据
          const navData = await getNavData(modelIds[0]);
          const chartData = navData.data.list.map((item: any) => ({
            date: item.date,
            nav: item.nav
          }));
          setData(chartData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('加载数据失败，请稍后重试');
        setLoading(false);
      }
    };

    fetchData();
  }, [modelIds]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  if (data.length === 0) {
    return <Alert message="暂无数据" type="info" showIcon />;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          interval={Math.floor(data.length / 6)}
        />
        <YAxis 
          label={{ value: '净值', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="model1" 
          stroke="#1890ff" 
          name="GPT-4 策略"
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="model2" 
          stroke="#52c41a" 
          name="XGBoost 策略"
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="model3" 
          stroke="#faad14" 
          name="LSTM 策略"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default NavChart;

