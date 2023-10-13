# Overview

This is a repo to illustrate the ability to publish events to EventBridge by writing to the lambda log. The details of the approach are
covered [here](https://speedrun.nobackspacecrew.com/blog/2023/10/12/totally-async-eventbridge.html)

# Code

The CDK stack to create the two lambdas, an event bus and subscription filter:

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

# Invoking

If you have [Speedrun installed](https://github.com/No-Backspace-Crew/Speedrun/wiki/Getting-Started#installation) and enabled on this repository and have [configured it with a role that allows you to invoke lambdas](https://github.com/No-Backspace-Crew/Speedrun/wiki/Creating-Speedrun-Roles), you can invoke the messenger lambda with:

```
#!lambda
~~~functionUrl=Function URL{suppress: true}~~~
{
  "message": ~~~Message {transform: 'JSON.stringify(value)'}~~~
}
```

The function url will be printed in the output of the CDK deploy command.

## Useful commands

- `npm install` get all of the packages
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
