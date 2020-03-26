- [Proof of qualification repo](#sec-1)
  - [Start Scripts](#sec-1-1)
  - [React(Hooks) front-end](#sec-1-2)
    - [<code>[7/9]</code> List:](#sec-1-2-1)
  - [NodeJs backend](#sec-1-3)
    - [<code>[6/8]</code> List](#sec-1-3-1)
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

### TODO <code>[7/9]</code> List:<a id="sec-1-2-1"></a>

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

### TODO <code>[6/8]</code> List<a id="sec-1-3-1"></a>

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
            
            <div class="json">
            { "TableDescription": { "TableArn": "arn:aws:dynamodb:us-east-1:000000000000:table/Accounts", "AttributeDefinitions": [ { "AttributeName": "id", "AttributeType": "S" }, { "AttributeName": "accType", "AttributeType": "S" }, { "AttributeName": "createdDateTime", "AttributeType": "N" } ], "GlobalSecondaryIndexes": [ { "IndexSizeBytes": 0, "IndexName": "accType", "Projection": { "ProjectionType": "ALL" }, "ProvisionedThroughput": { "WriteCapacityUnits": 1, "ReadCapacityUnits": 1 }, "IndexStatus": "ACTIVE", "KeySchema": [ { "KeyType": "HASH", "AttributeName": "accType" }, { "KeyType": "RANGE", "AttributeName": "createdDateTime" } ], "IndexArn": "arn:aws:dynamodb:ddblocal:000000000000:table/Accounts/index/accType", "ItemCount": 0 } ], "ProvisionedThroughput": { "NumberOfDecreasesToday": 0, "WriteCapacityUnits": 1, "LastIncreaseDateTime": 0.0, "ReadCapacityUnits": 1, "LastDecreaseDateTime": 0.0 }, "TableSizeBytes": 0, "TableName": "Accounts", "BillingModeSummary": { "LastUpdateToPayPerRequestDateTime": 0.0, "BillingMode": "PROVISIONED" }, "TableStatus": "ACTIVE", "KeySchema": [ { "KeyType": "HASH", "AttributeName": "id" }, { "KeyType": "RANGE", "AttributeName": "createdDateTime" } ], "ItemCount": 0, "CreationDateTime": 1585242674.111 } }
            
            </div>
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb list-tables
            ```
            
            ```org
            {
                "TableNames": [
                    "Accounts"
                ]
            }
            ```
        
        2.  Seed accounts with test data
        
            \#NAME: seed-accounts
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb batch-write-item \
                --request-items   \
                file://${DBPATH}/AccountsDataSeed.json
            ```
            
                {
                    "UnprocessedItems": {}
                }
            
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
            
                {
                    "Count": 1, 
                    "Items": [
                        {
                            "comment": {
                                "S": "Facere deleniti blanditiis eum."
                            }, 
                            "category": {
                                "S": "Sales"
                            }, 
                            "createdDateTime": {
                                "N": "1446960934025"
                            }, 
                            "accType": {
                                "S": "default"
                            }, 
                            "vatPercent": {
                                "N": "49"
                            }, 
                            "accName": {
                                "S": "Roi Greens Backing Up"
                            }, 
                            "vatCategoryS": {
                                "S": "S"
                            }, 
                            "id": {
                                "S": "d83ef3c0-6d35-11ea-9d77-3dffd7d18939"
                            }, 
                            "accNo": {
                                "N": "55"
                            }
                        }
                    ], 
                    "ScannedCount": 1, 
                    "ConsumedCapacity": null
                }
        
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
            
                {
                    "Count": 3, 
                    "Items": [
                        {
                            "comment": {
                                "S": "est autem facere"
                            }, 
                            "category": {
                                "S": "Purchase"
                            }, 
                            "createdDateTime": {
                                "N": "1329262892304"
                            }, 
                            "accType": {
                                "S": "bookkeeping"
                            }, 
                            "vatPercent": {
                                "N": "73"
                            }, 
                            "accName": {
                                "S": "Agp"
                            }, 
                            "vatCategoryS": {
                                "S": "P"
                            }, 
                            "id": {
                                "S": "d83fde20-6d35-11ea-9d77-3dffd7d18939"
                            }, 
                            "accNo": {
                                "N": "93"
                            }
                        }, 
                        {
                            "comment": {
                                "S": "Amet consequatur similique quis nobis nam maxime ut dolor. Vitae sed quo sunt molestias vero tempore minima. Necessitatibus ducimus hic reprehenderit. Hic dolore error animi ut aperiam. Hic inventore sunt ipsa ut recusandae. Sed accusantium et iusto.\n \rUnde neque sequi quidem beatae. Quo repudiandae voluptatem impedit nostrum asperiores nostrum aut magnam odio. At recusandae dolorem sunt debitis sequi totam esse ipsa. Eos repellendus totam aut hic.\n \rConsequatur voluptate sunt ratione est est ad omnis. Debitis animi ut est consequatur. Quos praesentium autem est minus et ea."
                            }, 
                            "category": {
                                "S": "Purchase"
                            }, 
                            "createdDateTime": {
                                "N": "1551172226477"
                            }, 
                            "accType": {
                                "S": "bookkeeping"
                            }, 
                            "vatPercent": {
                                "N": "22"
                            }, 
                            "accName": {
                                "S": "Computer Manat Vanuatu"
                            }, 
                            "vatCategoryS": {
                                "S": "P"
                            }, 
                            "id": {
                                "S": "d83f41e0-6d35-11ea-9d77-3dffd7d18939"
                            }, 
                            "accNo": {
                                "N": "66"
                            }
                        }, 
                        {
                            "category": {
                                "S": "Purchase"
                            }, 
                            "createdDateTime": {
                                "N": "1564661196514"
                            }, 
                            "accType": {
                                "S": "bookkeeping"
                            }, 
                            "vatPercent": {
                                "N": "88"
                            }, 
                            "accName": {
                                "S": "Maroon Refined Granite Tuna"
                            }, 
                            "vatCategoryS": {
                                "S": "P"
                            }, 
                            "id": {
                                "S": "d83fb710-6d35-11ea-9d77-3dffd7d18939"
                            }, 
                            "accNo": {
                                "N": "93"
                            }
                        }
                    ], 
                    "ScannedCount": 3, 
                    "ConsumedCapacity": null
                }
            
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
            
            ```org
            {
                "TableDescription": {
                    "TableArn": "arn:aws:dynamodb:us-east-1:000000000000:table/Contractors", 
                    "AttributeDefinitions": [
                        {
                            "AttributeName": "id", 
                            "AttributeType": "S"
                        }, 
                        {
                            "AttributeName": "createdDateTime", 
                            "AttributeType": "N"
                        }
                    ], 
                    "ProvisionedThroughput": {
                        "NumberOfDecreasesToday": 0, 
                        "WriteCapacityUnits": 1, 
                        "LastIncreaseDateTime": 0.0, 
                        "ReadCapacityUnits": 1, 
                        "LastDecreaseDateTime": 0.0
                    }, 
                    "TableSizeBytes": 0, 
                    "TableName": "Contractors", 
                    "BillingModeSummary": {
                        "LastUpdateToPayPerRequestDateTime": 0.0, 
                        "BillingMode": "PROVISIONED"
                    }, 
                    "TableStatus": "ACTIVE", 
                    "KeySchema": [
                        {
                            "KeyType": "HASH", 
                            "AttributeName": "id"
                        }, 
                        {
                            "KeyType": "RANGE", 
                            "AttributeName": "createdDateTime"
                        }
                    ], 
                    "ItemCount": 0, 
                    "CreationDateTime": 1585223192.602
                }
            }
            ```
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb list-tables
            ```
            
            ```org
            {
                "TableNames": [
                    "Accounts", 
                    "Contractors"
                ]
            }
            ```
        
        2.  Seed accounts with test data
        
            \#NAME: seed-accounts
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb batch-write-item \
                --request-items file://${DBPATH}/ContractorsDataSeed.json
            ```
            
                {
                    "UnprocessedItems": {}
                }
        
        3.  Scan all items
        
            \#NAME: scan-all-items
            
            ```sh
            aws --endpoint-url http://localhost:4569 \
                dynamodb scan \
               --table-name Contractors 
            ```
            
                {
                    "Count": 25, 
                    "Items": [
                        {
                            "createdDateTime": {"N": "1472427643486"}, 
                            "id": {"S": "51c19f64-6d26-11ea-b66b-eddefd31ba92"}
                        }, 
                        {
                            "createdDateTime": {"N": "1405647608992"}, 
                            "id": {"S": "51c19f5c-6d26-11ea-b66b-eddefd31ba92"}
                        }, 
                        ...
                    ], 
                    "ScannedCount": 25, 
                    "ConsumedCapacity": null
                }

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
    
        /Users/vladimir/projects/react-examples/rhooks-form-app
        {
            "StackSummaries": []
        }
    
    ```sh
    aws cloudformation create-stack \
        --template-body file://cloudformation.yml \
        --stack-name web-stack \
        --endpoint-url=http://localhost:4581
    ```
    
        An error occurred (502) when calling the CreateStack operation (reached max retries: 4): Bad Gateway
    
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
        
            {
              "id": "ZmI5N2NiYjAtNmY0NC0xMWVhLTg1ZDQtNWZlNTExZjNjMTJjLDE1ODUyMTUyNjU3NzE%3D",
              "accType": "bookkeeping",
              "accNo": 111,
              "category": "Purchase",
              "vatPercent": 11,
              "vatCategoryS": "P",
              "accName": "One one one"
            }
        
        1.  Invalid request
        
            ```sh
            curl -X POST -vsi "${API}/accounts?type=bookkeeping&pretty" \
                 -H 'Content-Type: application/json' \
                 -d '{ "category": "Purchase" }'
            ```
            
                HTTP/1.1 422 Unprocessable Entity
                X-Powered-By: Express
                Content-Type: application/json; charset=utf-8
                Content-Length: 130
                ETag: W/"82-HHj2rmNjH457Bv9LJ8U88iWD1J8"
                Date: Thu, 26 Mar 2020 09:34:34 GMT
                Connection: keep-alive
                
                {
                  "errors": [
                    {
                      "msg": "account number should be number",
                      "param": "accNo",
                      "location": "body"
                    }
                  ]
                }
    
    2.  [R1] Get all accounts
    
        ```sh
        curl -vsi "${API}/accounts?type=bookkeeping&pretty"
        ```
        
            HTTP/1.1 200 OK
            X-Powered-By: Express
            Content-Type: application/json; charset=utf-8
            Content-Length: 1744
            ETag: W/"6d0-2mL5pUjB/Fv9kynH8T8rgXyF0aA"
            Date: Thu, 26 Mar 2020 09:34:43 GMT
            Connection: keep-alive
            
            {
              "items": [
                {
                  "id": "ZDgzZmRlMjAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDEzMjkyNjI4OTIzMDQ%3D",
                  "vatCategoryS": "P",
                  "accNo": 93,
                  "accName": "Agp",
                  "comment": "est autem facere",
                  "category": "Purchase",
                  "accType": "bookkeeping",
                  "vatPercent": 73
                },
                {
                  "id": "ZDgzZjQxZTAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE1NTExNzIyMjY0Nzc%3D",
                  "vatCategoryS": "P",
                  "accNo": 66,
                  "accName": "Computer Manat Vanuatu",
                  "comment": "Amet consequatur similique quis nobis nam maxime ut dolor. Vitae sed quo sunt molestias vero tempore minima. Necessitatibus ducimus hic reprehenderit. Hic dolore error animi ut aperiam. Hic inventore sunt ipsa ut recusandae. Sed accusantium et iusto.\n \rUnde neque sequi quidem beatae. Quo repudiandae voluptatem impedit nostrum asperiores nostrum aut magnam odio. At recusandae dolorem sunt debitis sequi totam esse ipsa. Eos repellendus totam aut hic.\n \rConsequatur voluptate sunt ratione est est ad omnis. Debitis animi ut est consequatur. Quos praesentium autem est minus et ea.",
                  "category": "Purchase",
                  "accType": "bookkeeping",
                  "vatPercent": 22
                },
                {
                  "id": "ZDgzZmI3MTAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE1NjQ2NjExOTY1MTQ%3D",
                  "vatCategoryS": "P",
                  "accNo": 93,
                  "accName": "Maroon Refined Granite Tuna",
                  "category": "Purchase",
                  "accType": "bookkeeping",
                  "vatPercent": 88
                },
                {
                  "id": "ZmI5N2NiYjAtNmY0NC0xMWVhLTg1ZDQtNWZlNTExZjNjMTJjLDE1ODUyMTUyNjU3NzE%3D",
                  "vatCategoryS": "P",
                  "accNo": 111,
                  "accName": "One one one",
                  "accType": "bookkeeping",
                  "category": "Purchase",
                  "vatPercent": 11
                }
              ],
              "count": 4
            }
    
    3.  [R2] Get single account
    
        ```sh
        curl -vsi "${API}/accounts/ZDgzZWYzYzAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0NDY5NjA5MzQwMjU%3D/?pretty"
        ```
        
            HTTP/1.1 200 OK
            X-Powered-By: Express
            Content-Type: application/json; charset=utf-8
            Content-Length: 275
            ETag: W/"113-8G/9TPw6G+iF1N4VS0htAw7+rJ8"
            Date: Thu, 26 Mar 2020 09:46:09 GMT
            Connection: keep-alive
            
            {
              "id": "ZDgzZWYzYzAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0NDY5NjA5MzQwMjU%3D",
              "vatCategoryS": "S",
              "accNo": 55,
              "accName": "Roi Greens Backing Up",
              "comment": "Facere deleniti blanditiis eum.",
              "category": "Sales",
              "accType": "default",
              "vatPercent": 49
            }
    
    4.  [U] Update account
    
        ```sh
        curl -X PUT -vs "${API}/accounts/ZDgzZWYzYzAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0NDY5NjA5MzQwMjU%3D/?pretty" \
             -H 'Content-Type: application/json' \
             -d '{ "vatPercent": 111, "accName": "One One One" }'
        ```
        
            {
              "id": "ZDgzZWYzYzAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0NDY5NjA5MzQwMjU%3D",
              "vatCategoryS": "S",
              "accNo": 55,
              "accName": "One One One",
              "comment": "Facere deleniti blanditiis eum.",
              "category": "Sales",
              "accType": "default",
              "vatPercent": 111
            }
        
        1.  Invalid request
        
            ```sh
            curl -X PUT -vs "${API}/accounts/?type=bookkeeping&pretty" \
                 -H 'Content-Type: application/json' \
                 -d '{ "vatPercent": 111, "accName": "One One One" }'
            ```
            
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="utf-8">
                <title>Error</title>
                </head>
                <body>
                <pre>Cannot PUT /api/accounts/</pre>
                </body>
                </html>
    
    5.  [D] Delete account
    
        ```sh
        curl -X DELETE -vs "${API}/accounts/ZDgzZWYzYzAtNmQzNS0xMWVhLTlkNzctM2RmZmQ3ZDE4OTM5LDE0NDY5NjA5MzQwMjU%3D/?pretty"
        ```
