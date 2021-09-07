import { svgIconFactory } from './icon-factory';

function ViewBrowser() {
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
        id='1.通用/2.Icon图标/Line/View'
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
          d='M7.99915997,3.333 L7.99915997,4.68 L4.67667808,4.6808319 L4.67667808,11.2010807 L11.138299,11.2010807 L11.13816,7.999 L12.49916,7.999 L12.5,11.5833339 C12.5,12.0534333 12.1457761,12.4408816 11.6894263,12.4938329 L11.5824166,12.5 L4.24174332,12.5 C3.77117349,12.5 3.38333749,12.1461302 3.33033322,11.6902365 L3.32415997,11.5833339 L3.32415997,4.24999815 C3.32415997,3.7437372 3.73497581,3.33333201 4.24174332,3.33333201 L7.99915997,3.333 Z M12.5824166,2.333 C13.0529865,2.333 13.4408225,2.68686979 13.4938267,3.14276346 L13.5,3.24966614 L13.5,6.83220045 L12.148,6.83220045 L12.14716,4.663 L8.45190296,8.35875721 L7.39124279,7.29809704 L11.05716,3.631 L8.825,3.63220045 L8.825,2.33320045 L12.5824166,2.333 Z'
          id='形状结合'
          fillOpacity='0.65'
          fill='currentColor'
        ></path>
      </g>
    </svg>
  );
}

export const ViewBrowserIcon = svgIconFactory(ViewBrowser);
