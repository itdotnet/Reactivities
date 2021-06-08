import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { Grid } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import AtivityStore from "../../../app/stores/activityStore";
import { ActivityDetailedChat } from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import { ActivityDetailedInfo } from "./ActivityDetailedInfo";
import { ActivityDetailedSidebar } from "./ActivityDetailedSidebar";

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match
}) => {
  const activityStore = useContext(AtivityStore);
  const { activity, loadActivity, loadingInitial } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loadingInitial || !activity)
    return <LoadingComponent content="Loading Activity..."></LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity}></ActivityDetailedHeader>
        <ActivityDetailedInfo activity={activity}></ActivityDetailedInfo>
        <ActivityDetailedChat></ActivityDetailedChat>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar></ActivityDetailedSidebar>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
