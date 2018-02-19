# Charity Ledger Explorer - Backend API

Nodejs API for Charity Ledger Explorer Client

https://github.com/1p1-lab/charity-ledger-explorer-client

### Charity Blockchain Association

Charity Blockchain Association is an association of honest charitable foundations that use blockchain technology for accounting purposes. The unifying principle is that all members of the association adhere to maximum transparency of their operations.

http://charityblockchain.ru/association

http://charityblockchain.info/association

# Get started

Install dependencies:
```
npm install
```

## Setup environment

1. Copy `server/data/db.sqlite3.empty` to `server/data/db.sqlite3`
2. Copy `server/config.json.example` to `server/config.json` and edit variables  
3. Copy `server/.env.dist` to `server/.env` and edit variables  

## Migrations and seeds

Install [sequelize-cli](https://github.com/sequelize/cli):
```
npm install -g sequelize-cli
```

Install all migrations:
```
sequelize db:migrate
```

Type `sequelize help` for more commands or visit [http://docs.sequelizejs.com](http://docs.sequelizejs.com) 

## Load data

You can load test data from local seeds or from blockchain

To load from seeds
```
sequelize db:seed:all
```

To load from blockachain:

* Check **PROVIDER_HOST** variable in `server/.env`

* Install and run Ethereum client, for example, geth:
``` bash
geth --rinkeby --syncmode=fast --rpc --rpcaddr=0.0.0.0 --rpcport=8545 --rpcapi="db,eth,net,web3,personal,web3" --rpccorsdomain="*"
```
See [geth command line options](https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options) for details

Wait until Ethereum network synchronize data
 
* Run commands
``` bash
node server/console.js programs:update -f 2
node server/console.js projects:update -f 2
node server/console.js targets:update -f 2
node server/console.js costs:update -f 2
node server/console.js donators:update
node server/console.js donations:update -f 2 --min-date=2017-12-01
node server/console.js expenses:update -f 2 --min-date=2017-12-31
```

## Visualize data

* Create `client` directory and 
* Clone and setup to that client repository
* Run web-server
``` bash
node .
```
* Open in browser link `http://localhost:3000`
* Enter one of test email `john@1p1.io`, `mike@1p1.io`, `lucy@1p1.io` to see loaded donations 
