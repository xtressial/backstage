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

let backstageToken = undefined;

self.addEventListener('message', function handleMessage(event) {
  if (event.data && event.data.type === 'SET_BACKSTAGE_TOKEN') {
    backstageToken = event.data.token;
    console.log('Set the token to ', backstageToken);
  }
});

/**
 * Decorate fetch requests with a "backstage-token" header if set
 */
self.addEventListener('fetch', function handleFetch(event) {
  if (!backstageToken) {
    console.log('Did not intercept ', event.request.url);
    return;
  }

  console.log('Intercepted ', event.request.url);
  const request = new Request(event.request);
  request.headers.set('backstage-token', backstageToken);
  event.respondWith(fetch(request));
});
