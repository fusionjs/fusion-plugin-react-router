# fusion-plugin-react-router

[![Build status](https://badge.buildkite.com/e7e66157aa0c6e75c355db44ddf818637e7f00f9d7d640c879.svg?branch=master)](https://buildkite.com/uberopensource/fusion-plugin-react-router)

The `fusion-plugin-react-router` package provides a universal router plugin for React.

---

### Installation

```sh
yarn add fusion-plugin-react-router
```

---

### Example

```jsx
// src/main.js
import App from 'fusion-react';
import Router from 'fusion-plugin-react-router';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import root from './components/root';

export default function start(App) {
  const app = new App(root);
  app.register(Router);
  app.register(UniversalEventsToken, UniversalEvents);
  return app;
}

// src/components/root.js
import React from 'react';
import {Router, Route, Link, Switch, NotFound} from 'fusion-plugin-react-router';

const Home = () => <div>Hello</div>;
const Test = () => <div>Test</div>;
const PageNotFound = () => <NotFound><div>404</div></NotFound>;

const root = (
  <div>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/test">Test</Link></li>
      <li><Link to="/404">404</Link></li>
    </ul>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/test" component={Test} />
      <Route component={PageNotFound} />
    </Switch>
  </div>
);
export default root;
```

---

### API

- [Dependency registration](#dependency-registration)
- [Router](#router)
- [Route](#route)
- [Link](#link)
- [Switch](#switch)
- [Status](#status)
- [NotFound](#notfound)
- [Redirect](#redirect)

#### Dependency registration

```js
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';

app.register(UniversalEventsToken, UniversalEvents);
```

##### Required dependencies

Name | Type | Description
-|-|-
`UniversalEventsToken` | `UniversalEvents` | An event emitter plugin to emit stats to, such as the one provided by [`fusion-plugin-universal-events`](https://github.com/fusionjs/fusion-plugin-universal-events).


#### `Router`

Configures a router and acts as a React context provider for routing concerns. You don't need to use a Router component if you use `getRouter`

```jsx
import {Router} from 'fusion-plugin-react-router';

<Router
  location={...}
  basename={...}
  context={...}
  onRoute={...}
>{child}</Router>
```

- `location: string` - Required. The current pathname. Should be `ctx.url` in a Fusion plugin, or `req.url` in the server or `location.pathname` in the client
- `basename: string` - Optional. Defaults to `''`. A route prefix.
- `context: {setCode: (string) => void}` - Optional.
  - `setCode: (string) => void` - Called when `<Status />` is mounted. Provides an HTTP status code.
- `onRoute: ({page: string, title: string}) => void` - Optional. Called when a route change happens. Provides a pathname and a title.
- `child: React.Element` - Required.

#### `Route`

Defines what gets rendered for a given route. Multiple routes can be rendered at the same time if they exist outside a `Switch` component.

```jsx
import {Router, Route} from 'fusion-plugin-react-router';

<Router>
  <Route exact component={component} path={...}>{children}</Route>
</Router>
```

- `exact: boolean` - Optional. Whether the route matches exact paths only.
- `component: React.Component` - The component to render if the path matches the current URL.
- `path: string` - Optional. The route to match. If not defined, and `exact` is not defined, acts as a catch-all route (e.g. for 404s)
- `children: React.Children` - Optional. Pass-through children. Always render even if the route does not match.

#### `Link`

Similar to `<a>`, creates a link that routes using `history.pushState` rather than a page change.

```jsx
import {Router, Link} from 'fusion-plugin-react-router';

<Router>
  <Link to="{...}">{children}</Link>
</Router>
```

See the [react-router documentation](https://reacttraining.com/react-router/web/api/Link).

#### `Switch`

Renders the first child `Route` that matches the path.

```jsx
import {Router, Switch} from 'fusion-plugin-react-router';

<Router>
  <Switch>{children}</Switch>
</Router>
```

- `children: React.Children<Route>` - React children must be `Route` components.

See the [react-router documentation](https://reacttraining.com/react-router/web/api/Switch).

#### `Status`

Signals to the `Router` context that an HTTP status change is required.

```jsx
import {Router, Route, Status} from 'fusion-plugin-react-router';

<Router>
  <Route component={() => <Status code={...}>{child}</Status>} />
</Router>
```

- `code: number` - A HTTP Status code to be used if this component is mounted. The status code is sent to a `context.setCode` call in `Router`
- `child: React.Element` - A React element

#### `NotFound`

Equivalent to `<Status code={404}></Status>`

```jsx
import {Router, Route, NotFound} from 'fusion-plugin-react-router';

<Router>
  <Route component={() => <NotFound>{child}</NotFound>} />
</Router>
```

- `child: React.Element` - A React element

#### `Redirect`

Signals to the `Router` context to navigate to a new location.

```jsx
import {Router, Route, Redirect} from 'fusion-plugin-react-router';

<Router>
  <Route component={() => <Redirect to="/">{child}</Redirect>} />
</Router>
```

- `to: string|object` - Required. A URL or location to redirect to.
- `push: boolean` - Optional. When true, redirecting will push a new entry onto the history instead of replacing the current one.
- `code: number` - Optional. A HTTP Status code to be used if this component is mounted.

