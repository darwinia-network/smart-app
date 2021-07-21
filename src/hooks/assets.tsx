import { useContext } from 'react';
import { AssetsContext, AssetsCtx } from '../providers/assets-provider';

export const useAssets = () => useContext(AssetsContext) as Exclude<AssetsCtx, null>;
