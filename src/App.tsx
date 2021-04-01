import { Button, Layout, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import { Connection } from './components/Connection';
import { Language } from './components/Language';
import { Path, routes } from './config/routes';
import { useAccount } from './hooks';

const { Header, Content } = Layout;

const links: { name: string; href?: string; path?: string }[] = [
  { name: 'DVM Guard', path: Path.intro },
  { name: 'Wallet', href: '' },
  { name: 'Wormhole', href: '' },
  { name: 'Browser', href: '' },
];

function App() {
  const { t } = useTranslation();
  const { networkStatus } = useAccount();

  return (
    <Layout style={{ height: '100vh' }}>
      <Header className='flex items-center justify-between px-4 bg-white'>
        <Link to={Path.root} className='h-1/2 flex items-center px-4 py-2 bg-main rounded-xl'>
          <img src='/image/darwinia.7ff17f8e.svg' style={{ height: 46 }} alt='' />
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
