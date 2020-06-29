import { CognitoUserPoolTriggerHandler } from "aws-lambda";
import { SES } from "aws-sdk";
import { randomDigits } from "crypto-secure-random-digit";

import { env } from "../env";

const ses = new SES();

export const handler: CognitoUserPoolTriggerHandler = async (event) => {
  let secretLoginCode: string;
  if (!event.request.session || !event.request.session.length) {
    // This is a new auth session
    // Generate a new secret login code and mail it to the user
    secretLoginCode = randomDigits(6).join("");
    await sendEmail(event.request.userAttributes.email, secretLoginCode);
  } else {
    // There's an existing session. Don't generate new digits but
    // re-use the code from the current session. This allows the user to
    // make a mistake when keying in the code and to then retry, rather
    // the needing to e-mail the user an all new code again.
    const previousChallenge = event.request.session.slice(-1)[0];
    secretLoginCode = previousChallenge.challengeMetadata!.match(
      /CODE-(\d*)/
    )![1];
  }

  // This is sent back to the client app
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email,
  };

  // Add the secret login code to the private challenge parameters
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = { secretLoginCode };

  // Add the secret login code to the session so it is available
  // in a next invocation of the "Create Auth Challenge" trigger
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;

  return event;
};

async function sendEmail(emailAddress: string, secretLoginCode: string) {
  const params: SES.SendEmailRequest = {
    Destination: { ToAddresses: [emailAddress] },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
              <body>
                <h2 style="font-size: 24px; margin: 30px 0;">Verify your email to log in to Internote</h2>
                <p style="font-size: 14px; line-height: 24px;">To complete the log in process, please enter the following verification code in to the form:</p>
                <h2 style="font-size: 18px; margin: 26px 0;">${secretLoginCode}</h2>
                <hr style="margin: 26px 0; border-top: 1px solid #eaeaea;" />
                <p style="font-size: 12px; line-height: 24px; color: #666666;">If you didn't attempt to log in but received this email, please ignore this email.</p>
              </body>
            </html>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Internote verification code: ${secretLoginCode}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Internote verification code: ${secretLoginCode}`,
      },
    },
    Source: env.SES_FROM_ADDRESS!,
  };
  await ses.sendEmail(params).promise();
}
