module.exports = {
    "env": {
        "node": true,
        "es6": true,
    },
    "extends": [
        "eslint:recommended",
        "prettier"
    ],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "prettier"
    ],
    "rules": {
        "prettier/prettier": [
            "error",
            {
                "printWidth": 80,
                "trailingComma": "es5",
                "semi": false,
                "jsxSingleQuote": true,
                "singleQuote": true,
                "useTabs": false
            }
        ]
    }
};
