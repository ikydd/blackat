import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { StaticAssetsStack } from '../lib/static-assets';

test('Static assets bucket created', () => {
  const app = new cdk.App();
  const stack = new StaticAssetsStack(app, 'BlackatStaticAssets');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: 'static.blackat.co.uk'
  });
});

test('CDN is fronting the bucket created', () => {
  const app = new cdk.App();
  const stack = new StaticAssetsStack(app, 'BlackatStaticAssets');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: [{ Id: Match.stringLikeRegexp('BlackatStaticAssets') }]
    }
  });
});
