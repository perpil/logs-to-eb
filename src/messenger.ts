import { APIGatewayEvent, Handler } from 'aws-lambda';
import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
export const handler: Handler = async (event: APIGatewayEvent, context) => {
  let parsedBody = JSON.parse(event.body!);
  if (parsedBody.message) {
    let putEventsCommand = new PutEventsCommand({
      Entries: [
        {
          EventBusName: process.env.DEFAULT_EVENT_BUS_NAME!,
          Source: `cc.speedrun.${context.functionName}`,
          DetailType: 'Lambda Function Invocation',
          Detail: JSON.stringify({ message: parsedBody.message }),
        },
      ],
    });
    console.log('EVENT_BRIDGE: ' + JSON.stringify(putEventsCommand.input));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Message sent to EventBridge' }),
    };
  } else {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'No message found' }),
    };
  }
};
