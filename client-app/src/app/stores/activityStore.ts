import { action, computed, makeObservable, observable, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({ enforceActions: "always" });

class ActivityStore {
    @observable activityRegistery = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistery.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }

    constructor() {
        makeObservable(this);
    }

    @action loadActivities =async () => {
        this.loadingInitial = true;
        try {
            const activities =await agent.Activities.list();
            runInAction(() => {
                activities.forEach(activity => {
                    activity.date = activity.date.split(".")[0];
                    this.activityRegistery.set(activity.id, activity);
                });
                this.loadingInitial = false;
            })
        }
        catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistery.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;
            })
        }
        catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistery.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            })
        }
        catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistery.delete(id);
                this.submitting = false;
                this.target = '';
            })
        }
        catch (error) {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);
        }
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistery.get(id);
        this.editMode = true;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistery.get(id);
        this.editMode = false;
    }
}

export default createContext(new ActivityStore());