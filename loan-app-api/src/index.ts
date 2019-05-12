// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { ShoppingApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
import { getCurTimestamp } from './utils/utils';
export { ShoppingApplication, PackageInfo, PackageKey } from './application';

export async function main(options?: ApplicationConfig) {
  options = {
    rest: {
      expressSettings: {
        'trust proxy': 'loopback, linklocal, uniquelocal'
      }
    }
  }
  const app = new ShoppingApplication(options);
  await app.boot();
  await app.start();

  // app.models.Todo.definition.rawProperties.createTime.default =
  //   app.models.Todo.definition.properties.createTime.default = function () {
  //     return getCurTimestamp();
  //   };

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
