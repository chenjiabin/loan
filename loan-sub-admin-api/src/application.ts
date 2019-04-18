// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingKey } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import { MySequence } from './sequence';
import * as path from 'path';
import {
  AuthenticationBindings,
  AuthenticationComponent,
} from '@loopback/authentication';
import { JWTAuthenticationBindings, PasswordHasherBindings } from './keys';
import { StrategyResolverProvider } from './providers/strategy.resolver.provider';
import { AuthenticateActionProvider } from './providers/custom.authentication.provider';
import {
  JWTAuthenticationService,
} from './services/JWT.authentication.service';
import { BcryptHasher } from './services/hash.password.bcryptjs';
import { JWTStrategy } from './authentication-strategies/JWT.strategy';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';


export const MY_JWT_SECRET = 'AJFJSDG&&(4324=G4JG23';

/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../../package.json');

export class ShoppingApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options?: ApplicationConfig) {
    super(options);

    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg);

    // Bind authentication component related elements
    this.component(AuthenticationComponent);
    this.bind(AuthenticationBindings.AUTH_ACTION).toProvider(
      AuthenticateActionProvider,
    );
    this.bind(AuthenticationBindings.STRATEGY).toProvider(
      StrategyResolverProvider,
    );

    // Bind JWT authentication strategy related elements
    this.bind(JWTAuthenticationBindings.STRATEGY).toClass(JWTStrategy);
    this.bind(JWTAuthenticationBindings.SECRET).to(MY_JWT_SECRET);
    this.bind(JWTAuthenticationBindings.SERVICE).toClass(
      JWTAuthenticationService,
    );

    // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../../public'));

    // Configure base path
    this.basePath('/channelAdminApi')

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
