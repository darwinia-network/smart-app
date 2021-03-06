import { svgIconFactory } from './icon-factory';

function Close() {
  return (
    <svg
      width='16px'
      height='16px'
      viewBox='0 0 16 16'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      className='dark:text-white'
    >
      <g
        id='1.通用/2.Icon图标/Line/Close'
        stroke='none'
        strokeWidth='1'
        fill='none'
        fillRule='evenodd'
      >
        <rect
          id='矩形'
          fill='currentColor'
          fillRule='nonzero'
          opacity='0'
          x='0'
          y='0'
          width='16'
          height='16'
        ></rect>
        <path
          d='M3.75735931,3.75735931 C4.1478836,3.36683502 4.78104858,3.36683502 5.17157288,3.75735931 L5.17157288,3.75735931 L7.99946609,6.58446609 L10.8284271,3.75735931 C11.2189514,3.36683502 11.8521164,3.36683502 12.2426407,3.75735931 C12.633165,4.1478836 12.633165,4.78104858 12.2426407,5.17157288 L9.41446609,7.99946609 L12.2426407,10.8284271 C12.6031246,11.1889111 12.6308542,11.7561421 12.3258293,12.1484333 L12.2426407,12.2426407 C11.8521164,12.633165 11.2189514,12.633165 10.8284271,12.2426407 L10.8284271,12.2426407 L7.99946609,9.41446609 L5.17157288,12.2426407 C4.78104858,12.633165 4.1478836,12.633165 3.75735931,12.2426407 C3.36683502,11.8521164 3.36683502,11.2189514 3.75735931,10.8284271 L6.58446609,7.99946609 L3.75735931,5.17157288 C3.39687535,4.81108891 3.36914582,4.24385786 3.67417071,3.85156665 Z'
          id='形状结合'
          fillOpacity='0.65'
          fill='currentColor'
        ></path>
      </g>
    </svg>
  );
}

export const CloseIcon = svgIconFactory(Close);
