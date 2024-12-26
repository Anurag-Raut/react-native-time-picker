import React, { useReducer, useRef, useState } from 'react';
import { StyleSheet, Text, View, PanResponder, UIManager } from "react-native";
import throttle from "lodash.throttle";

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
    fontWeight: "bold",
    height: 30,
    width: 30,
    textAlign: "center",
    textAlignVertical: "center",
  },
  indicatorLine: {
    position: "absolute",
    width: 2,
    backgroundColor: "lightgray",
    transformOrigin: "bottom",
  },
  selectedNumber: {
    backgroundColor: "lightgray",
    borderRadius: 100,
    height: 30,
    width: 30,
    position: "absolute",
    justifyContent: "center",
    alignContent: "center",
  },
});

export default function TimePicker({ radius }: { radius: number }) {
  const containerRef=useRef();
  const [layout, setLayout] = useState<{ width: number; height: number;screenCenter:Center ;positions: Position[] } | null>(null);
  const hours = Array.from({ length: 12 }, (_, index) => index + 1);
  const [hour, setHour] = useState<number>(0);
  const [center, setCenter] = useState<Center>({ x: 0, y: 0 });

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    const centerX = width / 2;
    const centerY = height / 2;
    const numbersRadius = radius - 30;
    const updatedPositions: Position[] = [];
    setCenter({ x: centerX, y: centerY });

    for (let i = 0; i < hours.length; i++) {
      const angle = (i * Math.PI) / (hours.length / 2) - Math.PI / 2;
      const x = centerX + numbersRadius * Math.cos(angle);
      const y = centerY + numbersRadius * Math.sin(angle);
      updatedPositions.push({ x, y });
    }
    let screenX=0,screenY=0;
    containerRef.current?.measure((x,y)=>{
      console.log("PAGE",x,y)
      screenX=x;
      screenY=y
    })
    
    setLayout({ width, height, positions: updatedPositions ,screenCenter:{x:screenX,y:screenY}});
  };

  const getIndicatorRotation = (index: number) => {
    return (index / 12) * 360;
  };

  const calculateHourFromAngle = (angle: number) => {
    const normalizedAngle = (angle + 360) % 360;
    const index = Math.round(normalizedAngle / 30) % 12; // 360/12 = 30 degrees per hour
    return index;
  };

  const calculateAngle = (touchX: number, touchY: number) => {
    const deltaX = touchX - (layout?.screenCenter?.x??0);
    const deltaY = touchY - (layout?.screenCenter?.y??0);
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert radians to degrees
    angle = (angle + 360 + 90) % 360; // Normalize and adjust to start from 12 o'clock
    return angle;
  };
  

  const updateHour = (newHour: number) => {
    setHour(newHour);
  };

  const getClosetElement=(handX:number,handY:number,positions:Position[],callBack:(index:number)=>void)=>{
    let closest=0;
    let closestDistance=1000000
    for(let i=0 ;i<positions.length ;i++){
      let {x,y}=positions[i]!;
      const distance=Math.abs(handX-x)+ Math.abs(handY-y);
      if(distance<closestDistance){
        closestDistance=distance
        closest=i;
      }
    }
    callBack(closest)
  }

  const throttledUpdate = throttle((gestureState) => {
    console.log(gestureState.moveX-(layout?.screenCenter?.x??0), gestureState.moveY-(layout?.screenCenter?.y??0),'valus')
    getClosetElement(gestureState.moveX-(layout?.screenCenter?.x??0), gestureState.moveY-(layout?.screenCenter?.y??0),layout?.positions,(index)=>{
      updateHour(index)
    });
 
  }, 20); 

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      throttledUpdate(gestureState);
    },
    onPanResponderRelease: (_, gestureState) => {
      const angle = calculateAngle(gestureState.moveX, gestureState.moveY);
      const newHour = calculateHourFromAngle(angle);
      setHour(newHour);
    },
  });

  return (
    <View
      {...panResponder.panHandlers}
      style={[styles.container, { height: radius * 2, width: radius * 2 }]}
      onLayout={handleLayout}
      ref={containerRef}
    >
      {layout?.positions?.map((position, index) => (
        <React.Fragment key={index}>
          <Text
            onPress={() => setHour(index)}
            style={[
              {
                ...styles.number,
                left: position.x - 15,
                top: position.y - 15,
              },
              hour === index && styles.selectedNumber,
            ]}
          >
            {hours[index]}
          </Text>
          <View
            style={{
              ...styles.indicatorLine,
              height: radius - (30 + 15),
              transform: [{ rotate: `${getIndicatorRotation(hour)}deg` }],
              top: center.y - (radius - (30 + 15)),
            }}
          />
        </React.Fragment>
      ))}
    </View>
  );
}
