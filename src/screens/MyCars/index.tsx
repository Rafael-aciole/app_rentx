import React, { useEffect, useState } from 'react'; 
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';
import { StatusBar, FlatList } from 'react-native';
import { BackButon } from '../../components/BackButon';
import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Car } from '../../components/Car';
import { Load } from '../../components/Load';

import { AntDesign } from '@expo/vector-icons';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantoty,
  CarWapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate
} from './styles'; 

interface CarProps{
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string;
  endDate: string;
}

export function MyCars(){
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const navigation = useNavigation();

  function handleBack(){
    navigation.goBack();
  }

  useEffect(() =>{
    async function fetchCars() {
      try {
        const response = await api.get('/schedules_byuser?user_id=2');
        console.log(response.data);
        setCars(response.data);
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }

    fetchCars();
  },[]);

  return (
   <Container>
      <Header>

      <StatusBar 
      barStyle="light-content"
      translucent
      backgroundColor="transparent"
      />

      <BackButon
      onPress={handleBack}
      color={theme.colors.shape} 
      /> 

      <Title>
        Seus agendamentos{'\n'}
        estão aqui!
      </Title>
      
      <SubTitle>
        Conforto, segurança e praticidade
      </SubTitle>

      </Header>

      { loading ? <Load /> :
        <Content>
            <Appointments>
              <AppointmentsTitle>Agendamentos Feitos</AppointmentsTitle>
              <AppointmentsQuantoty>{cars.length}</AppointmentsQuantoty>
            </Appointments>
          

          <FlatList 
            data={cars}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <CarWapper>
                <Car data={item.car} />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.startDate}</CarFooterDate>
                    <AntDesign 
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{marginHorizontal: 10}}
                    />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWapper>
            )}
          />
        </Content>
      }     
   </Container>
  );
}