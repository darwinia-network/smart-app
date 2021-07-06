import { ApiPromise } from '@polkadot/api';
import { Button, notification } from 'antd';
import React, {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { LONG_DURATION, NETWORK_CONFIG } from '../config';
import { AccountType, Action, IAccountMeta, NetConfig, NetworkType } from '../model';
import { convertToSS58, getInfoFromHash, patchUrl } from '../utils';
import {
  addEthereumChain,
  connectEth,
  ConnectStatus,
  connectSubstrate,
  isNetworkConsistent,
} from '../utils/api/api';

interface StoreState {
  accountType: AccountType;
  accounts: IAccountMeta[];
  network: NetworkType;
  networkStatus: ConnectStatus; // FIXME unused now;
}

type ActionType = 'switchAccountType' | 'switchNetwork' | 'updateNetworkStatus' | 'setAccounts';

const info = getInfoFromHash();

const initialState: StoreState = {
  accountType: info.accountType || 'smart',
  network: info.network || 'pangolin',
  accounts: null,
  networkStatus: 'pending',
};

// eslint-disable-next-line complexity, @typescript-eslint/no-explicit-any
export function accountReducer(state: StoreState, action: Action<ActionType, any>): StoreState {
  switch (action.type) {
    case 'switchAccountType': {
      return { ...state, accounts: null, accountType: action.payload as AccountType };
    }

    case 'switchNetwork': {
      return { ...state, network: action.payload as NetworkType };
    }

    case 'setAccounts': {
      return { ...state, accounts: action.payload };
    }

    case 'updateNetworkStatus': {
      return { ...state, networkStatus: action.payload };
    }

    default:
      return state;
  }
}

export type ApiCtx = {
  accountType: AccountType;
  isSubstrate: boolean;
  isSmart: boolean;
  accounts: IAccountMeta[];
  api: ApiPromise;
  dispatch: Dispatch<Action<ActionType>>;
  network: NetworkType;
  networkStatus: ConnectStatus;
  setAccounts: (accounts: IAccountMeta[]) => void;
  setNetworkStatus: (status: ConnectStatus) => void;
  switchAccountType: (type: AccountType) => void;
  switchNetwork: (type: NetworkType) => void;
  setApi: (api: ApiPromise) => void;
  networkConfig: NetConfig;
};

export const ApiContext = createContext<ApiCtx>(null);

export const ApiProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const switchAccountType = useCallback(
    (payload: AccountType) => dispatch({ type: 'switchAccountType', payload }),
    []
  );
  const switchNetwork = useCallback(
    (payload: NetworkType) => dispatch({ type: 'switchNetwork', payload }),
    []
  );
  const setAccounts = useCallback(
    (payload: IAccountMeta[]) => dispatch({ type: 'setAccounts', payload }),
    []
  );
  const setNetworkStatus = useCallback(
    (payload: ConnectStatus) => dispatch({ type: 'updateNetworkStatus', payload }),
    []
  );
  const [api, setApi] = useState<ApiPromise>(null);
  const { t } = useTranslation();
  const notify = useCallback(() => {
    const key = `key${Date.now()}`;

    notification.error({
      message: t('Incorrect network'),
      description: t(
        'Network mismatch, you can switch network manually in metamask or do it automatically by clicking the button below',
        {
          type: state.network,
        }
      ),
      btn: (
        <Button
          type='primary'
          onClick={() => {
            addEthereumChain(state.network).then((res) => {
              if (res === null) {
                notification.close(key);
              }
            });
          }}
        >
          {t('Switch to {{network}}', { network: state.network })}
        </Button>
      ),
      key,
      onClose: () => notification.close(key),
      duration: null,
    });

    setNetworkStatus('fail');
  }, [setNetworkStatus, state.network, t]);
  const metamaskAccountChanged = useCallback(
    (accounts: string[]) => {
      setAccounts(accounts.map((address) => ({ address })));
    },
    [setAccounts]
  );
  const connectToEth = useCallback(
    async (chainId?: string) => {
      setNetworkStatus('connecting');

      const isMatch = await isNetworkConsistent(state.network, chainId);

      if (!isMatch) {
        notify();

        return;
      }

      const { accounts: newAccounts } = await connectEth(state.network);

      setAccounts(newAccounts);
      setNetworkStatus('success');

      window.ethereum.removeListener('accountsChanged', metamaskAccountChanged);
      window.ethereum.on('accountsChanged', metamaskAccountChanged);
    },
    [metamaskAccountChanged, notify, setAccounts, setNetworkStatus, state.network]
  );

  // eslint-disable-next-line complexity
  const connectToSubstrate = useCallback(async () => {
    const chain = await api?.rpc.system.chain();
    const chainNetwork = chain?.toHuman().toLowerCase() ?? '';

    if (chainNetwork === state.network || chainNetwork.includes(state.network)) {
      return;
    }

    setNetworkStatus('connecting');

    const { accounts: newAccounts, api: newApi, extensions } = await connectSubstrate(
      state.network
    );

    newApi.on('disconnected', () => setNetworkStatus('disconnected'));

    setApi(newApi);
    setNetworkStatus('success');

    if (!extensions.length && !newAccounts.length) {
      setAccounts(null);
    } else {
      const result =
        state.network === 'crab'
          ? newAccounts
          : newAccounts.map(({ address, ...others }) => ({
              ...others,
              address: convertToSS58(address, NETWORK_CONFIG[state.network].ss58Prefix),
            }));

      setAccounts(result);
    }
  }, [api, setAccounts, setNetworkStatus, state.network]);

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      notification.warn({
        message: 'MetaMask Undetected',
        description:
          'Please install MetaMask first! Otherwise, some functions will not work properly.',
        duration: LONG_DURATION,
      });
    }
  }, []);

  /**
   * connect to substrate or metamask when account type changed.
   */
  useEffect(() => {
    // eslint-disable-next-line complexity
    (async () => {
      try {
        if (state.accountType === 'substrate') {
          connectToSubstrate();
        }

        if (state.accountType === 'smart') {
          connectToEth();

          window.ethereum.on('chainChanged', connectToEth);
        }

        patchUrl({ accountType: state.accountType });
      } catch (error) {
        setNetworkStatus('fail');
      }
    })();

    return () => {
      window.ethereum.removeListener('chainChanged', connectToEth);
    };
  }, [connectToEth, connectToSubstrate, setNetworkStatus, state.accountType]);

  useEffect(() => {
    if (state.networkStatus === 'disconnected') {
      if (state.accountType === 'smart') {
        connectToEth();
      }

      if (state.accountType === 'substrate') {
        connectToSubstrate();
      }
    }
  }, [connectToEth, connectToSubstrate, state.accountType, state.networkStatus]);

  return (
    <ApiContext.Provider
      value={{
        ...state,
        dispatch,
        switchAccountType,
        switchNetwork,
        setNetworkStatus,
        setAccounts,
        setApi,
        api,
        isSmart: state.accountType === 'smart',
        isSubstrate: state.accountType === 'substrate',
        networkConfig: NETWORK_CONFIG[state.network],
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
