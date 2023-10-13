import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as destinations from 'aws-cdk-lib/aws-logs-destinations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as busCdk from 'aws-cdk-lib/aws-events';

export class LogsToEbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create a lambda function that writes the message to the log group
    const messengerLambdaFunction = new NodejsFunction(
      this,
      'MessengerLambdaFunction',
      {
        functionName: 'Messenger',
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: 'src/messenger.ts',
        handler: 'handler',
      }
    );
    let functionUrl = messengerLambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
    });

    const bridgifyFunction = new NodejsFunction(
      this,
      'BridgifyLambdaFunction',
      {
        functionName: 'Bridgify',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: 512,
        environment: {
          DEFAULT_EVENT_BUS_NAME: 'slack',
        },
        entry: 'src/bridgify.ts',
        handler: 'handler',
      }
    );

    const subscriptionFilter = new logs.SubscriptionFilter(
      this,
      'SubscriptionFilter',
      {
        logGroup: messengerLambdaFunction.logGroup,
        filterName: 'eventBridgeFilter',
        destination: new destinations.LambdaDestination(bridgifyFunction),
        filterPattern: logs.FilterPattern.literal('EVENT_BRIDGE'),
      }
    );

    const bus = new busCdk.EventBus(this, 'SlackEventBus', {
      eventBusName: 'slack',
    });

    bus.grantPutEventsTo(bridgifyFunction);

    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: functionUrl.url,
    });
  }
}
