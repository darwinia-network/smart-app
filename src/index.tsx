import ReactDOM from 'react-dom';
import { Suspense } from 'react';
import { Button } from 'antd';
import reportWebVitals from './reportWebVitals';
import './index.css';

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
          <Button
            className='flex justify-center items-center py-3 px-5 w-full text-white'
            size='large'
            type='primary'
            style={{ background: '#5745DE' }}
          >
            {'Go to Helix Bridge >'}
          </Button>
        )}
        {helix && apps ? (
          <span className='font-medium text-base my-2' style={{ color: '#979797' }}>
            or
          </span>
        ) : null}
        {apps && (
          <Button
            className='flex justify-center items-center py-3 px-5 w-full text-white'
            size='large'
            type='primary'
            style={{ background: '#5745DE' }}
          >
            {'Go to Darwinia Apps >'}
          </Button>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(
  <Suspense fallback='loading'>
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='flex space-x-14'>
        <AnnouncementCard token='crab' helix apps />
        <AnnouncementCard token='ckton' apps />
      </div>
    </div>
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
