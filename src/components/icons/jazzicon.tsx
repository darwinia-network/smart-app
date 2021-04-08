// @ts-ignore
import jazzicon from '@metamask/jazzicon';
import { CSSProperties, useEffect, useRef } from 'react';

interface JazzIconProps {
  address: string;
  className?: string;
  diameter?: number;
  style?: CSSProperties;
}

// tslint:disable-next-line: no-any
const cache: { [key: string]: any } = {};

function generateIdenticonSvg(address: string, diameter: number) {
  const cacheId = `${address}:${diameter}`;
  // check cache, lazily generate and populate cache
  const identicon = cache[cacheId] || (cache[cacheId] = generateNewIdenticon(address, diameter));
  // create a clean copy so you can modify it
  const cleanCopy = identicon.cloneNode(true);

  return cleanCopy;
}

function generateNewIdenticon(address: string, diameter: number): HTMLDivElement {
  const numericRepresentation = jsNumberForAddress(address);
  const identicon = jazzicon(diameter, numericRepresentation);

  return identicon;
}

function jsNumberForAddress(address: string): number {
  // tslint:disable-next-line: no-magic-numbers
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);

  return seed;
}

// tslint:disable-next-line: no-magic-numbers
export function JazzIcon({ address, className = '', style = {}, diameter = 46 }: JazzIconProps) {
  const container = useRef<HTMLDivElement>();

  useEffect(() => {
    const element = generateIdenticonSvg(address, diameter);

    container.current.appendChild(element);
  }, [address, diameter]);

  return <div className={className} ref={container} style={style}></div>;
}
