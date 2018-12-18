/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import {Route as ReactRouterRouteUntyped} from 'react-router-dom';

import type {RouteType} from '../types.js';

const ReactRouterRoute: RouteType = ReactRouterRouteUntyped;

const isEmptyChildren = (children: React.Node) =>
  React.Children.count(children) === 0;

type PropsType = {
  trackingId?: any,
  component?: React.ComponentType<*>,
  render?: (...props: any) => React.Node,
  children?: ((routeProps: {match: MatchType}) => React.Node) | React.Node,
};
type ContextType = {
  onRoute: any,
};
type MatchType = {
  isExact: boolean,
  path: string,
  params: Object,
  url: string,
};
function Route(props: PropsType, context: ContextType) {
  const {trackingId, component, render, children, ...remainingProps} = props;

  return (
    <ReactRouterRoute
      {...remainingProps}
      // eslint-disable-next-line react/no-children-prop
      children={(routeProps: {match: MatchType}) => {
        const {match} = routeProps;
        if (match && match.isExact) {
          context.onRoute({
            page: match.path,
            title: trackingId || match.path,
            params: match.params,
          });
        }

        if (component)
          return match ? React.createElement(component, routeProps) : null;

        if (render) return match ? render(routeProps) : null;

        if (typeof children === 'function') return children(routeProps);

        if (children && !isEmptyChildren(children))
          return React.Children.only(children);

        return null;
      }}
    />
  );
}

Route.contextTypes = {
  onRoute: PropTypes.func.isRequired,
};

Route.displayName = 'FusionRoute';

export {Route};
