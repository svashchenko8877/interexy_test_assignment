## Install, Build, Run

Install node package dependencies:

`$ npm install`

Build:

`$ npm run build`

## Description about solution


### 1. Implement a file-based caching system

File `file-based-cached` represents the logic

USAGE:

```
const fileCache = new FileCache('./');
fileCache.set('long_term_file', '12345', 10000)
fileCache.set('test', '12345', 0)
fileCache.get('test')
```

### 2. Create an HTTP Proxy Server

This part is implemented only using native `node:http` module. 

### 3. Create an HTTP Proxy Server

As this repository doesn't contain express dependency, solution moved to https://github.com/svashchenko8877/optimise_RESTful_API