const zlib = require('zlib');
const util = require('util');
const gunzip = util.promisify(zlib.gunzip);
import { Handler, CloudWatchLogsEvent } from 'aws-lambda';
import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';

const eventBridgeClient = new EventBridgeClient({
  region: process.env.AWS_REGION,
});

export const handler: Handler = async (event: CloudWatchLogsEvent, context) => {
  const payload = Buffer.from(event.awslogs.data, 'base64');
  const unzippedEvent = await gunzip(payload);
  const parsedEvent = JSON.parse(unzippedEvent.toString('utf8'));
  if (parsedEvent.messageType === 'DATA_MESSAGE') {
    for (const logEvent of parsedEvent.logEvents) {
      const message = new PutEventsCommand({
        Entries: JSON.parse(
          logEvent.message.substring(logEvent.message.indexOf('{') - 1)
        ).Entries,
      });
      let result = await eventBridgeClient.send(message);
      for (const entry of result.Entries!) {
        if (entry.EventId) {
          console.log(
            `Successfully sent event to EventBridge: ${entry.EventId}`
          );
        } else {
          console.log(
            `Failed to send event to EventBridge: ${entry.ErrorCode}: ${entry.ErrorMessage}`
          );
        }
      }
      if (result.FailedEntryCount! > 0) {
        throw new Error('Not all events were sent to EventBridge');
      }
    }
  }
};
