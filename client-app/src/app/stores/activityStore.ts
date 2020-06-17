import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'}); //enforces strict mode - means all actions that modify observables must now have action decorators (including promises and async await)

class ActivityStore {
  @observable activityRegistry = new Map();
  //@observable activities: IActivity[] = [];
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  //@observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    )
    //creating an array of arrays, where they key is the date and the values are the activity objects
    //Object.entries returns an array for each entry in an object (in this case the sortedActivities array) using keys and values where values are the properties of the entries (or in this case, an entire object each, with a generated key)
    //reduce takes array values and reduces them to a single value, then stores them in the first argument as an array
    //here it is taking sortedActivities and putting the result of the callback function called against activity into the activities array, which is stored as an object, defined after the callback
    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date = activity.date.split('T')[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity]; //if the date for multiple entries is the same, we spread these into a new array, but if not, we create an array with a single entry
      return activities;
    }, {} as {[key: string] : IActivity[]}));
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

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        const activity = await agent.Activities.details(id);
        runInAction('getting activity', () => {
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        })
      } catch (error) {
        runInAction('get activity error', () => {
          this.loadingInitial = false;
        })
        console.log(error);
        //throw error; //instead of logging the error, we throw the error again, so we can handle it in ActivityDetails
        //since agent.ts is now dealing with errors, we can go back to just logging the error here
      }
    }
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  @action clearActivity = () => {
    this.activity = null;
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
        //this.editMode = false;
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
        this.activity = activity;
        //this.editMode = false;
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
  //these actions not needed after adding routing to the app (browsing to components via routes)
  // @action openCreateForm = () => {
  //   this.editMode = true;
  //   this.activity = null;
  // }

  // @action openEditForm = (id: string) => {
  //   this.activity = this.activityRegistry.get(id);
  //   this.editMode = true;
  // }

  // @action cancelSelectedActivity = () => {
  //   this.activity = null;
  // }

  // @action cancelFormOpen = () => {
  //   this.editMode = false;
  // }

  // @action selectActivity = (id: string) => {
  //   this.activity = this.activityRegistry.get(id);
  //   this.editMode = false;
  // }
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