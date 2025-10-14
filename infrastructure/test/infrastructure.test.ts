import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StaticAssetsStack } from '../lib/static-assets';

test('Static assets Bucket created', () => {
  const app = new cdk.App();
  const stack = new StaticAssetsStack(app, 'BlackatStaticAssets');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: 'static.blackat.co.uk'
  });
});
