import { UnorderedListOutlined } from '@ant-design/icons';
import { Affix, Button, Dropdown, Layout, Menu, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import { Connection } from './components/Connection';
import { KtonDraw } from './components/KtonDraw';
import { Language } from './components/Language';
import { Path, routes } from './config/routes';
import { useApi } from './hooks';
import { NetworkConfig } from './model';
import crabThemeJson from './theme/crab.json';
import darwiniaThemeJson from './theme/darwinia.json';
import pangolinThemeJson from './theme/pangolin.json';

const { Header, Content } = Layout;

interface LinkItem {
  name: string;
  href?: string;
  path?: string;
}

const THEME_CONFIG: NetworkConfig<{ [key in keyof typeof darwiniaThemeJson]: string }> = {
  darwinia: darwiniaThemeJson,
  crab: crabThemeJson,
  pangolin: pangolinThemeJson,
};

function App() {
  const { t } = useTranslation();
  const { networkStatus, network, networkConfig } = useApi();
  const linkItem = (item: LinkItem) =>
    item.path ? (
      <Link to={item.path}>{t(item.name)}</Link>
    ) : (
      <span onClick={() => window.open(item.href)}>{t(item.name)}</span>
    );
  const links = useMemo<LinkItem[]>(
    () => [
      { name: 'DVM Guide', href: 'https://crab.network/docs/dvm-intro/' },
      {
        name: 'Wallet',
        href: `https://apps.darwinia.network/?${encodeURIComponent(`rpc=${networkConfig.rpc}`)}`,
      },
      { name: 'Wormhole', href: 'https://wormhole.darwinia.network' },
      { name: 'Explorer', href: `https://${network}.subscan.io` },
    ],
    [network, networkConfig]
  );

  useEffect(() => {
    window.less
      .modifyVars(THEME_CONFIG[network])
      .then(() => console.log('Theme changed success'))
      // tslint:disable-next-line: no-any
      .catch((error: any) => console.log(error));
  }, [network]);

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
              className='md:hidden mx-2'
              overlay={
                <Menu>
                  {links.map((item, index) => (
                    <Menu.Item key={index}>{linkItem(item)}</Menu.Item>
                  ))}
                </Menu>
              }
            >
              <UnorderedListOutlined />
            </Dropdown>

            <div className='flex-1 hidden md:block'>
              {links.map((item, index) => (
                <Button type='link' key={index}>
                  {linkItem(item)}
                </Button>
              ))}
            </div>

            <Connection />
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
          <Language className='text-2xl cursor-pointer ml-16 fixed bottom-8 right-8 text-purple-700' />
          <KtonDraw />
        </Spin>
      </Content>
    </Layout>
  );
}

export default App;
