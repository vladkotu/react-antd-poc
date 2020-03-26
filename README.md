- [Proof of qualification repo](#sec-1)
  - [Start Scripts](#sec-1-1)
  - [React(Hooks) front-end](#sec-1-2)
    - [<code>[7/9]</code> Front-end Todo List:](#sec-1-2-1)
  - [NodeJs backend](#sec-1-3)
    - [<code>[6/8]</code> Backend Todo List](#sec-1-3-1)
    - [DynamoDB](#sec-1-3-2)
    - [API docs](#sec-1-3-3)

# Proof of qualification repo<a id="sec-1"></a>

This project aim to proof knowledge of NodeJs/React stack

## Start Scripts<a id="sec-1-1"></a>

See [server package.json](package.json) and [client package.json](client/package.json) "scripts" sections for details.

Start local infrastructure

```sh
docker-compose up -d
```

Create tables and seed with data

```sh
yarn db:setup
```

Start dev server and client code watchers

```sh
yarn dev:all
```

Starts server separately

```sh
yarn nodemon
```

Run test in watch mode

```sh
yarn test --watch
```

Executes server side code watcher in dev mode.

## React(Hooks) front-end<a id="sec-1-2"></a>

### TODO <code>[7/9]</code> Front-end Todo List:<a id="sec-1-2-1"></a>

1.  [X] Use React Hooks for state management
2.  [X] Use [Ant Design](https://ant.design/components/button/) components library
3.  [X] Implement reusable Editable list component for admin dashboard
4.  [ ] Sass styling
5.  [X] Mock api calls while developing
6.  [X] Integrate BE API
7.  [X] Mock api data with faker.js
8.  [X] Unit tests
9.  [ ] Functional(end-to-end) tests with cypress

## NodeJs backend<a id="sec-1-3"></a>

### TODO <code>[6/8]</code> Backend Todo List<a id="sec-1-3-1"></a>

-   [X] CRUD actions
-   [X] ES6 syntax for server side code
-   [X] Request validation/sanitation
    -   [X] Single route validation
    -   [X] Custom validation middleware
-   [X] Error handling
-   [ ] Unit tests
-   [X] End-to-end API testing
    -   [X] Scripts for reseting/seeding database with test data
    -   [X] Run docker localstack image before tests
    -   [X] Wtite end-to-end tests
-   [X] Migrate app to DynamoDB as main DB
-   [ ] [WAITING] Deploy to AWS lambda (localstack)

### DynamoDB<a id="sec-1-3-2"></a>

1.  Create and seed with data tables

    1.  Accounts table
    
        1.  Create accounts table
        
            Generate json shema for DynamoDB table:
            
            ```sh
            aws dynamodb create-table --generate-cli-skeleton > ./server/db/table-shema-example.json
            ```
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb delete-table \
                --table-name Accounts
            ```
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb create-table \
                --cli-input-json file://${DBPATH}/AccountsSchema.json
            ```
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb list-tables
            ```
        
        2.  Seed accounts with test data
        
            \#NAME: seed-accounts
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb batch-write-item \
                --request-items   \
                file://${DBPATH}/AccountsDataSeed.json
            ```
            
            Unfortunately `batch-write-item` limited to 25 operations
        
        3.  Quering single item
        
            \#NAME: query-account-by-type
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
              dynamodb query \
              --table-name Accounts \
              --key-condition-expression "id = :id" \
              --expression-attribute-values  '{":id":{"S": "d83ef3c0-6d35-11ea-9d77-3dffd7d18939"}}'
            ```
        
        4.  Querying accounts from GSI
        
            \#NAME: query-account-by-type
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb query \
               --table-name Accounts \
               --index-name accType \
               --key-condition-expression "accType = :accType" \
               --expression-attribute-values  '{":accType":{"S":"bookkeeping"}}'
            ```
            
            Because `createdDateTime` was used as `RANGE` (sorted) key, list of items returned by this query sorted descendant by `createdDateTime`
    
    2.  Contractors table
    
        1.  Create table
        
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb delete-table \
                --table-name Contractors
            ```
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb create-table \
                --cli-input-json file://${DBPATH}/ContractorsSchema.json
            ```
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb list-tables
            ```
        
        2.  Seed accounts with test data
        
            \#NAME: seed-accounts
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb batch-write-item \
                --request-items file://${DBPATH}/ContractorsDataSeed.json
            ```
        
        3.  Scan all items
        
            \#NAME: scan-all-items
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb scan \
               --table-name Contractors 
            ```

2.  [WAITING] <code>[4/6]</code> Attempt to create stack from cloud formation config on localstack env

    -   [X] Use aws-serverless-express custom server for lambda env
    -   [X] Mock aws infrastructure with localstack
    -   [X] Refactor express server to be able to run it locally without deployment on lambda
    -   [X] Crete cloud formation template for s3 SPA hosting
    -   [ ] [Failed] Deploy express app to labmda lockalstack problems appear on execution cloud formation template
    -   [ ] Decouple client code from beckend code
    -   [ ] API Gatewat setup
    
    List of cloud formation stacks
    
    ```sh
    aws --endpoint-url=http://localhost:4581 cloudformation list-stacks
    ```
    
    ```sh
    aws cloudformation create-stack \
        --template-body file://cloudformation.yml \
        --stack-name web-stack \
        --endpoint-url=http://localhost:4581
    ```
    
    Error log from docker:
    
        local_aws     |   File "/opt/code/localstack/.venv/lib/python3.8/site-packages/moto/cloudformation/utils.py", line 61, in yaml_tag_constructor
        local_aws     |     return {key: _f(loader, tag, node)}
        local_aws     |   File "/opt/code/localstack/.venv/lib/python3.8/site-packages/moto/cloudformation/utils.py", line 50, in _f
        local_aws     |     return node.value.split(".")
        local_aws     | AttributeError: 'list' object has no attribute 'split'

### API docs<a id="sec-1-3-3"></a>

1.  Accounts

    All accounts tested for "bookkeeping" type
    
    1.  [C] Create account
    
        ```sh
        curl -X POST -vs "${API}/accounts?type=bookkeeping&pretty" \
             -H 'Content-Type: application/json' \
             -d '{ "accNo": 111, "category": "Purchase", "vatPercent": 11, "vatCategoryS": "P", "accName": "One one one" }'
        ```
        
        1.  Invalid request
        
            ```sh
            curl -X POST -vsi "${API}/accounts?type=bookkeeping&pretty" \
                 -H 'Content-Type: application/json' \
                 -d '{ "category": "Purchase" }'
            ```
    
    2.  [R1] Get all accounts
    
        ```sh
        curl -vsi "${API}/accounts?type=bookkeeping&pretty"
        ```
    
    3.  [R2] Get single account
    
        ```sh
        curl -vsi "${API}/accounts/ZDgzZWYzYzAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0NDY5NjA5MzQwMjU%3D/?pretty"
        ```
    
    4.  [U] Update account
    
        ```sh
        curl -X PUT -vs "${API}/accounts/ZDgzZWYzYzAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0NDY5NjA5MzQwMjU%3D/?pretty" \
             -H 'Content-Type: application/json' \
             -d '{ "vatPercent": 111, "accName": "One One One" }'
        ```
        
        1.  Invalid request
        
            ```sh
            curl -X PUT -vs "${API}/accounts/?type=bookkeeping&pretty" \
                 -H 'Content-Type: application/json' \
                 -d '{ "vatPercent": 111, "accName": "One One One" }'
            ```
    
    5.  [D] Delete account
    
        ```sh
        curl -X DELETE -vs "${API}/accounts/ZDgzZWYzYzAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0NDY5NjA5MzQwMjU%3D/?pretty"
        ```
