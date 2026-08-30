import React, { Component } from "react";
import _ from "lodash";

import type { DocumentNode } from "graphql";
import type { SubscribeToMoreOptions } from "@apollo/client";
// import LoadingSpinner from "@components/spinner/Loading-spinner";
import ComponentSpinner from "@/@core/components/spinner/component-loader";

interface LiveViewProps {
  subscribeToMore: (options: SubscribeToMoreOptions) => void;
  document: DocumentNode;
  deleteDocument?: DocumentNode;
  listVar: string;
  singleVar: string;
  sortField?: string;
  uniqueField?: string;
  data: any;
  triggerUpdate?: boolean;
  loading?: boolean;
  showLoader?: boolean;
  //
  // authUser?: AuthResponse
  enterpriseId: number | undefined;

  children: (data: any, loading?: boolean) => React.ReactElement;
}

class LiveView extends Component<LiveViewProps, {}> {
  static defaultProps = {
    showLoader: true,
  };

  subscribeToMoreData = () => {
    const {
      document,
      listVar,
      singleVar,
      subscribeToMore,
      sortField,
      triggerUpdate,
      uniqueField,
    } = this.props;

    subscribeToMore({
      document: document,
      updateQuery: (previousResult: any, { subscriptionData }: any) => {
        if (!subscriptionData.data) {
          // return {[listVar]: previousResult[listVar].filter(({addButton}) => addButton !== -1) };
          return previousResult;
        }

        /* const exists = prev.feed.links.find(({ id }) => id === newLink.id);
                if (exists) return prev;*/

        const newData = subscriptionData.data[singleVar];

        const enterpriseId = newData?.enterpriseId || newData.enterprise?.id;

        if (!triggerUpdate) {
          if (!enterpriseId || enterpriseId !== this.props.enterpriseId) {
            return previousResult;
          }
        }
        let previous: never[] = previousResult[listVar].filter(
          ({ id }: { id: string }) => id !== newData["id"]
        );

        if (uniqueField) {
          previous = previous.filter(
            ({ [uniqueField]: field }) => field !== newData[uniqueField]
          );
        }

        return {
          // ...previousResult,
          /* [listVar]: {
                        ...previousResult.products,
                        newData
                    }*/
          [listVar]: sortField
            ? _.sortBy(previous.concat(newData), (o) => o[sortField])
            : previous.concat(newData),
        };
      },
    });
  };

  componentDidMount() {
    this.subscribeToMoreData();
    /* if (this.props.deleteDocument) {
            this.subscribeToDelete();
        }*/
  }

  render() {
    // return this.props.children(this.props.data, this.props.loading);
    return this.props.data ? (
      this.props.children(this.props.data, this.props.loading)
    ) : this.props.showLoader ? (
      <ComponentSpinner />
    ) : (
      <span />
    );
  }
}

export default LiveView;
