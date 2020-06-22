import NextErrorComponent from "next/error";
import * as Sentry from "@sentry/node";
import { NextPage } from "next";
import { isServer, env } from "../env";

const InternoteErrorPage: NextPage<any> = ({
  statusCode,
  hasGetInitialPropsRun,
  err,
}) => {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err);
  }

  return <NextErrorComponent statusCode={statusCode} />;
};

InternoteErrorPage.getInitialProps = async ({ res, err, asPath }) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps({
    res,
    err,
  } as any);

  // @ts-expect-error
  errorInitialProps.hasGetInitialPropsRun = true;

  if (res?.statusCode === 404) {
    // Opinionated: do not record an exception in Sentry for 404
    return { statusCode: 404 };
  }

  if (err) {
    Sentry.captureException(err, {
      extra: {
        isServer,
        environment: env.ENVIRONMENT,
      },
    });
    return errorInitialProps;
  }

  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  );

  return errorInitialProps;
};

export default InternoteErrorPage;
