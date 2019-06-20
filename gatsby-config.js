require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const fetch = require(`node-fetch`)
const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE
const AWS = require('aws-sdk');
const { createAppSyncLink } = require('aws-appsync');
const { createHttpLink } = require(`apollo-link-http`)

module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "AWSAppSync",
        fieldName: "companies",
        createLink: (pluginOptions) => {
          AWS.config.update({
            region: 'us-east-1',
            credentials: new AWS.Credentials({
              accessKeyId: process.env.S3_KEY_ID,
              secretAccessKey: process.env.S3_ACCESS_KEY
            })
          });
  
          const credentials = AWS.config.credentials;
  
          return createAppSyncLink({
            url: process.env.GRAPHQL_URI,
            region: 'us-east-1',
            auth: {
              type: AUTH_TYPE.AWS_IAM,
              credentials: credentials
            },
            resultsFetcherLink: createHttpLink({ 
              uri: process.env.GRAPHQL_URI,
              fetch,
            })
          });
        },
        refetchInterval: 86400,
      },
    },
  ]
}
