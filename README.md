# Overview

This is a repo to illustrate the ability to publish events to EventBridge by writing to the lambda log. The details of the approach are
covered [here](https://speedrun.nobackspacecrew.com/blog/2023/10/12/totally-async-eventbridge.html)

# Code

The CDK stack to create the two lambda, an event bus and subscription filter:

[CDK stack](lib/logs-to-eb-stack.ts)

The lambda that writes to the log:

[Messenger lambda](src/messenger.ts)

The lambda that is triggered by the CloudWatch Subscription Filter and publishes the Event to Event Bridge:

[Bridgify lambda](src/bridgify.ts)

# Deployment

This uses the CDK to deploy the infrastructure. You can install the CDK [here](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

```
npm install
cdk deploy
```

## Useful commands

- `npm install` get all of the packages
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
