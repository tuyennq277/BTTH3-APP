import React, {useState} from 'react';
import {Alert, Text, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import {useAppData} from '../../context/AppDataContext';
import {validateAssignment} from '../../utils/validators';
import {inputDateTime, parseLocalDateTime} from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentFormScreen({navigation}) {
  const {courses, createAssignment} = useAppData();
  const [values, setValues] = useState({courseId: courses[0]?.id || '', title: '', description: '',
    dueDate: inputDateTime(new Date(Date.now() + 86400000).toISOString())});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (key, value) => {setValues(before => ({...before, [key]: value})); setErrors(before => ({...before, [key]: undefined}));};
  const save = async () => {
    const nextErrors = validateAssignment(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {return;}
    setSaving(true);
    try {
      await createAssignment({courseId: values.courseId, title: values.title.trim(),
        description: values.description.trim(), dueDate: parseLocalDateTime(values.dueDate)});
      navigation.goBack();
    } catch (e) {Alert.alert('Không lưu được bài tập', e.message);}
    finally {setSaving(false);}
  };
  return <ScreenContainer scroll>
    <Text style={styles.title}>Thêm bài tập</Text>
    <FormInput label="Tiêu đề" value={values.title} onChangeText={text => set('title', text)} error={errors.title} />
    <Text style={styles.label}>Môn học</Text>
    <FilterChips options={courses.map(course => ({label: course.code, value: course.id}))}
      selected={values.courseId} onSelect={id => set('courseId', id)} />
    {errors.courseId ? <Text style={styles.error}>{errors.courseId}</Text> : null}
    <FormInput label="Mô tả" value={values.description} onChangeText={text => set('description', text)} multiline />
    <FormInput label="Hạn nộp (dd/MM/yyyy HH:mm)" value={values.dueDate} onChangeText={text => set('dueDate', text)}
      error={errors.dueDate} keyboardType="numbers-and-punctuation" />
    <AppButton title="Lưu bài tập" onPress={save} loading={saving} />
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  title: {...typography.h1, color: colors.text}, label: {...typography.body, color: colors.text, fontWeight: '600'},
  error: {...typography.small, color: colors.danger, marginTop: spacing.xs},
});
