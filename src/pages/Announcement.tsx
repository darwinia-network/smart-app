import { PropsWithChildren } from 'react';
import { Button, Typography, Tooltip } from 'antd';

const ButtonLink = ({ href, children }: PropsWithChildren<{ href: string }>) => (
  <Button
    className='flex justify-center items-center py-3 px-5 w-full'
    size='large'
    type='link'
    style={{ background: '#5745DE' }}
    href={href}
    target='_blank'
  >
    <span className='text-white'>{children}</span>
  </Button>
);

const Title = ({ children }: PropsWithChildren<unknown>) => (
  <Typography.Title level={2} style={{ marginBottom: '0.3rem' }}>
    {children}
  </Typography.Title>
);

const Text = ({
  children,
  withDelete,
  isItalic,
}: PropsWithChildren<{ withDelete?: boolean; isItalic?: boolean }>) => (
  <Typography.Text className='text-sm font-medium' delete={withDelete} italic={isItalic}>
    {children}
  </Typography.Text>
);

const Link = ({
  children,
  href,
  className,
  isComingSoon,
}: PropsWithChildren<{ href: string; className?: string; isComingSoon?: boolean }>) =>
  isComingSoon ? (
    <Tooltip title='Coming soon'>
      <Typography.Text
        underline
        className={`text-sm font-medium cursor-not-allowed ${className}`}
        style={{ color: '#1890FF', width: 'fit-content' }}
      >
        {children}
      </Typography.Text>
    </Tooltip>
  ) : (
    <Typography.Link
      target='_blank'
      rel='noopener noreferrer'
      underline
      className={`text-sm font-medium ${className}`}
      style={{ color: '#1890FF', width: 'fit-content' }}
      href={href}
    >
      {children}
    </Typography.Link>
  );

interface Props {
  token: 'crab' | 'ckton';
  helix?: boolean;
  apps?: boolean;
}

const AnnouncementCard = ({ token, helix, apps }: Props) => {
  return (
    <div className='shadow-lg w-96 rounded-xl pb-9 flex-1'>
      <div
        className='flex items-center py-6 pl-10 rounded-xl mb-11'
        style={{ backgroundColor: '#5745DE' }}
      >
        <img alt='...' height={84} width={84} src={`/image/announcement/${token}.svg`} />
        <span className='ml-5 font-medium text-4xl text-white uppercase'>{token}</span>
      </div>

      <div className='flex flex-col items-center px-12'>
        <div className='flex justify-center items-center space-x-2 mb-8 py-7 border border-gray-300 w-full rounded-xl'>
          <div
            className='flex justify-center items-center py-3 px-5 rounded'
            style={{ background: 'rgba(191, 194, 234, 0.413501)' }}
          >
            <span className='text-sm font-medium' style={{ color: '#5745DE' }}>
              Substrate
            </span>
          </div>
          <img alt='...' height={24} width={24} src='/image/announcement/swap.svg' />
          <div
            className='flex justify-center items-center py-3 px-5 rounded'
            style={{ background: 'rgba(191, 194, 234, 0.413501)' }}
          >
            <span className='text-sm font-medium' style={{ color: '#5745DE' }}>
              Smart
            </span>
          </div>
        </div>
        {helix && (
          <ButtonLink href='https://apps.helixbridge.app/'>{'Go to Helix Bridge >'}</ButtonLink>
        )}
        {helix && apps ? (
          <span className='font-medium text-base my-2' style={{ color: '#979797' }}>
            or
          </span>
        ) : null}
        {apps && (
          <ButtonLink href='https://apps.darwinia.network/toolbox?network=crab'>
            {'Go to Darwinia Apps >'}
          </ButtonLink>
        )}
      </div>
    </div>
  );
};

const Announcement = () => {
  return (
    <div className='flex justify-center items-center' style={{ minHeight: '100vh' }}>
      <div className='flex flex-col pt-12 pb-36'>
        <Title>Annnouncement</Title>
        <Text>
          To be more user-friendly, we’ve integrated{' '}
          <Link href='https://apps.darwinia.network/'>Darwinia Apps</Link> with the Darwinia Smart
          App.
        </Text>
        <Text>
          CRAB & CKTON transfer between Crab Smart Chain and Crab Chain is supported in Darwinia
          Apps.
        </Text>
        <Text>
          Please note that <Text isItalic>https://smart.darwinia.network</Text> is no longer
          operating.
        </Text>

        <Link className='my-3' href='#' isComingSoon>
          {'Tutorial >'}
        </Link>

        <div className='flex space-x-14'>
          <AnnouncementCard token='crab' helix apps />
          <AnnouncementCard token='ckton' apps />
        </div>
      </div>
    </div>
  );
};

export default Announcement;
