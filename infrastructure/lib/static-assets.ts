import { Stack, StackProps, App, Duration, CfnOutput } from 'aws-cdk-lib';
import {
  Bucket,
  BlockPublicAccess,
  BucketEncryption,
  BucketAccessControl,
  CorsRule,
  HttpMethods
} from 'aws-cdk-lib/aws-s3';
import {
  OriginAccessIdentity,
  Distribution,
  AllowedMethods,
  ViewerProtocolPolicy,
  SecurityPolicyProtocol
} from 'aws-cdk-lib/aws-cloudfront';
import { S3StaticWebsiteOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

const hostname = 'statics.blackat.co.uk';

export class StaticAssetsStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const CorsRule: CorsRule = {
      allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
      allowedOrigins: ['*'],
      allowedHeaders: ['*'],
      maxAge: 300
    };

    const bucket = new Bucket(this, 'Bucket', {
      bucketName: hostname,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      accessControl: BucketAccessControl.PRIVATE,
      enforceSSL: true,
      cors: [CorsRule]
    });

    const oai = new OriginAccessIdentity(this, 'OAI');
    bucket.grantRead(oai);

    const cdn = new Distribution(this, 'StaticsCloudFront', {
      // certificate: certificate,
      defaultRootObject: 'index.html',
      // domainNames: [hostname],
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/error/index.html',
          ttl: Duration.minutes(30)
        }
      ],
      defaultBehavior: {
        origin: new S3StaticWebsiteOrigin(bucket),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      }
    });

    new CfnOutput(this, 'StaticSiteCDNDomain', {
      value: cdn.domainName
    });
  }
}
