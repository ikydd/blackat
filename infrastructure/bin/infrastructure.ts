#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticAssetsStack } from '../lib/static-assets';

const app = new cdk.App();
new StaticAssetsStack(app, 'BlackatStaticAssets');
