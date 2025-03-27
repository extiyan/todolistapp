import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const REGION = "ap-souteast-1";
const ddbClient = new DynamoDBClient({ region: REGION });
export { ddbClient };
