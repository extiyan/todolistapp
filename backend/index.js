import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient.js";
import { v4 as uuidv4 } from "uuid";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async function (event) {
  console.log("request:", JSON.stringify(event, undefined, 2));
  let body;

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.queryStringParameters != null) {
          body = await getToDosByProgress(event);
        } else if (event.pathParameters != null) {
          body = await getToDo(event.pathParameters.id);
        } else {
          body = await getAllToDo();
        }
        break;
      case "POST":
        body = await createToDo(event);
        break;
      case "DELETE":
        body = await deleteToDo(event.pathParameters.id);
        break;
      case "PUT":
        body = await updateToDo(event);
        break;
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
    console.log(body);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: `Successfully finished operation: "${event.httpMethod}"`,
        body: body,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Failed to perform operation.",
        errorMsg: e.message,
        errorStack: e.stack,
      }),
    };
  }
};

const getToDo = async (toDoId) => {
  console.log("getToDo");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: toDoId }),
    };

    const { Item } = await ddbClient.send(new GetItemCommand(params));

    console.log(Item);
    return Item ? unmarshall(Item) : {};
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getAllToDo = async () => {
  console.log("getAllToDo");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };

    const { Items } = await ddbClient.send(new ScanCommand(params));

    console.log(Items);
    return Items ? Items.map((item) => unmarshall(item)) : {};
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getToDosByProgress = async (event) => {
  console.log("getToDosByProgress");
  try {
    const toDoId = event.pathParameters.id;
    const progress = event.queryStringParameters.progress;

    const params = {
      KeyConditionExpression: "id = :toDoId",
      FilterExpression: "contains (progress, :progress)",
      ExpressionAttributeValues: {
        ":toDoId": { S: toDoId },
        ":progress": { S: progress },
      },
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };

    const { Tasks } = await ddbClient.send(new QueryCommand(params));

    console.log(Tasks);
    return Tasks ? Tasks.map((task) => unmarshall(task)) : {};
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const createToDo = async (event) => {
  try {
    console.log(`createToDo function. event : "${event}"`);

    const toDoRequest = JSON.parse(event.body);
    const toDoId = uuidv4();
    console.log("id: ", toDoId);
    toDoRequest.id = toDoId;
    toDoRequest.progress = "To Do";

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(toDoRequest || {}),
    };

    const createResult = await ddbClient.send(new PutItemCommand(params));
    console.log(createResult);
    return createResult;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const deleteToDo = async (toDoId) => {
  try {
    console.log(`deleteToDo function. toDoId: "${toDoId}"`);

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: toDoId }),
    };

    const deleteResult = await ddbClient.send(new DeleteItemCommand(params));
    console.log(deleteResult);
    return deleteResult;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const updateToDo = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const objKeys = Object.keys(requestBody);
    console.log(
      `updateToDo function. requestBody : "${requestBody}", objKeys: "${objKeys}"`
    );

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: event.pathParameters.id }),
      UpdateExpression: `SET ${objKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        objKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: requestBody[key],
          }),
          {}
        )
      ),
    };

    const updateResult = await ddbClient.send(new UpdateItemCommand(params));
    console.log(updateResult);
    return updateResult;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
