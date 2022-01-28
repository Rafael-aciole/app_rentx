import React, { useEffect, useState } from 'react'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { api } from '../../services/api';
import { Accessory } from '../../components/Accessory';
import { BackButon } from '../../components/BackButon';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { Alert } from 'react-native';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Acessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValeu,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal
} from './styles'; 

interface Params{
  car: CarDTO;
  dates: string[];
}

interface RentalPeriod{
  start: string;
  end: string;
}

export function SchedulingDetails(){
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  const theme = useTheme()
  const navigation = useNavigation();
  const route = useRoute();
  const { car, dates } = route.params as Params;

  const rentTotal = Number(dates.length * car.rent.price);

  async function handleConfirm(){
    setLoading(true);
    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);

    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...dates,
    ];

    await api.post('schedules_byuser', {
      user_id: 2,
      car,
      startDate: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      endDate: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
    });

    api.put(`/schedules_bycars/${car.id}`,{
      id: car.id,
      unavailable_dates
    }).then(() => navigation.navigate('SchedulingComplete'))
    .catch(() => {
      setLoading(false);
      Alert.alert('Não foi possível confirmar o agendamento.')
    })
  }

  function handleBack(){
    navigation.goBack();
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
    })
  }, [])

  return (
   <Container>
     <Header>
       <BackButon onPress={handleBack} /> 
     </Header>

    <CarImages>
      <ImageSlider
        imagesUrl={car.photos}
      />
     </CarImages>

     <Content>
       <Details>
         <Description>
           <Brand>{car.brand}</Brand>
           <Name>{car.name}</Name>
         </Description>

         <Rent>
           <Period>{car.rent.period}</Period>
           <Price>R$ {car.rent.price}</Price>
         </Rent>
       </Details>

      <Acessories>
        {
          car.accessories.map(accessory =>(
            <Accessory 
              key={accessory.type}
              name={accessory.name}
              icon={getAccessoryIcon(accessory.type)}
            />
          ))
        }
        
      </Acessories>
       
      <RentalPeriod>
        <CalendarIcon>
          <Feather 
            name="calendar"
            size={RFValue(24)}
            color={theme.colors.shape}
          />
        </CalendarIcon>

        <DateInfo>
          <DateTitle>DE</DateTitle>
          <DateValeu>{rentalPeriod.start}</DateValeu>
        </DateInfo>

        <Feather 
            name="chevron-right"
            size={RFValue(10)}
            color={theme.colors.text}
          />

        <DateInfo>
          <DateTitle>ATÉ</DateTitle>
          <DateValeu>{rentalPeriod.end}</DateValeu>
        </DateInfo>

      </RentalPeriod>
       
      <RentalPrice>
        <RentalPriceLabel>TOTAL</RentalPriceLabel>
        <RentalPriceDetails>
          <RentalPriceQuota>{`R$ ${car.rent.price} x${dates.length} diárias`}</RentalPriceQuota>
          <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
        </RentalPriceDetails>
      </RentalPrice>

     </Content>

    <Footer>
      <Button 
        title="Alugar Agora" 
        color={theme.colors.success} 
        onPress={handleConfirm} 
        enabled={!loading}
        loading={loading}
        />
       
    </Footer>
    


   </Container>
  );
}