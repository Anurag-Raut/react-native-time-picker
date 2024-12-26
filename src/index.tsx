import React, {  useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { StyleSheet, Text, View, PanResponder, Animated, type PanResponderGestureState } from "react-native";

type Center = {
  x: number;
  y: number;
};

type Position = {
  x: number;
  y: number;
};
type Element = {
  value: number,
  position: Position
}

const colors = {
  selectedColor: 'rgba(255, 99, 85, 1)',
  selectedColorBackground: "rgba(255, 99, 85, 0.1)",
  unSelectedColorBackground: "lightgray",
  unSelectedColor: "rgba(0, 0, 0, 1)"
}


const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },
  topComponent: {
    flexDirection: "row",
    gap: 10,


  },
  topComponentText: {
    fontSize: 20,
    backgroundColor: colors.unSelectedColorBackground,
    padding: 10,
    borderRadius: 8,
    fontWeight: "500",

  },
  clockContainer: {
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10000,
    backgroundColor: "gray",
    position: "relative",
  },
  clock: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10000,
    position: "absolute",
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
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 1
  },
  selectedNumber: {
    backgroundColor: "lightgray",
    borderRadius: 100,
    height: 30,
    width: 30,
    position: "absolute",
    justifyContent: "center",
    alignContent: "center",
    zIndex: 10
  },
  indicatorEndComponent: {
    backgroundColor: "red",
    width: 10,
    height: 10,
    borderRadius: 11000
  },
  centerComponent: {
    backgroundColor: "black",
    width: 10,
    height: 10,
    borderRadius: 10000,
    zIndex: 10,

  },
  AmPmContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: colors.selectedColorBackground,

  },
  AmPmContainerText: {
    fontSize: 12,
    paddingHorizontal: 8,
    color: colors.unSelectedColor,


  }
});

const getIndicatorRotation = (index: number, noOfElements: number) => {
  return (index / noOfElements) * 360;
};


function ElementsComponent({
  radius,
  elements,
  value,
  setValue,
  center,
  step = 1
}: {
  radius: number
  elements: Element[]
  value: number
  setValue: Dispatch<SetStateAction<number>>
  center: Center
  step: number
}) {

  return (
    <>
      {elements?.map(({ position }, index) => (
        <React.Fragment key={index}>
          {
            (index % step )=== 0 &&
            <Text

              onPress={() => setValue(index)}
              style={[
                {
                  ...styles.number,
                  left: position.x - 15,
                  top: position.y - 15,
                },
                (value === index) && styles.selectedNumber,
              ]}
            >
              {elements[index]?.value}
            </Text>
          }

        </React.Fragment>
      ))}
      <View
        style={{
          ...styles.indicatorLine,
          height: radius - (25),
          transform: [{ rotate: `${getIndicatorRotation(value, elements.length)}deg` }],
          top: center.y - (radius - (25)),
        }}
      >
        <View style={styles.indicatorEndComponent} />
      </View>
    </>
  )
}

export default function TimePicker({ radius }: { radius: number }) {
  const containerRef = useRef<View | null>(null);
  const [layout, setLayout] = useState<{ width: number; height: number; screenCenter: Center; } | null>(null);
  const hours = [12, ...Array.from({ length: 11 }, (_, index) => index + 1)];
  const minutes = Array.from({ length: 60 }, (_, index) => index);

  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<"am" | "pm">("am")
  const [isHourMode, setIsHourMode] = useState(true);

  const [center, setCenter] = useState<Center>({ x: 0, y: 0 });
  const [hourElements, setHourElements] = useState<Element[]>([]);
  const [minuteElements, setMinuteElements] = useState<Element[]>([]);

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    const centerX = width / 2;
    const centerY = height / 2;
    const numbersRadius = radius - 30;
    const hourElements: Element[] = [];
    const minuteElements: Element[] = [];

    setCenter({ x: centerX, y: centerY });

    for (let i = 0; i < hours.length; i++) {
      const angle = (i * Math.PI) / (hours.length / 2) - Math.PI / 2;
      const x = centerX + numbersRadius * Math.cos(angle);
      const y = centerY + numbersRadius * Math.sin(angle);
      hourElements.push({ position: { x, y }, value: hours[i]! });
    }
    for (let i = 0; i < minutes.length; i++) {
      const angle = (i * Math.PI) / (minutes.length / 2) - Math.PI / 2;
      const x = centerX + numbersRadius * Math.cos(angle);
      const y = centerY + numbersRadius * Math.sin(angle);
      ({ position: { x, y }, value: minutes[i]! });
      minuteElements.push({ position: { x, y }, value: minutes[i]! });
    }
    let screenX = 0, screenY = 0;
    containerRef.current?.measure((_, __, ___, ____, scrX: number, scrY: number) => {
      screenX = scrX;
      screenY = scrY

    })
    setHourElements(hourElements)
    setMinuteElements(minuteElements)
    setLayout({ width, height, screenCenter: { x: screenX, y: screenY } });
  };

  const updateValue = (value: number, isHourMode: boolean) => {
    if (isHourMode) {
      setHour(value);
    }
    else {
      setMinute(value)
    }
  };

  const getClosetElement = (handX: number, handY: number, elements: Element[], callBack: (index: number) => void) => {
    let closest = 0;
    let closestDistance = 1000000
    for (let i = 0; i < elements.length; i++) {
      let { position } = elements[i]!;
      let { x, y } = position;
      const distance = Math.abs(handX - x) + Math.abs(handY - y);
      if (distance < closestDistance) {
        closestDistance = distance
        closest = i;
      }
    }
    callBack(closest)
  }

  const throttledUpdate = (gestureState:PanResponderGestureState, elements: Element[]) => {
    const positionXScreen = gestureState.moveX - (layout?.screenCenter?.x ?? 0);
    const positionYScreen = gestureState.moveY - (layout?.screenCenter?.y ?? 0);
    getClosetElement(positionXScreen, positionYScreen, elements, (index) => {
      updateValue(index, isHourMode)
    });

  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      throttledUpdate(gestureState, isHourMode ? hourElements : minuteElements);
    },

  });

  const switchAnimation = useRef(new Animated.Value(1)).current;

  function switchMode(isHourMode: boolean) {
    Animated.timing(switchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      // Callback after first animation completes
      setIsHourMode(isHourMode)

      // Start the second animation
      Animated.timing(switchAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }

  const scaleValue = switchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1.2, 1], 
  });
  
  


  return (
    <View style={styles.container}
    >
      <View style={styles.topComponent}>
        <Text onPress={() => switchMode(true)} style={[styles.topComponentText, isHourMode && { color: colors.selectedColor, backgroundColor: colors.selectedColorBackground }]}>
          {hour.toString().padStart(2, "0")}
        </Text>
        <Text onPress={() => switchMode(false)} style={[styles.topComponentText, !isHourMode && { color: colors.selectedColor, backgroundColor: colors.selectedColorBackground }]}>
          {minute.toString().padStart(2, "0")}
        </Text>
        <View style={styles.AmPmContainer}>
          <Text onPress={() => setPeriod("am")} style={[styles.AmPmContainerText, period === "am" && { backgroundColor: colors.selectedColorBackground, color: colors.selectedColor }]}>
            AM
          </Text>
          <Text onPress={() => setPeriod("pm")} style={[styles.AmPmContainerText, period === "pm" && { backgroundColor: colors.selectedColorBackground, color: colors.selectedColor }]}>
            PM
          </Text>
        </View>
      </View>
      <View
        ref={containerRef}
        {...panResponder.panHandlers}
        style={[styles.clockContainer, { height: radius * 2, width: radius * 2 }]}
        onLayout={handleLayout}
      >
        <View style={styles.centerComponent} />
        <Animated.View
          style={[styles.clock,

          {
            opacity: switchAnimation,
            transform: [
              {
                scale: scaleValue, 
              },
            ],
      
          }
          ]}
        >

          <ElementsComponent
            radius={radius}
            value={isHourMode ? hour : minute}
            setValue={isHourMode ? setHour : setMinute}
            elements={isHourMode ? hourElements : minuteElements}
            center={center}
            step={isHourMode ? 1 : 5}

          />
        </Animated.View>

      </View>
    </View>
  );
}
