#!/bin/bash

cargo build --release --features=rocksdb/io-uring
sudo cp target/release/zksync_server /usr/local/bin
