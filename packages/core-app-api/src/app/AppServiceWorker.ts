/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AppIdentity } from './AppIdentity';

export class AppServiceWorker {
  private backstageToken: string | undefined;

  constructor(identityApi: AppIdentity) {
    identityApi.onSignIn(result => this.onSignIn(result));
    identityApi.onSignOut(() => this.onSignOut());
  }

  install() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(
          registration => {
            // Registration was successful
            console.log(
              'ServiceWorker registration successful with scope: ',
              registration.scope,
            );
          },
          err => {
            console.log(
              'Service worker registration failed. Some functionality may be limited.',
              err,
            );
          },
        );
        navigator.serviceWorker.ready.then(registration => {
          if (this.backstageToken) {
            registration.active?.postMessage({
              type: 'SET_BACKSTAGE_TOKEN',
              token: this.backstageToken,
            });
          }
        });
      });
    }
  }

  onSignIn(result: { getIdToken?: () => Promise<string> }) {
    const { getIdToken } = result;
    if (!getIdToken) {
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (this.backstageToken) {
          registration.active?.postMessage({
            type: 'SET_BACKSTAGE_TOKEN',
            token: this.backstageToken,
          });
        }
      });
    }
  }

  onSignOut() {}
}
