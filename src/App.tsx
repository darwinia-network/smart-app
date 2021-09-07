import { UnorderedListOutlined } from '@ant-design/icons';
import { Affix, Dropdown, Layout, Menu, Spin, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import { Connection } from './components/Connection';
import { KtonDraw } from './components/KtonDraw';
import { Language } from './components/Language';
import { ThemeSwitch } from './components/ThemeSwitch';
import { Path, routes } from './config/routes';
import { useApi } from './hooks';

const { Header, Content } = Layout;

interface LinkItem {
  name: string;
  href?: string;
  path?: string;
}

function App() {
  const { t } = useTranslation();
  const { networkStatus, network, networkConfig } = useApi();
  const links = useMemo<LinkItem[]>(
    () => [
      { name: 'User Guide', href: 'https://docs.crab.network/dvm-intro' },
      {
        name: 'Wallet',
        href: `https://apps.darwinia.network/?${encodeURIComponent(`rpc=${networkConfig.rpc}`)}`,
      },
      { name: 'Wormhole', href: 'https://wormhole.darwinia.network' },
      { name: 'Explorer', href: `https://${network}.subscan.io` },
    ],
    [network, networkConfig]
  );

  return (
    <Layout style={{ height: '100vh' }} className='overflow-scroll'>
      <Affix offsetTop={1}>
        <Header
          className='flex items-center justify-between sm:px-4 px-1'
          style={{ marginTop: -1 }}
        >
          <Link to={Path.root}>
            <img src={networkConfig.facade.logoWithText} alt='' />
          </Link>

          <div className='flex flex-row-reverse sm:flex-row sm:justify-between items-center flex-1 md:px-8'>
            <Dropdown
              className='lg:hidden mx-2'
              overlay={
                <Menu>
                  {links.map((item, index) => (
                    <Menu.Item onClick={() => window.open(item.href, '_blank')} key={index}>
                      {item.name}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <UnorderedListOutlined />
            </Dropdown>

            <div className='flex-1 hidden lg:block'>
              {links.map((item, index) => (
                <Typography.Link
                  onClick={() => window.open(item.href, '_blank')}
                  key={index}
                  className={`mx-8 opacity-80 hover:opacity-100 transition-colors duration-500 text-${network}.main`}
                >
                  {t(item.name)}
                </Typography.Link>
              ))}
            </div>

            <Connection />

            <ThemeSwitch />
          </div>
        </Header>
      </Affix>
      <Content className='sm:px-16 sm:py-8 px-2 py-1'>
        <Spin spinning={networkStatus === 'connecting'}>
          <Switch>
            {routes.map((item, index) => (
              <Route key={index} {...item}></Route>
            ))}
          </Switch>
          <Language className='fixed bottom-8 right-8' network={network} />
          <KtonDraw />
        </Spin>
      </Content>
    </Layout>
  );
}

export default App;
