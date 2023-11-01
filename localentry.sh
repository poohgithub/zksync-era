#!/bin/bash
set -ea

echo "Starting server in local environment"

if [ -z $1 ]
then
  echo "No parameter passed"
else
  echo "Parameter passed: $1"
fi
config=$1

if [ "$config" != "leavedata" ]
then
  rm  -rf ./local_data
  echo "data folder removed"
fi


DATABASE_URL=postgres://postgres@localhost:5432/zksync_local
ETH_CLIENT_WEB3_URL=http://localhost:8545
ZKSYNC_LOCAL_SETUP=true
ZKSYNC_LOCAL_SERVER=true
# Disable all checks
ZKSYNC_ACTION=dont_ask

cd $ZKSYNC_HOME/sdk/zksync-web3.js/ && yarn add ethers@5.7.2 && yarn build
# Build `zk` tool
cd $ZKSYNC_HOME/infrastructure/zk && yarn && yarn build
# Build `local-setup-preparation` tool
cd $ZKSYNC_HOME/infrastructure/local-setup-preparation && yarn
# Build L1 contracts package (contracts themselves should be already built)
cd $ZKSYNC_HOME/contracts/ethereum && yarn
# Same for L2 contracts
cd $ZKSYNC_HOME/contracts/zksync && yarn

# wait till db service is ready
until psql ${DATABASE_URL%/*} -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 5
done

echo "Start database initialization"

# ensure database initialization
if ! psql $DATABASE_URL -c '\q' 2>/dev/null;
then
    echo "Initialing local environment"
    psql ${DATABASE_URL%/*} -c "create database ${DATABASE_URL##*/}"
    find $ZKSYNC_HOME/core/lib/dal/migrations -name "*up.sql" | sort | xargs printf -- ' -f %s' | xargs -t psql $DATABASE_URL

    cd $ZKSYNC_HOME/infrastructure/zk
    # Compile configs
    yarn start config compile

    cd $ZKSYNC_HOME
    
    # Override values for database URL and eth client in the toml config files
    # so they will be taken into account
    sed -i '' 's!^database_url=.*$!database_url="'"$DATABASE_URL"'"!' etc/env/base/private.toml
    sed -i '' 's!^web3_url=.*$!web3_url="'"$ETH_CLIENT_WEB3_URL"'"!' etc/env/base/eth_client.toml
    sed -i '' 's!^path=.*$!path="./local_data"!' etc/env/base/database.toml
    sed -i '' 's!^state_keeper_db_path=.*$!state_keeper_db_path="./local_data/state_keeper"!' etc/env/base/database.toml
    sed -i '' 's!^merkle_tree_backup_path=.*$!merkle_tree_backup_path="./local_data/backups"!' etc/env/base/database.toml

    # Switch zksolc compiler source from docker to binary
    sed -i '' "s!'docker'!'binary'!" contracts/zksync/hardhat.config.ts

    cd $ZKSYNC_HOME/infrastructure/zk

    # Compile configs again (with changed values)
    yarn start config compile

    # Perform initialization
    yarn start lightweight-init
    yarn start f yarn --cwd $ZKSYNC_HOME/infrastructure/local-setup-preparation start
fi

# start server
cd $ZKSYNC_HOME
source etc/env/dev.env
source etc/env/.init.env
exec zksync_server
