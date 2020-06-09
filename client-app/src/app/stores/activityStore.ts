import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { act } from 'react-dom/test-utils';

configure({enforceActions: 'always'}); //enforces strict mode - means all actions that modify observables must now have action decorators (including promises and async await)

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => { //activities that happen after await must be placed within runInAction to ensure that they do not break the rules enforced by strict mode
        activities.forEach(activity => {
          activity.date = activity.date.split('.')[0]
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });      
    } catch (error) {
      runInAction('load activities error', () => { //the first parameter is simply a name for the action, which can help pinpoint where things are going wrong in testing
        this.loadingInitial = false;
      });
      console.log(error); //this is not modifying an observable, so can run outside of runInAction
    }

    //below section uses a promise chain - it is an alternative to the async await method above - comes down to personal preference, they do the same with no difference in performance
    //this section copied from App.tsx useEffect and modified to fit our purpose
    // agent.Activities.list()
    //  .then((activities) => {
    //    activities.forEach(activity => {
    //      activity.date = activity.date.split('.')[0]
    //      this.activities.push(activity)
    //    })
    //  })
    //  .catch((error) => console.log(error) )
    //  .finally(() => this.loadingInitial = false);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction('create activity error', () => {
        this.submitting = false;
      });
    }
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('editing activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction('edit activity error', () => {
        this.submitting = false;
      });
    }
  }

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('deleting activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('delete activity error', () => {
        this.submitting = false;
        this.target = '';
      });
      console.log(error);
    }
  }

  //runInAction does not need to be applied to these as they do not return Promises or run asynchronously
  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  }

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  }

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  @action cancelFormOpen = () => {
    this.editMode = false;
  }

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  }
}

//alternative to using decorators - include the decorate function in the import then add this function
// decorate(ActivityStore, {
//   activityRegistry: observable,
//   activities: observable,
//   selectActivity: observable,
//   loadingInitial: observable,
//   editMode: observable,
//   submitting: observable,
//   target: observable,
//   activitiesByDate: computed,
//   loadActivities: action,
//   createActivity: action,
//   editActivity: action,
//   deleteActivity: action,
//   openCreateForm: action,
//   cancelSelectedActivity: action,
//   cancelFormOpen: action,
//   selectActivity: action,
// });

export default createContext(new ActivityStore());