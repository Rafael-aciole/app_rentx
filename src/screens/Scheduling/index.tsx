import React, { useState } from 'react'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import { BackButon } from '../../components/BackButon';
import { Alert, StatusBar } from 'react-native';
import { Button } from '../../components/Button';
import { Calendar, DayProps, generateInterval, MarkedDateProps } from '../../components/Calendar';
import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { CarDTO } from '../../dtos/CarDTO';

import ArroSvg from '../../assets/arrow.svg';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DataInfo,
  DataTitle,
  DateValue,
  Content,
  Footer
} from './styles'; 



interface RentalPeriod{
  start: string;
  end: string
}

interface Params{
  car: CarDTO;
}

export function Scheduling(){
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)

  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const { car } = route.params as Params;

  function handleConfirmRental(){
    if(!rentalPeriod.start || !rentalPeriod.end){
      Alert.alert('Selecione a Data para Alugar o Carro!');
    }else{
      navigation.navigate('SchedulingDetails',{
        car,
        dates: Object.keys(markedDates)
      });
    }
    
  }

  function handleBack(){
    navigation.goBack();
  }

  function handleChangeDate(date: DayProps){
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp){
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      start: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      end: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
    })
  }

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
           Escolha uma{'\n'}
           data de início e{'\n'}
           fim do aluguel
       </Title>

       <RentalPeriod>

         <DataInfo>
            <DataTitle>DE</DataTitle>
            <DateValue selected={!!rentalPeriod.start} >{rentalPeriod.start}</DateValue>
         </DataInfo>

         <ArroSvg />

         <DataInfo>
            <DataTitle>ATÉ</DataTitle>
            <DateValue selected={!!rentalPeriod.end} >{rentalPeriod.end}</DateValue>
         </DataInfo>
       </RentalPeriod>     

     </Header>

    <Content>
      <Calendar 
        markedDates={markedDates}
        onDayPress={handleChangeDate}
      />
    </Content>

    <Footer>
      <Button enabled={!!rentalPeriod.end} title='Confirmar' onPress={handleConfirmRental} />
    </Footer>

   </Container>
  );
}