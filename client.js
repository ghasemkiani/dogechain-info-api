import {Obj} from "@ghasemkiani/base";
import {cutil} from "@ghasemkiani/base";

class Client extends Obj {
	static {
		cutil.extend(this.prototype, {
			url: "https://dogechain.info",
			stub: "/api/v1",
		});
	}
	async toGet(path) {
		let client = this;
		let {url} = client;
		let {stub} = client;
		url += stub;
		url += path;
		let rsp = await fetch(url);
		let {success, error, ...data} = await rsp.json();
		if (success) {
			return data;
		} else {
			throw new Error(error);
		}
	}
	async toGetBalance(address) {
		let client = this;
		let {balance, confirmed, unconfirmed} = await client.toGet(`/address/balance/${address}`);
		return {balance, confirmed, unconfirmed};
	}
	async toGetAmountReceived(address) {
		let client = this;
		let {received} = await client.toGet(`/address/received/${address}`);
		return received;
	}
	async toGetAmountSent(address) {
		let client = this;
		let {sent} = await client.toGet(`/address/sent/${address}`);
		return sent;
	}
	async toGetUnspentOutputs(address) {
		let client = this;
		let {unspent_outputs} = await client.toGet(`/address/unspent/${address}`);
		return unspent_outputs;
	}
	async toGetTransactionCount(address) {
		let client = this;
		let {transaction_count: {sent, received, total}} = await client.toGet(`/address/transaction_count/${address}`);
		return {sent, received, total};
	}
	async toGetAllTransactions(address) {
		let client = this;
		let txs = [];
		let page = 1;
		while (true) {
			let {transactions} = await client.toGet(`/address/transactions/${address}/${page++}`);
			if (transactions.length === 0) {
				break;
			} else {
				txs = txs.concat(transactions);
			}
		}
		return txs;
	}
	async toGetTransaction(hash) {
		let client = this;
		let {transaction} = await client.toGet(`/transaction/${hash}`);
		return transaction;
	}
	async toGetLatestBlockHash() {
		let client = this;
		let {hash} = await client.toGet(`/block/besthash`);
		return hash;
	}
	async toGetBlock(heightOrHash) {
		let client = this;
		let {block} = await client.toGet(`/block/${heightOrHash}`);
		return block;
	}
}

export {Client};
