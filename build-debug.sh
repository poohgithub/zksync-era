#!/bin/bash

cargo build --features=rocksdb/io-uring
sudo cp target/debug/zksync_server /usr/local/bin