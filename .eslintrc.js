module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "prettier"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react", "prettier", "jest"
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
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    }
};
