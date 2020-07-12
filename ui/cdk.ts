import path from "path";

import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as iam from "@aws-cdk/aws-iam";
import * as route53 from "@aws-cdk/aws-route53";
import * as route53targets from "@aws-cdk/aws-route53-targets";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deployment from "@aws-cdk/aws-s3-deployment";
import * as cdk from "@aws-cdk/core";
import {
  InternoteProps,
  InternoteStack,
} from "@internote/infra/constructs/internote-stack";
import { Stage, allStages } from "@internote/infra/env";

type Props = InternoteProps;

class InternoteUiStack extends InternoteStack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const hostedZoneDomainName = "internote.app";

    const cloudfrontDomainName =
      this.stage === "prod"
        ? hostedZoneDomainName
        : `${this.stage}.${hostedZoneDomainName}`;

    const hostedZone = route53.PublicHostedZone.fromLookup(
      this,
      `${id}-hosted-zone`,
      {
        domainName: hostedZoneDomainName,
      }
    );

    /**
     * It's safe to create a new DNS certificate managed by CDK
     */
    const cert = new acm.DnsValidatedCertificate(
      this,
      `${id}-dns-certificate`,
      {
        domainName: cloudfrontDomainName,
        hostedZone,
        region: "us-east-1", // NB: this must be in us-east-1 to work with CloudFront.
      }
    );

    const bucket = new s3.Bucket(this, `${id}-bucket`, {
      bucketName: `${id}-bucket`,
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      cors: [
        {
          allowedOrigins: ["*"],
          allowedMethods: [s3.HttpMethods.GET],
        },
      ],
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      `${id}-oai`
    );

    const cf = new cloudfront.CloudFrontWebDistribution(
      this,
      `${id}-cloudfront`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        errorConfigurations: [
          {
            errorCode: 404,
            responsePagePath: "/index.html",
            responseCode: 200,
          },
        ],
        viewerCertificate: {
          aliases: [cloudfrontDomainName],
          props: {
            acmCertificateArn: cert.certificateArn,
            sslSupportMethod: "sni-only",
          },
        },
      }
    );

    const cloudfrontS3Access = new iam.PolicyStatement();
    cloudfrontS3Access.addActions("s3:GetBucket*");
    cloudfrontS3Access.addActions("s3:GetObject*");
    cloudfrontS3Access.addActions("s3:List*");
    cloudfrontS3Access.addResources(bucket.bucketArn);
    cloudfrontS3Access.addResources(`${bucket.bucketArn}/*`);
    cloudfrontS3Access.addCanonicalUserPrincipal(
      originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
    );

    new s3deployment.BucketDeployment(this, `${id}-bucket-deployment`, {
      sources: [s3deployment.Source.asset(path.resolve(__dirname, "build"))],
      destinationBucket: bucket,
      // Invalidate the cache on deploy
      distribution: cf,
      distributionPaths: ["/", "/index.html"],
    });

    const aRecordProps: route53.ARecordProps = {
      recordName: cloudfrontDomainName,
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(cf)
      ),
      zone: hostedZone,
    };

    new route53.ARecord(this, `${id}-a-record`, aRecordProps);

    new route53.AaaaRecord(this, `${id}-aaaa-record`, aRecordProps);
  }
}

type AppProps = cdk.StackProps & { stage: Stage };

class InternoteApp extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, stackProps: AppProps) {
    super(scope, id, stackProps);

    const props: InternoteProps = {
      ...stackProps,
      account: this.account,
      region: this.region,
    };

    new InternoteUiStack(this, id, props);
  }
}

const app = new cdk.App();

allStages.forEach((stage) => {
  new InternoteApp(app, `internote-${stage}-ui`, {
    stage,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });
});

app.synth();
