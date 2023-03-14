import {Address, Cell, TonClient} from "ton";
import {isNftCollectionContract} from "./isNftCollectionContract";
import {SmartContract} from "ton-contract-executor";
import {NftCollectionLocal} from "./NftCollectionLocal";
const {api_key} = require("../../../env.json")

describe('collection detector', () => {
    it('should detect nft collection', async () => {
        let client = new TonClient({
            endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
            apiKey: api_key
        })

        let address = Address.parse('kQAiDMwmO6VjzkReyAnqpFJOzvAiPHDzRG9PMOiaG3n38vwx')
        let res = await client.getContractState(address)

        let code = Cell.fromBoc(res.code!)[0]
        let data = Cell.fromBoc(res.data!)[0]

        let contract = await SmartContract.fromCell(code, data);

        let isCollection = await isNftCollectionContract(contract)

        expect(isCollection).toBe(true)

        const collection = await NftCollectionLocal.createFromContract(contract, address);
        let collectionData = await collection.getCollectionData();
        console.log(collectionData.collectionContent);
        console.log(collectionData.ownerAddress.toFriendly());
        console.log(collectionData.nextItemId);

        let indCell = new Cell()
        indCell.bits.writeBuffer(Buffer.from('1'))
        const nftContent = await collection.getNftContent(0, indCell)
        console.log(nftContent);
    })
})
