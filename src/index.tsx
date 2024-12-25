import React, { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";

type Center = {
  x: number;
  y: number;
};

type Position = {
  x: number;
  y: number;
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10000,
    backgroundColor: "gray",
    position: "relative",
  },
  number: {
    position: "absolute",
    fontSize: 20,
    fontWeight: 'bold',
    height:30,
    width:30,
    textAlign:"center",
    textAlignVertical:"center"
  },
  indicatorLine: {
    position: "absolute",
    width: 2,
    backgroundColor: "lightgray",
    transformOrigin: "bottom",
  },
  selectedNumber:{
    backgroundColor:"lightgray",
    borderRadius:100,
    height: 30, 
    width: 30,  
    position: "absolute",
    justifyContent:"center",
    alignContent:"center"



  }
});

function TimeComponent({ rotationDegree, center,radius }: { rotationDegree: number; center: Center,radius:number }) {
  return (
    <View
      style={{
        ...styles.indicatorLine,
        height: radius-(30+15),
        transform: [{ rotate: `${rotationDegree}deg` }],
        top: center.y -(radius-(30+15)),
      }}
    />
  );
}

export default function TimePicker({radius}:{radius:number}) {
  const [layout, setLayout] = useState<{ width: number; height: number; positions: Position[] } | null>(null);
  const hours = Array.from({ length: 12 }, (_, index) => index + 1);
  const [hour, setHour] = useState<number>(0);
  const [center, setCenter] = useState<Center>({ x: 0, y: 0 });

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    const centerX = width / 2;
    const centerY = height / 2;
    const numbersRadius=radius-30;
    const updatedPositions: Position[] = [];

    setCenter({ x: centerX, y: centerY });

    for (let i = 0; i < hours.length; i++) {
      const angle = ((i * Math.PI / (hours.length / 2)) - (Math.PI / 2)) ;
      const x = centerX + numbersRadius * Math.cos(angle);
      const y = centerY + numbersRadius * Math.sin(angle);
      updatedPositions.push({ x, y });
    }

    setLayout({ width, height, positions: updatedPositions });
  };

  const getIndicatorRotation = (index: number) => {
    return ((index / 12) * 360 );
  };

  return (
      <View style={[styles.container,{height:radius*2,width:radius*2}]} onLayout={handleLayout}>
        {layout?.positions?.map((position, index) => (
          <React.Fragment key={index}>
            <Text
              onPress={() => setHour(index )}
              style={[{
                ...styles.number,
                left: position.x -15,
                top: position.y -15,
               
              },
              hour===index && styles.selectedNumber
            ]}
            >
              {hours[index]}
            </Text>

            <TimeComponent radius={radius} rotationDegree={getIndicatorRotation(hour)} center={center} />
          </React.Fragment>
        ))}
      </View>
  );
}
