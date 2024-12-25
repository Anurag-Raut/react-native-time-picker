import React, { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";

type Center = {
  x: number;
  y: number
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "gray",
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    position: "relative",
  },
  number: {
    position: "absolute",
    fontSize: 20,
    fontWeight: 'bold',
  },
  indicatorLine: {
    position: "absolute",
    width: 2,
    backgroundColor: "black",
    transformOrigin: "bottom",
  },
});

function TimeComponent({ rotationDegree, center }: {
  rotationDegree: number;
  center: Center
}) {

  
  return (


    <View
      style={{
        ...styles.indicatorLine,
        height: 70,
        transform: [{ rotate: `${rotationDegree}deg` }],
        top: center.y - 70,
      }}
    />

  );
}

export default function TimePicker() {
  const [layout, setLayout] = useState(null); // To store container layout
  const hours = Array.from({ length: 12 }, (_, index) => index + 1);
  const [hour, setHour] = useState(0);


  const [center,setCenter]=useState<Center>({
    x:0,
    y:0
  })
  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 70; 
    const [position,setPosition] =useState<Array<{x:number,y:number}>>([]);
    setCenter({
      x:centerX,
      y:centerY
    })

    for (let i = 0; i < hours.length; i++) {
      const angle = ((i * Math.PI / (hours.length/2)) - Math.PI / 2);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      updatedPositions.push({ x, y });
    }

  };
  const getIndicatorRotation = (index) => {
    return ((index / 12) * 360) - 90;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <TimeComponent hour={hour} /> */}
      <View style={styles.container} onLayout={handleLayout}>
        {layout?.positions?.map((position, index) => (
          <React.Fragment key={index}>
            <Text
              style={{
                ...styles.number,
                left: position.x - 10,
                top: position.y - 10,
              }}
            >
              {hours[index]}
            </Text>

            <TimeComponent rotationDegree={getIndicatorRotation(hour)} center={center} />
          </React.Fragment>
        ))}
      </View>
      {/* Buttons or controls for selecting the hour */}
      {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
        {Array.from({ length: 12 }, (_, index) => (
          <Text
            key={index}
            style={{
              fontSize: 24,
              marginHorizontal: 10,
              color: index + 1 === hour ? 'blue' : 'black',
            }}
            onPress={() => setHour(index + 1)}
          >
            {index + 1}
          </Text>
        ))}
      </View> */}
    </View>
  );
}
