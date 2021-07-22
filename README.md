# slack-api-tests-with-jest

Slack API test suite using:

- Jest [Test Framework](https://jestjs.io/)
- SuperTest [HTTP assertions](https://www.npmjs.com/package/supertest)

---

### Node

- Node installation on Ubuntu

  ```
  sudo apt install nodejs
  sudo apt install npm
  ```

- Verify successfull install

  ```
  node --version
  v8.11.3

  npm --version
  6.1.0
  ```

### Yarn

```
npm install -g yarn
```

---

## Install

```
git clone https://github.com/Btakuski/slack-api-tests-with-jest
cd PROJECT_TITLE
yarn install
cp sample.env .env
```

```bash
# .env
SLACK_TOKEN=
SLACK_CHANNEL=
```

## Usage

Run tests

```
yarn test
```
