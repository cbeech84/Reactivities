import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import SelectInput from '../../../app/common/form/SelectInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import DateInput from '../../../app/common/form/DateInput';
import { category } from '../../../app/common/options/CategoryOptions'
import { combineDateAndTime } from '../../../app/common/util/util';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate'

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: 'Description needs to be at least 4 characters'})
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
})

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
  const activityStore = useContext(ActivityStore);
  const { createActivity, editActivity, submitting, loadActivity } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues()); //we can remove the initialiser and simply use the class defined in activity.ts to initialise the form
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) { //we no longer need to check for the activity, as it is being returned.
      setLoading(true); //we also want to set the loading indicator to display if it is required
      loadActivity(match.params.id).then(
        (activity) => setActivity(new ActivityFormValues(activity)) //as we are now returning the activity, we no longer need to check initialFormState
        // additionally, we can pass in the activity to the ActivityFormValues class to initialise the form wtih the values of the activity
      ).finally(() => setLoading(false)); //then turn the load indicator off again
    }
  }, [loadActivity, match.params.id]); //useEffect will only run now if loadActivity or match.params.id changes.

  //Commented initially after adding React-Final-Form to handle our forms
  // const handleSubmit = () => {
  //   if (activity.id.length === 0) {
  //     let newActivity = {
  //       ...activity,
  //       id: uuid()
  //     }
  //     createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
  //   } else {
  //     editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
  //   }
  // }

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid()
      }
      createActivity(newActivity); //we can remove the .then chain as we are redireting within activitystore
    } else {
      editActivity(activity);
    }
  }

  //No longer needed after adding React-Final-Form to handle our forms (can be removed)
  // const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = event.currentTarget; //this unpacks the values of name and value from event.target //currentTarget targets the current form variable
  //   setActivity({ ...activity, [name]: value }) //allowing us to use the values here, so we do not have to type out event.target.xyz each time
  // }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name='title'
                  placeholder='Title'
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  name='description'
                  placeholder='Description'
                  rows={3}
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Field
                  name='category'
                  placeholder='Category'
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                />
                <Form.Group widths='equal'>
                  <Field
                    name='date'
                    placeholder='Date'
                    value={activity.date}
                    component={DateInput}
                    date={true}
                  />
                  <Field
                    name='time'
                    placeholder='Time'
                    value={activity.time}
                    component={DateInput}
                    time={true}
                  />
                </Form.Group>
                <Field
                  name='city'
                  placeholder='City'
                  value={activity.city}
                  component={TextInput}
                />
                <Field
                  name='venue'
                  placeholder='Venue'
                  value={activity.venue}
                  component={TextInput}
                />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine}
                  floated='right'
                  positive type='submit'
                  content='Submit'
                />
                <Button
                  onClick={activity.id ? () => history.push(`/activities/${activity.id}`) : () => history.push(`/activities`)}
                  disabled={loading}
                  floated='right'
                  type='button'
                  content='Cancel'
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityForm);