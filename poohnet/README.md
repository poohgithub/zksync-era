# 전체 시스템 구동방법
## 참고
$ZKSYNC_HOME은 본 프로젝트가 설치된 디렉토리

## 실행 순서

### 1. geth 실행
https://github.com/poohgithub/poohgeth를 다운로드해서 다음을 실행
```
cd poohnet
./init-cmd
./enode-cmd
```

### 2. psqresql 실행
```
cd $ZKSYNC_HOME/poohnet/local-setup
./start-sql
```

### 3. zksync-era 서버 실행
```
cd $ZKSYNC_HOME
./localentry
```

### 4. 테스트 컨트랙트
테스트 컨트랙트 배포
```
cd $ZKSYNC_HOME/poohnet/greeter-example
yarn deploy-test
```
배포후 컨트랙트 주소를 deploy-greeter.ts에 추가

다음의 명령으로 테스트 컨트렉트 호출
```
yarn greet-test
```

다음의 로그가 보이면 성공
```
yarn run v1.22.19
$ NODE_ENV=test yarn hardhat deploy-zksync --script use-greeter.ts
$ /Users/hyunjaelee/work/zksync-era/poohnet/greeter-example/node_modules/.bin/hardhat deploy-zksync --script use-greeter.ts
Running script to interact with contract 0x111C3E89Ce80e62EE88318C2804920D4c96f92bb
The message is Hi there!
```