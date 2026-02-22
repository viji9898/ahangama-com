import { Layout, Menu } from 'antd'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

type Props = {
  children: ReactNode
}

export function AppShell({ children }: Props) {
  const location = useLocation()

  const selectedKey = location.pathname === '/partnership' ? 'partnership' : 'home'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 700, marginRight: 16 }}>Ahangama</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: 'home',
              label: <Link to="/">Home</Link>,
            },
            {
              key: 'partnership',
              label: <Link to="/partnership">Partnership</Link>,
            },
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Layout.Header>

      <Layout.Content style={{ padding: 24 }}>{children}</Layout.Content>
    </Layout>
  )
}
