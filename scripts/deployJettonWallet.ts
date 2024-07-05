import { JettonWallet } from '../wrappers/JettonWallet';
import { Address, toNano } from '@ton/core';
import { JettonMinter, JettonMinterContent, jettonContentToCell, jettonMinterConfigToCell } from '../wrappers/JettonMinter';
import { compile, NetworkProvider, UIProvider} from '@ton/blueprint';
import { promptAddress, promptBool, promptUrl } from '../wrappers/ui-utils';

const formatUrl = "https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain";
const exampleContent = {
                          "name": "Sample Jetton",
                          "description": "Sample of Jetton",
                          "symbol": "JTN",
                          "decimals": 0,
                          "image": "https://www.svgrepo.com/download/483336/coin-vector.svg"
                       };
const urlPrompt = 'Please specify url pointing to jetton metadata(json):';

export async function run(provider: NetworkProvider) {
    
    const ui       = provider.ui();
    const sender   = provider.sender();
    const ownerPrompt = `Please specify owner address`;
    const masterPrompt = `Please specify master contract address`;
    ui.write(`Jetton deployer\nCurrent deployer onli supports off-chain format:${formatUrl}`);

    let owner      = await promptAddress(ownerPrompt, ui, sender.address);
    ui.write(`Owner address:${owner}\n`);
    let master_address = await promptAddress(masterPrompt, ui);
    ui.write(`Jetton Master Contract:${master_address}`);

    const wallet_code = await compile('JettonWallet');

    const jettonWallet = JettonWallet.createFromConfig({owner,
        master_address,
      wallet_code}, await compile('JettonWallet'));
    
      console.log(jettonWallet.address);
    await provider.deploy(jettonWallet, toNano('0.05'));

    const openedContract = provider.open(jettonWallet);

    // run methods on `openedContract`
}
