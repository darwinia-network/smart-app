import { Button, Layout, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import { Connection } from './components/Connection';
import { Language } from './components/Language';
import { NETWORK_STYLE_CONFIG } from './config/network';
import { Path, routes } from './config/routes';
import { useApi } from './hooks';
import { NetworkConfig } from './model';
import crabThemeJson from './theme/crab.json';
import darwiniaThemeJson from './theme/darwinia.json';
import pangolinThemeJson from './theme/pangolin.json';
import { clsName } from './utils';

const { Header, Content } = Layout;

const links: { name: string; href?: string; path?: string }[] = [
  { name: 'DVM Guide', path: Path.intro },
  { name: 'Wallet', href: '' },
  { name: 'Wormhole', href: '' },
  { name: 'Browser', href: '' },
];

const THEME_CONFIG: NetworkConfig<{ [key in keyof typeof darwiniaThemeJson]: string }> = {
  darwinia: darwiniaThemeJson,
  crab: crabThemeJson,
  pangolin: pangolinThemeJson,
};

function App() {
  const { t } = useTranslation();
  const { networkStatus, network } = useApi();
  const linkCls = useMemo(
    () =>
      clsName(
        'h-1/2 flex items-center px-4 py-2 rounded-xl',
        NETWORK_STYLE_CONFIG[network].bgClsName
      ),
    [network]
  );

  useEffect(() => {
    window.less
      .modifyVars(THEME_CONFIG[network])
      .then(() => console.log('success'))
      // tslint:disable-next-line: no-any
      .catch((error: any) => console.log(error));
  }, [network]);

  return (
    <Layout style={{ height: '100vh' }}>
      <Header className='flex items-center justify-between px-4'>
        <Link to={Path.root} className={linkCls}>
          <img src={NETWORK_STYLE_CONFIG[network].logo} style={{ height: 46 }} alt='' />
          <span className='text-white'>DVM</span>
        </Link>

        <div className='flex justify-between items-center flex-1 px-8'>
          <div className='flex-1'>
            {links.map((item, index) => (
              <Button type='link' key={index}>
                {item.path ? (
                  <Link to={item.path}>{t(item.name)}</Link>
                ) : (
                  <span onClick={() => window.open(item.href)}>{t(item.name)}</span>
                )}
              </Button>
            ))}
          </div>

          <Connection />
        </div>
      </Header>
      <Content className='px-16 py-8'>
        <Spin spinning={networkStatus === 'connecting'}>
          <Switch>
            {routes.map((item, index) => (
              <Route key={index} {...item}></Route>
            ))}
          </Switch>
          <Language className='text-2xl cursor-pointer ml-16 fixed bottom-8 right-8 text-purple-700' />
        </Spin>
      </Content>
    </Layout>
  );
}

export default App;
