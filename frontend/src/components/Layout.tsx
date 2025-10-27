import { ReactNode } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const { Header, Content, Footer } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', label: '首页' },
    { key: '/leaderboard', label: '排行榜' }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntLayout className="layout">
      <Header>
        <div className="logo">
          <span className="logo-text">Alpha Arena</span>
          <span className="logo-subtitle">· A股版</span>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ lineHeight: '64px' }}
        />
      </Header>
      <Content className="content">
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Alpha Arena · A股版 ©2024 Created with ❤️
      </Footer>
    </AntLayout>
  );
}

export default Layout;

