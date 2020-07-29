import React, { useContext } from 'react';
import { IProfile } from '../../app/models/profile';
import { combineValidators, isRequired } from 'revalidate';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const validate = combineValidators({
  displayName: isRequired("A display name is required")
})

// interface IProps {
//   updateProfile: (profile: IProfile) => void;
//   profile: IProfile;
// }

// export const ProfileEditForm: React.FC<IProps> = ({updateProfile, profile}) => {
const ProfileEditForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, updateProfile, setEditMode, loadingForm } = rootStore.profileStore;

  const submitHandler = (updatedprofile: IProfile) => {
    updateProfile(updatedprofile);
    setEditMode();
  }

  return (
    <FinalForm
      onSubmit={submitHandler}
      validate={validate}
      initialValues={profile!}
      render={({handleSubmit, invalid, pristine, submitting}) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            name='displayName'
            component={TextInput}
            placeholder='Display Name'
            value={profile!.displayName}
          />
          <Field 
            name='bio'
            component={TextAreaInput}
            rows={3}
            placeholder='Bio'
            value={profile!.bio}
          />
          <Button 
            loading={loadingForm && submitting}
            floated='right'
            disabled={invalid || pristine}
            positive
            content='Update profile'
          />
        </Form>
      )}
    />
  )
}

export default observer(ProfileEditForm)
