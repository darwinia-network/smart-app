import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import Bignumber from 'bignumber.js';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-eth';
import { DVM_RECEIVE_ADDRESS, TOKEN_ERC20_KTON } from '../../config';
import KtonABI from './abi/ktonABI.json';

/**
 * @param account receive account - metamask current active account;
 * @param amount receive amount
 * @returns transaction hash
 */
export async function receiveKtonOnSmart(account: string, amount: number): Promise<string> {
  // ?FIXE: use code below after contract updated.
  // const web3 = new Web3(window.ethereum || window.web3.currentProvider);
  // const ktonContract = new web3.eth.Contract(x16ABI as any, TOKEN_ERC20_KTON);
  // const result = await ktonContract.methods
  //   .transfer_and_call(
  //     TOKEN_ERC20_KTON,
  //     web3.utils.toWei(amount)
  //   )
  //   .send({ from: account });

  const valueLength = 64;
  const count = new Bignumber(amount).toString(16);
  // tslint:disable-next-line: no-magic-numbers
  const value = new Array(valueLength - count.length).fill(0).join('') + count;
  // tslint:disable-next-line: no-magic-numbers
  const data = `0x784deab5000000000000000000000000${TOKEN_ERC20_KTON.slice(2)}${value}`;
  const web3 = new Web3(window.ethereum);
  const txHash = await web3.eth.sendTransaction({
    from: account,
    to: DVM_RECEIVE_ADDRESS,
    data,
    value: '0x00',
    gas: 300000,
  });

  return txHash.transactionHash;
}

export async function receiveKtonOnMainnet(
  account: string,
  amount: number,
  from = '0x245B4775082C144C22a4874B0fBa8c70c510c5AE'
  // from = '0xb4268E308027f2e554Fb84E8a5B5eF2BD5916e9a'
) {
  const withdrawalAddress = u8aToHex(decodeAddress(account));
  const web3 = new Web3(window.ethereum || window.web3.currentProvider);
  // tslint:disable-next-line: no-any
  const ktonContract = new web3.eth.Contract(KtonABI as any, TOKEN_ERC20_KTON);
  const txHash: TransactionReceipt = await ktonContract.methods
    .withdraw(withdrawalAddress, amount)
    .send({ from });

  return txHash.transactionHash;
}
