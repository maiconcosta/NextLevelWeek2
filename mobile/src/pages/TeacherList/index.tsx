import React, { useState, ReactText } from 'react';
import { Text, View, ScrollView } from 'react-native';
import {
  BorderlessButton,
  RectButton,
  TextInput,
} from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';
import { useFocusEffect } from '@react-navigation/native';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import api from '../../services/api';
import styles from './styles';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<Number[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [subject, setSubject] = useState<ReactText>('');
  const [week_day, setWeekDay] = useState<ReactText>('');
  const [time, setTime] = useState('');

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then((response) => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map(
          (teacher: Teacher) => {
            return teacher.id;
          }
        );

        setFavorites(favoritedTeachersIds);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  });

  function handleToggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  async function handleFiltersSubmit() {
    loadFavorites();

    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      },
    });

    setIsFiltersVisible(false);
    setTeachers(response.data);
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight={
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#FFF" />
          </BorderlessButton>
        }
      >
        {isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={subject}
                onValueChange={(itemValue) => setSubject(itemValue)}
              >
                <Picker.Item label="Selecione uma matéria" value="" />
                <Picker.Item label="Artes" value="Artes" />
                <Picker.Item label="Biologia" value="Biologia" />
                <Picker.Item label="Ciências" value="Ciências" />
                <Picker.Item label="Educação Física" value="Educação Física" />
                <Picker.Item label="Geografia" value="Geografia" />
                <Picker.Item label="História" value="História" />
                <Picker.Item label="Matemática" value="Matemática" />
                <Picker.Item label="Português" value="Português" />
                <Picker.Item label="Química" value="Química" />
              </Picker>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <View style={styles.input}>
                  <Picker
                    selectedValue={week_day}
                    onValueChange={(itemValue) => setWeekDay(itemValue)}
                  >
                    <Picker.Item label="Selecione o Dia" value="" />
                    <Picker.Item label="Domingo" value="0" />
                    <Picker.Item label="Segunda-feira" value="1" />
                    <Picker.Item label="Terça-feira" value="2" />
                    <Picker.Item label="Quarta-feira" value="3" />
                    <Picker.Item label="Quinta-feira" value="4" />
                    <Picker.Item label="Sexta-feira" value="5" />
                    <Picker.Item label="Sábado" value="6" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={(text) => setTime(text)}
                  placeholder="Qual Horário"
                />
              </View>
            </View>
            <RectButton
              onPress={handleFiltersSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teachers.map((teacher: Teacher) => (
          <TeacherItem
            key={teacher.id}
            teacher={teacher}
            favorited={favorites.includes(teacher.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default TeacherList;
