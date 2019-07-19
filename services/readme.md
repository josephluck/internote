# Route 53

Set up a domain name using Route 53.

# Certificate

Create a SSL certificate using certificate manager and attach it to the domain created in Route 53.

# SES

Using the domain created in Route 53, loosely follow the set up instructions in https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-getting-started-before.html. Pay particular attention to the S3 set up and make sure you verify the e-mail address. The cognito lambdas set up in this project assumes emails will be sent from "no-reply@internote.app"
