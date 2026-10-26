import React, {useEffect, useState} from 'react';
import {Alert, Text, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import {useAppData} from '../../context/AppDataContext';
import {validateProfile} from '../../utils/validators';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

export default function EditProfileScreen({navigation}) {
  const app = useAppData();
  const student = app.student;
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {if (!values && student) {setValues({fullName: student.fullName, email: student.email, phone: student.phone});}}, [student, values]);
  if (!values) {return <ScreenContainer>{app.queries.student.error
    ? <ErrorView message={app.queries.student.error.message} onRetry={app.queries.student.refresh} /> : <LoadingView />}</ScreenContainer>;}
  const set = (key, value) => {setValues(before => ({...before, [key]: value})); setErrors(before => ({...before, [key]: undefined}));};
  const save = async () => {
    const next = validateProfile(values); setErrors(next);
    if (Object.keys(next).length) {return;}
    setSaving(true);
    try {await app.updateStudent({...values, fullName: values.fullName.trim()}); navigation.goBack();}
    catch (e) {Alert.alert('Không lưu được thông tin', e.message);}
    finally {setSaving(false);}
  };
  return <ScreenContainer scroll>
    <Text style={styles.title}>Chỉnh sửa thông tin</Text>
    <FormInput label="Họ và tên" value={values.fullName} onChangeText={text => set('fullName', text)} error={errors.fullName} />
    <FormInput label="Email" value={values.email} onChangeText={text => set('email', text)} error={errors.email} keyboardType="email-address" />
    <FormInput label="Số điện thoại" value={values.phone} onChangeText={text => set('phone', text)} error={errors.phone} keyboardType="phone-pad" />
    <AppButton title="Lưu thông tin" onPress={save} loading={saving} />
  </ScreenContainer>;
}
const styles = StyleSheet.create({title: {...typography.h1, color: colors.text}});
